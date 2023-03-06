#include <stdio.h>
#include <stdlib.h>

int set_qos(char mac[], int queue, int direction)
{
  char cmd_table[1024];

  switch (direction)
  {
  case 1:
    // direction = 1 means set upload limit

    // set iptable or ebtables
    // first check of have rule of this mac, delete him.
    sprintf(cmd_table, "ebtables -D INPUT $(ebtables -L INPUT | grep -i %s)", mac);
    system(cmd_table);

    // now add the new rule to ebtables
    sprintf(cmd_table, "ebtables -A INPUT -s %s -j mark --set-mark %d", mac, queue);
    system(cmd_table);

    // uci save this rule, cause host can reboot or crash
    sprintf(cmd_table, "uci set hellapi.qos=qos");
    system(cmd_table);
    sprintf(cmd_table, "uci add_list hellapi.qos.upload=%s_%d", mac, queue);
    system(cmd_table);
    break;

  case 0:
  case 2:
  default:
    // direction = 2 means set download limit

    // set iptable or ebtables
    // first check of have rule of this mac, delete him.
    sprintf(cmd_table, "ebtables -D OUTPUT $(ebtables -L OUTPUT | grep -i %s)", mac);
    system(cmd_table);

    // now add the new rule to ebtables
    sprintf(cmd_table, "ebtables -A OUTPUT -d %s -j mark --set-mark %d", mac, queue);
    system(cmd_table);

    // uci save this rule, cause host can reboot or crash
    sprintf(cmd_table, "uci set hellapi.qos=qos");
    system(cmd_table);
    sprintf(cmd_table, "uci add_list hellapi.qos.download=%s_%d", mac, queue);
    system(cmd_table);
    break;
  }

  return 0;
}

int main(int argc, const char **argv)
{

  
  char mac[64] = {0};
  for (int i = 0; i < argc; i++)
  {
    sprintf(mac, "%c", argv[i][1]);
    switch (argv[i][0])
    {
    case 'u':
      // upload limit setting
      set_qos(mac, argv[i][2], 1);

      break;

    case 'd':
    default:
      // download limit setting
      set_qos(mac, argv[i][2], 2);

      break;
    }
  }

  return 0;
}