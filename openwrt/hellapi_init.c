#include <stdlib.h>
#include <stdio.h>
// cause MTK modem policy, when modem is down the ccmni interface order number may change as random
// e.g: ccmni1 => ccmni11
int seek_current_modem()
{
	char *currentModem;

	// ubus call network.interface.wan dump
	// or
	// ifconfig  ifconfig | grep ccmni
	// currentModem = "$currentModem";

	system("uci set hellapi.settings=settings");
	system("uci set hellapi.settings.currentModem=$(ifconfig | grep ccmni | cut -d ' ' -f 0)");
	system("uci commit");

	// So, when sb call hellapi he need to find current modem interface from uci.
	// like vnstat, cat /sys/class/net/ccmni/blabla
	return 0;
}

// To fix wifi initial quectel fuck MTK policy issue.
int wifi_reload()
{
	// random wifi name both 24g & 5g
	// cat /sys/class/net/eth0/address | cut -c 16-18  get mac_address last 2 bytes.
	system("sed -ie \"s/CC50_24G/CC50_$(cat /sys/class/net/eth0/address | cut -c 16-17)_24G/\" /etc/wireless/mediatek/mt7915.dbdc.b0.dat ");
	system("sed -ie \"s/CC50_5G/CC50_$(cat /sys/class/net/eth0/address | cut -c 16-17)_5G/\" /etc/wireless/mediatek/mt7915.dbdc.b1.dat ");
	system("wifi reload");
	return 0;
}

int vnstat_init()
{
	char cmd[256];
	// ccmni0 => ccmni20
	for (int i = 0; i < 21; i++)
	{
		sprintf(cmd, "vnstat --create -i ccmni%d", i);
		if (system(cmd) != 0)
			return -1;
	}
	// system("vnstat --create -i $(uci get hellapi.settings.currentModem)");
	system("vnstat -u");
	return 0;
}

int main()
{
	if (seek_current_modem() != 0)
	{
		printf("seek_current_modem fucked!");
		return -1;
	}

	if (vnstat_init() != 0)
	{
		printf("vnstat_init fucked!");
		return -1;
	}

	if (wifi_reload() != 0)
	{
		printf("wifi_reload fucked!");
		return -1;
	}

	printf("hellapi_init run finished!");
	return 0;
}
