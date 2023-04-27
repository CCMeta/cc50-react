#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/types.h>
#include "ql_dm.h"
#include "ql_sim.h"
#include "ql_nw.h"
#include "ql_sms.h"
#include "ql_data_call.h"

#include <json-c/json.h>

#include <hell_mipc.h>
#include <hell_uci.h>


// #include "ql_uart.h"
// #include <sys/types.h>
// #include <sys/stat.h>
// #include <fcntl.h>

#include "lib_speed_monitor.h"

// **** type ****
typedef int (*func_pointer)(int argc, const char *argv[]);

typedef struct
{
    char func_name[32+1];
    func_pointer funcp;
} func_pointer_info_t;

// **** definition ****
#define FUNC_POINTER_INFO_SIZE 36

#define RESPONSE_CODE_OK 200
#define RESPONSE_CODE_ERROR_PARAM 400
#define RESPONSE_CODE_ERROR_SET 401

// error tips:
#define ERROR_TIP_INVALID_ARUGMENT "Invalid Argument"
#define ERROR_TIP_INCOMPLETE_ARUGMENTS "Incomplete Arguments"


#define WIFI_KEY_24G "2g"
#define WIFI_KEY_5G "5g"

#define WIFI_INTERFACE_24G "ra0"
#define WIFI_INTERFACE_5G "rai0"

#define WIFI_SETTING_PARAMETERS_SIZE 8
#define WIFI_INT_PARAMETERS_SIZE 6

// sim pin status
#define SIM_PIN_ENABLED_NOT_VERIFIED 1 //开启未验证
#define SIM_PIN_ENABLED_VERIFIED 2 //开启已验证
#define SIM_PIN_DISABLED 3 //关闭

// speed monitor
#define SPEED_MONITOR_ZERO_ADDR 1

// sim card pin status
typedef struct {
    int pinLockState;
    int pinCodeState;
}sim_card_pin_status_t;

// clients client item
typedef struct
{
    char *mac;
    char *traffic;
    char *qos;
} clients_client_item_t;

// sim pin action enum
typedef enum 
{
    SIM_PIN_ACTION_ERROR  = -1,
    SIM_PIN_ACTION_ENABLE = 0, // 0
    SIM_PIN_ACTION_DISABLE   , // 1
    SIM_PIN_ACTION_VERIFY    , // 2
    SIM_PIN_ACTION_CHANGE    , // 3
    SIM_PIN_ACTION_MAX_NUM   , // 4
} SIM_PIN_ACTION_E;

typedef enum {
    QOS_DIRECTION_UPLOAD = 1,
    QOS_DIRECTION_DOWNLOAD = 2
} QOS_DIRECTION;

// print json_object 
void print_json(int code, const char *msg,  json_object *obj_all);

// system info
int system_info_get(int argc, const char *argv[]);
// get cpu idle
int cpu_idle(int argc, const char *argv[]);

// get wifi settings
int get_wifi_settings(int argc, const char *argv[]);
// set wifi settings
int set_wifi_settings(int argc, const char *argv[]);

// get wifi status
int wifi_status_24g(int argc, const char *argv[]);
int wifi_status_5g (int argc, const char *argv[]);

// for test
int wifi_test(int argc, const char *argv[]);

// enable/disable wifi 24g
int wifi_enable_24g(int argc, const char *argv[]);
int wifi_enable_5g (int argc, const char *argv[]);

// wifi station info
int sta_info_24g(int argc, const char *argv[]);
int sta_info_5g (int argc, const char *argv[]);

// dhcp get
int network_dhcp_get(int argc, const char *argv[]);
// dhcp set
int network_dhcp_set(int argc, const char *argv[]);

// traffic get
int traffic_project_get(int argc, const char *argv[]);
// traffic set
int traffic_project_set(int argc, const char *argv[]);
// traffic modem, vnstat
int traffic_stat_modem_get(int argc, const char *argv[]);

