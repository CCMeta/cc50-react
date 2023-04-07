#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int qos_init()
{
	// open hnat_qos
	system("echo 0 1 > /proc/hnat/hnat_qos");

	// setting the rules by default
	system("echo rate 49 0 0 0 1 1 3 > /proc/mtketh/qos");
	system("echo rate 50 0 0 0 1 3 3 > /proc/mtketh/qos");
	system("echo rate 51 0 0 0 1 5 3 > /proc/mtketh/qos");
	system("echo rate 52 0 0 0 1 7 3 > /proc/mtketh/qos");
	system("echo rate 53 0 0 0 1 9 3 > /proc/mtketh/qos");
	system("echo rate 54 0 0 0 1 1 4 > /proc/mtketh/qos");
	system("echo rate 55 0 0 0 1 3 4 > /proc/mtketh/qos");
	system("echo rate 56 0 0 0 1 5 4 > /proc/mtketh/qos");
	system("echo rate 57 0 0 0 1 7 4 > /proc/mtketh/qos");
	system("echo rate 58 0 0 0 1 9 4 > /proc/mtketh/qos");
	system("echo rate 59 0 0 0 1 1 5 > /proc/mtketh/qos");
	system("echo rate 60 0 0 0 1 3 5 > /proc/mtketh/qos");
	system("echo rate 61 0 0 0 1 5 5 > /proc/mtketh/qos");
	system("echo rate 62 0 0 0 1 7 5 > /proc/mtketh/qos");
	system("echo rate 63 0 0 0 1 9 5 > /proc/mtketh/qos");

	// seek uci hellapi.qos.clients
	char cmd_result[2048] = {0};
	char *item;
	char mac[20] = {0};
	char queue_rx[2];
	char queue_tx[2];
	const char *mark;
	{
		execute_cmd("uci -d '|' get hellapi.qos.clients", cmd_result);
		item = strtok(cmd_result, "|");
		while (item != NULL)
		{
			mark = strchr(item, '_');
			split_tx = strrchr(item, '_');
			if (mark != NULL)
			{
				int length = mark - item;
				strncpy(mac, item, length);
				strncpy(queue_rx, item + length + 1, 2);
				strncpy(queue_tx, item + length + 3, 2);

				printf("queue_rx = %s\n", queue_rx);
				printf("queue_tx = %s\n", queue_tx);
				printf("mac = %s\n", mac);

				run_set_qos(mac, queue_rx, queue_tx);
			}
			item = strtok(NULL, "|");
		}
	}
	return 0;
}

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
int wifi_init()
{
	// random wifi name both 24g & 5g
	// cat /sys/class/net/eth0/address | cut -c 16-18  get mac_address last 2 bytes.
	system("sed -ie \"s/CC50_24G/CC50_$(cat /sys/class/net/eth0/address | cut -c 13-14)$(cat /sys/class/net/eth0/address | cut -c 16-17)_24G/\" /etc/wireless/mediatek/mt7915.dbdc.b0.dat ");
	system("sed -ie \"s/CC50_5G/CC50_$(cat /sys/class/net/eth0/address | cut -c 13-14)$(cat /sys/class/net/eth0/address | cut -c 16-17)_5G/\" /etc/wireless/mediatek/mt7915.dbdc.b1.dat ");
	system("wifi reload");
	return 0;
}

// To fix initial all modem interface cause no sure when MTK random which, data will be split
int vnstat_init()
{
	char cmd[256];
	// ccmni0 => ccmni20
	for (int i = 0; i < 21; i++)
	{

		sprintf(cmd, "uci add_list vnstat.@vnstat[0].interface=ccmni%d", i);
		if (system(cmd) != 0)
			return -1;
	}
	// system("vnstat --create -i $(uci get hellapi.settings.currentModem)");
	system("uci commit");
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

	if (wifi_init() != 0)
	{
		printf("wifi_reload fucked!");
		return -1;
	}

	if (qos_init() != 0)
	{
		printf("qos_init fucked!");
		return -1;
	}

	printf("hellapi_init run finished!");
	return 0;
}
