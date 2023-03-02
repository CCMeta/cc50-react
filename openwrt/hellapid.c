
int show_speed()
{
  static struct hwnat_mib_all_ip_mac_args_total argsSpeed; // define clients speed array
  if (ql_pop_lan_devices_packets_total(&argsSpeed) == 0)
  {
    // argsSpeed is changed

    // argsSpeed->entries[i].packets_total.mac_addr
    /*
          argsSpeed->entries[i].packets_currect.packets.tx_bytes,
          argsSpeed->entries[i].packets_currect.packets.rx_bytes,
          argsSpeed->entries[i].packets_total.packets.tx_bytes,
          argsSpeed->entries[i].packets_total.packets.rx_bytes
    */

    uci set hellapi.speed.data = argsSpeed // save new value to uci 
    uci set hellapi.speed.timestamp = now // save now timestamp value to uci 
    uci commit //
  }
  else
  {
    // probably return -1  , it means no data changed
    // do nothing
  }

  // ql_pop_lan_devices_packets_total function is fucked  what i should do next? restart the process???
  return 0;
}

int main()
{
  int interval  = 1;
  // this is daemon process of hellapi 
  while (1)
  {
    sleep(interval); // while loop duration

    //counter of speed_monitor 
    show_speed();
  }
  return 0;
}