// system reboot
int system_reboot(int argc, const char *argv[]);
// system factory reset
int system_reset(int argc, const char *argv[]);

int system_info_heat_get(int argc, const char *argv[]);

int system_info_ram_get(int argc, const char *argv[]);

//heart beat
int heartbeat(int argc, const char *argv[]);

int hellapi_boot_init(int argc, const char *argv[]);

int hellapi_init(int argc, const char *argv[]);

char *execute_cmd(const char *cmd);

void make_a_common_json_string();

void dm_infomation_get(char *imei, char *firmware_version, char *soft_ver);
void sim_imsi_get(char *imsi);
// get system board
struct json_object *get_system_board();
// get system info
struct json_object *get_system_info();
// get cpu idle
struct json_object *get_cpu_idle();
// get temperature
struct json_object *get_temperature();

// get wifi rssi
struct json_object *get_wifi_rssi(const char *iface);

struct json_object *sr_util_json_object_object_get(struct json_object *obj, const char *key);

// for sim info
int sim_info_get(int argc, const char *argv[]);
// set sim enbale 
int sim_enable_set(int argc, const char *argv[]);
// for setting sim get info
int setting_sim_get(int argc, const char *argv[]);
// for setting sim set
int setting_sim_set(int argc, const char *argv[]);

// get sim pin setting
int sim_setting_pin_get(int argc, const char *argv[]);
// set sim pin setting
int sim_setting_pin_set(int argc, const char *argv[]);

// get sim apn setting
int sim_setting_apn_get(int argc, const char *argv[]);
// set sim apn setting
int sim_setting_apn_set(int argc, const char *argv[]);

int clients_qos_set(int argc, const char *argv[]);

// // for traffic stat 
// int traffic_stat_get(int argc, const char *argv[]);
// // for traffic realtime speed
// int traffic_realtime_get(int argc, const char *argv[]);

// for test
int wifi_test2(int argc, const char *argv[]);


// int hellapi_uart(int argc, const char *argv[]);

// int hellapi_gpio(int argc, const char *argv[]);

int clients_list_get(int argc, const char *argv[]);

// sms list get
int sms_list_get(int argc, const char *argv[]);
// sms send
int sms_send_message(int argc, const char *argv[]);
// sms delete
int sms_delete_message(int argc, const char *argv[]);


int wifi_mipc_test(int argc, const char *argv[]);

// wifi all parameters check
int wifi_setting_parameters_check(json_object *obj_json_orignal, char *key);
// wifi integer parameters check
int wifi_setting_int_parameters_check(char *key);

// wifi setting parameters
const char* wifi_setting_parameters[WIFI_SETTING_PARAMETERS_SIZE] = {
    // "device",
    "name",
    // "enable",
    "password",
    "bandwidth",
    "channel",
    "isolation",
    "hideName",
    "wirelessMode",
    "authMode",
};

// wifi config int parameters
const char* wifi_int_parameters[WIFI_INT_PARAMETERS_SIZE] = {
    "enable",
    "bandwidth",
    "channel",
    "isolation",
    "hideName",
    "wirelessMode",
};

