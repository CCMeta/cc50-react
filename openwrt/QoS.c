#include <stdio.h>
#include <stdlib.h>

enum DIRECTION
{
  QOS_UPLOAD = 1,
  QOS_DOWNLOAD = 2
};

int set_qos(char mac[], int queue, enum DIRECTION direction)
{
  char cmd[1024];

  switch (direction)
  {
  case QOS_UPLOAD:
    // direction = 1 means set upload limit

    // set iptable or ebtables
    // first check of have rule of this mac, delete him.
    sprintf(cmd, "ebtables -D INPUT $(ebtables -L INPUT | grep -i %s) > /dev/null 2>&1", mac);
    system(cmd);

    // now add the new rule to ebtables
    sprintf(cmd, "ebtables -A INPUT -s %s -j mark --set-mark %d > /dev/null 2>&1", mac, queue);
    system(cmd);

    // uci save this rule, cause host can reboot or crash
    sprintf(cmd, "uci set hellapi.qos=qos");
    system(cmd);
    sprintf(cmd, "uci add_list hellapi.qos.upload=%s_%d", mac, queue);
    system(cmd);
    system("uci commit");
    break;

  case QOS_DOWNLOAD:
  default:
    // direction = 2 means set download limit

    // set iptable or ebtables
    // first check of have rule of this mac, delete him.
    sprintf(cmd, "ebtables -D OUTPUT $(ebtables -L OUTPUT | grep -i %s) > /dev/null 2>&1", mac);
    system(cmd);

    // now add the new rule to ebtables
    sprintf(cmd, "ebtables -A OUTPUT -d %s -j mark --set-mark %d > /dev/null 2>&1", mac, queue);
    system(cmd);

    // uci save this rule, cause host can reboot or crash
    sprintf(cmd, "uci set hellapi.qos=qos");
    system(cmd);
    sprintf(cmd, "uci add_list hellapi.qos.download=%s_%d", mac, queue);
    system(cmd);
    system("uci commit");
    break;
  }

  return 0;
}

int set_qos_both(char mac[], int queue_rx, int queue_tx)
{
  char cmd[1024];
  {
    // direction = 2 means set download limit
    sprintf(cmd, "ebtables -D OUTPUT $(ebtables -L OUTPUT | grep -i %s) > /dev/null 2>&1", mac);
    system(cmd);

    // now add the new rule to ebtables
    sprintf(cmd, "ebtables -A OUTPUT -d %s -j mark --set-mark %d > /dev/null 2>&1", mac, queue_rx);
    system(cmd);
  }
  {
    // set iptable or ebtables
    // first check of have rule of this mac, delete him.
    sprintf(cmd, "ebtables -D INPUT $(ebtables -L INPUT | grep -i %s) > /dev/null 2>&1", mac);
    system(cmd);

    // now add the new rule to ebtables
    sprintf(cmd, "ebtables -A INPUT -s %s -j mark --set-mark %d > /dev/null 2>&1", mac, queue_tx);
    system(cmd);
  }
  
  // uci save this rule, cause host can reboot or crash
  sprintf(cmd, "uci set hellapi.qos=qos");
  system(cmd);
  sprintf(cmd, "uci add_list hellapi.qos.clients=%s_%d_%d", mac, queue_rx, queue_tx);
  system(cmd);
  system("uci commit");

  return 0;
}

int main(int argc, const char **argv)
{

  char *mac;
  int *queue_rx;
  int *queue_tx;

  for (int i = 0; i < argc; i++)
  {
    *mac = argv[i][1];
    *queue_rx = argv[i][2];
    *queue_tx = argv[i][3];
    set_qos_both(mac, *queue_rx, *queue_tx);
  }

  return 0;
}