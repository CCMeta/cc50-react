#include <stdio.h>
#include <stdlib.h>

int set_qos(char *mac, int queue)
{
  char cmd_table[1024];
  // set iptable or ebtables
  // first check of have rule of this mac, delete him.
  sprintf(cmd_table, "ebtables -D OUTPUT $(ebtables -L | grep %s)", mac);
  system(cmd_table);

  // now add the new rule to ebtables
  sprintf(cmd_table, "ebtables -A OUTPUT -d %s -j mark --set-mark %d", mac, queue);
  system(cmd_table);

  return 0;
}

int main()
{
  return 0;
}