// func pointer info
func_pointer_info_t func_pointer_infos[FUNC_POINTER_INFO_SIZE]={  
    { // 0
        .func_name = "system.info.get",
        .funcp = &system_info_get,
    },
    {
        .func_name = "system.info.cpu.get",
        .funcp = &cpu_idle,
    },
    { // 2
        .func_name = "wifi.setting.get",
        .funcp = &get_wifi_settings,
    },
    {
        .func_name = "wifi.setting.set",
        .funcp = &set_wifi_settings,
    },
    // 4
    // wifi status get
    {
        .func_name = "wifi.status.24g.get",
        .funcp = &wifi_status_24g,
    },
    { // 5
        .func_name = "wifi.status.5g.get",
        .funcp = &wifi_status_5g,
    },
    // wifi enable
    {
        .func_name = "wifi.enable.24g.set",
        .funcp = &wifi_enable_24g,
    },
    { // 7
        .func_name = "wifi.enable.5g.set",
        .funcp = &wifi_enable_5g,
    },
    // wifi station info
    {  // 8
        .func_name = "wifi.stat.24g.get",
        .funcp = &sta_info_24g,
    },
    {  // 9
        .func_name = "wifi.stat.5g.get",
        .funcp = &sta_info_5g,
    },
    {  // 10
        .func_name = "internet.sim.info.get",
        .funcp = &sim_info_get,
    },
    {
        .func_name = "internet.setting.sim.get",
        .funcp = &setting_sim_get,
    },
    {
        .func_name = "internet.sim.enable.set",
        .funcp = &sim_enable_set,
    },
    {
        .func_name = "internet.setting.sim.set",
        .funcp = &setting_sim_set,
    },
    // network dhcp
    {
        .func_name = "network.dhcp.get",
        .funcp = &network_dhcp_get,
    },
    {
        .func_name = "network.dhcp.set",
        .funcp = &network_dhcp_set,
    },
    // system
    {
        .func_name = "system.reboot",
        .funcp = &system_reboot,
    },
    {
        .func_name = "system.reset",
        .funcp = &system_reset,
    },
    // traffic
    {
        .func_name = "traffic.project.get",
        .funcp = &traffic_project_get,
    },
    {
        .func_name = "traffic.project.set",
        .funcp = &traffic_project_set,
    },
    // traffic modem, vnstat
    {
        .func_name = "traffic.stat.modem.get",
        .funcp = &traffic_stat_modem_get,
    },
    {
        .func_name = "system.info.heat.get",
        .funcp = &system_info_heat_get,
    },
    {
        .func_name = "system.info.ram.get",
        .funcp = &system_info_ram_get,
    },
    // // traffic_stat_get
    // {
    //     .func_name = "traffic.stat.get",
    //     .funcp = &traffic_stat_get,
    // },
    // // traffic.realtime.get
    // {
    //     .func_name = "traffic.realtime.get",
    //     .funcp = &traffic_realtime_get,
    // },
    // for heartbeat
    {
        .func_name = "hello",
        .funcp = &heartbeat,
    },
    {
        .func_name = "boot_init",
        .funcp = &hellapi_boot_init,
    },
    {
        .func_name = "init",
        .funcp = &hellapi_init,
    },
    // for uart
    // {
    //     .func_name = "uart",
    //     .funcp = &hellapi_uart,
    // },
    // {
    //     .func_name = "gpio",
    //     .funcp = &hellapi_gpio,
    // },
    {
        .func_name = "clients.list.get",
        .funcp = &clients_list_get,
    },
    // pin.get
    {
        .func_name = "sim.setting.pin.get",
        .funcp = &sim_setting_pin_get,
    },
    // pin.set
    {
        .func_name = "sim.setting.pin.set",
        .funcp = &sim_setting_pin_set,
    },
    // sms.list.get
    {
        .func_name = "sms.list.get",
        .funcp = &sms_list_get,
    },
    // sms.list.get
    {
        .func_name = "sms.create.set",
        .funcp = &sms_send_message,
    },
    // sms.list.get
    {
        .func_name = "sms.del.set",
        .funcp = &sms_delete_message,
    },
    // sim.setting.apn.get
    {
        .func_name = "sim.setting.apn.get",
        .funcp = &sim_setting_apn_get,
    },
    // sim.setting.apn.set
    {
        .func_name = "sim.setting.apn.set",
        .funcp = &sim_setting_apn_set,
    },
    // clients.qos.set
    {
        .func_name = "clients.qos.set",
        .funcp = &clients_qos_set,
    },
    // for test
    {
        .func_name = "wifi.test",
        .funcp = &wifi_test2,
    },
    // {
    //     .func_name = "wifi.setting.get",
    //     .funcp = &wifi_settings,
    // },

    
};
