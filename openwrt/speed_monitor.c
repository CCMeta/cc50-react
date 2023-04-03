/*

    *Copyright :

    *Copyright (c) 2021, Quectel Wireless Solutions Co., Ltd. All rights reserved.

    *Quectel Wireless Solutions Proprietary and Confidential.
*/

#include "lib_speed_monitor.h"
#include<time.h>
#include <stdio.h>

#define QL_LAN_POP_DEVICES_SPEED		(0x01)
#define QL_LAN_POP_DEVICES_TOTAL		(0x02)
#define T_1MS 1000

void pr_help(void)
{
  printf("debug lan devices tool version:%s\r\n \
          speed_monitor -a [mac_addr]\r\n \
      speed_monitor -a/A:     #pop all lan devices total packets if use 'A' open speed_monitor debug log\r\n \
      speed_monitor -a/A 6c:16:32:0d:55:49 [-d]   #pop assign lan devices(6c:16:32:0d:55:49) total packets if use 'A' open speed_monitor debug log\r\n", \
      SPEED_MIT_VERSION);
}

void dump_data(void *arg_in)
{
  int i = 0;
  struct hwnat_mib_all_ip_mac_args_total *argsSpeed = NULL;
  argsSpeed = (struct hwnat_mib_all_ip_mac_args_total *)arg_in;
  printf("dump_data \n");
  // ccmeta 20230403
  system("uci set vnstat.clients=clients");
  printf("uci set vnstat.clients=clients \n");
  system("uci delete vnstat.clients.client");
  printf("uci delete vnstat.clients.client \n");

  char fuck[1024]={0};
  printf("\r\n==================entry_num===================================\r\n");
  printf("MAC            tx/bps          rx/bps            tx                rx\n");
  for(i=0; i<argsSpeed->total_num; i++) {
      sprintf(fuck, "uci add_list vnstat.clients.client=\"%02X:%02X:%02X:%02X:%02X:%02X_%ld_%ld\"",
              NMACQUAD(argsSpeed->entries[i].packets_total.mac_addr),
              argsSpeed->entries[i].packets_total.packets.tx_bytes,
              argsSpeed->entries[i].packets_total.packets.rx_bytes);
      printf("sprintf OK =  %s \n",fuck);
      system(fuck);
        printf("%02X:%02X:%02X:%02X:%02X:%02X   %12ld %12ld        %16ld  %16ld \n",
          NMACQUAD(argsSpeed->entries[i].packets_total.mac_addr),
          argsSpeed->entries[i].packets_currect.packets.tx_bytes*8,
          argsSpeed->entries[i].packets_currect.packets.rx_bytes*8,
          argsSpeed->entries[i].packets_total.packets.tx_bytes*8,
          argsSpeed->entries[i].packets_total.packets.rx_bytes*8);
  }
  system("uci commit");
  printf("uci commit \n");
}

void showTotal(unsigned char *mac_addr)
{
  int is_match_mac = 0;
  unsigned char __mac_addr[ETH_ALEN] = {0};
  struct tm *t;
  time_t tt;
  static struct hwnat_mib_all_ip_mac_args_total argsSpeed;

  serialize_mac(__mac_addr, mac_addr);

  is_match_mac = is_valid_ether_addr(mac_addr);

  printf("is_match_mac:%d %02X:%02X:%02X:%02X:%02X:%02X\r\n",
  is_match_mac, NMACQUAD(__mac_addr));

  while (1)
  {
    sleep(1);
    time(&tt);
    t = localtime(&tt);
    if(ql_pop_lan_devices_packets_total(&argsSpeed, __mac_addr, is_match_mac) != 0){
        continue;
    }
    printf("                     start                                         ");
    printf("%4dYear %02dMont %02dDay %02d:%02d:%02d\n", t->tm_year + 1900, t->tm_mon + 1, t->tm_mday, t->tm_hour, t->tm_min, t->tm_sec);

    /*SHOW IP/MAC tx_bytes & rx_bytes*/
    dump_data(&argsSpeed);
    printf("========\r\n\r\n");
  }

}

int main(int argc, char* argv[])
{
  char options[] = "haA";
  int	opt, result, method = -1;

  unsigned char assign_mac[ETH_ALEN];
  printf("< Quectel OpenLinux: speed_monitor version:%s >\n", SPEED_MIT_VERSION);
  while ((opt = getopt (argc, argv, options)) != -1) {
    // printf("argc:%d opt %c\r\n", argc, opt);
    switch (opt) {
	  case 'h':

      break;
    // case 's':
    // case 'S':
    // if(opt == 'S')
    // {
    //   set_open_debug(1);
    // }
    //   method = QL_LAN_POP_DEVICES_SPEED;

    //   break;
      case 'a':
      case 'A':
        if(opt == 'A')
        {
          set_open_debug(1);
        }
        if(argc == 3)
        {
          if(str_to_mac(assign_mac, argv[2]) != 0)
          {
            method = -1;
            break;
          }
        }
      method = QL_LAN_POP_DEVICES_TOTAL;

      break;

  }

  switch(method){
    // case QL_LAN_POP_DEVICES_SPEED:
    //   showSpeed();
    //   result = 1;
    //   break;
    case QL_LAN_POP_DEVICES_TOTAL:
      showTotal(assign_mac);
      result = 1;
      break;
    default:
	    result = 0;
  }

  }
  if(result==1){
    printf("done open_debug:%d\n", get_open_debug());
  }else {
    pr_help();
  }
  return 0;
}
