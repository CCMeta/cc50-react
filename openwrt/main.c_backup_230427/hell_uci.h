
typedef struct
{
    char *start;
    char *limit;
    char *leasetime;
} uci_dhcp_object;


typedef struct
{
    char *start;
    char *limit;
} uci_traffic_object;


typedef struct
{
    char *apn_name;
    char *username;
    char *password;
    int ip_type;
    int roaming_type;
    int auth_type;
} uci_apn_config_object;

int uci_dhcp_option_get_all(uci_dhcp_object *uci_dhcp_obj);

int uci_network_option_get_ipaddr(char *ipaddr);

int uci_traffic_option_set_all(uci_traffic_object *uci_traffic_obj);

int uci_traffic_option_get(uci_traffic_object *uci_traffic_obj);

int uci_dhcp_option_set_all(uci_dhcp_object *uci_dhcp_obj);

int uci_apn_config_option_set_all(uci_apn_config_object *uci_obj);


int uci_test_set();
