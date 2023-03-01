#include <stdlib.h>
// cause MTK modem policy, when modem is down the ccmni interface order number may change as random
// e.g: ccmni1 => ccmni11
int seekCurrentModemInterface()
{
	char *currentModem;

	// ubus call network.interface.wan dump
	// or
	// ifconfig  ifconfig | grep ccmni
	currentModem = "$currentModem";

	"uci set hellapi.set.currentModem = $currentModem";
	"vnstat --create -i $currentModem && vnstat -u";

	// So, when sb call hellapi he need to find current modem interface from uci.
	// like vnstat, cat /sys/class/net/ccmni/blabla
	return 0;
}

// To fix wifi initial quectel fuck MTK policy issue.
int wifiReload()
{
	system("wifi reload");
	return 0;
}

int main()
{
	if (seekCurrentModemInterface() != 0)
	{
		printf("seekCurrentModemInterface fucked!");
		return -1;
	}
	if (wifiReload() != 0)
	{
		printf("wifiReload fucked!");
		return -1;
	}

	printf("hellapi_init run finished!");
	return 0;
}
