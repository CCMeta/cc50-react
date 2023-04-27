#include "hellapi.h"

#include <lua.h>
#include <lualib.h>
#include <lauxlib.h>

#define _EXE_BUFFER_LEN 1024

func_pointer get_func_pointer(const char *sfuncname) {
    for (int i = 0; i < (FUNC_POINTER_INFO_SIZE); ++i) {
        if (strcmp(sfuncname, func_pointer_infos[i].func_name) == 0) {
            return func_pointer_infos[i].funcp;
        }

        // printf("parameter i=[%d]\n",i);
    }

    return NULL;
}

int call_lua_get_wifi_config(lua_State *L, const char *iface) {
    int result = 0;
    const char *key, *value;
    struct json_object *obj_all = json_object_new_object();

    lua_getglobal(L, "get_wifi_config"); //获取add函数
    lua_pushstring(L, iface);
    lua_pcall(L, 1, 1, 0); //调用函数，2个参数，1个返回值
    lua_pushnil(L);

    json_object_object_add(obj_all, "signal", get_wifi_rssi(iface));

    while (lua_next(L, -2)) {
        key = lua_tostring(L, -2);
        value = lua_tostring(L, -1);
        json_object_object_add(obj_all, key, json_object_new_string(value));
        lua_pop(L, 1);
    }

    print_json(RESPONSE_CODE_OK, NULL, obj_all);

    return result;
}

// int call_lua_get_wifi_settings(lua_State *L, const char *dev)
// {
// 	lua_getglobal(L, "get_wifi_settings"); //获取add函数
// 	lua_pushstring(L, dev);
// 	lua_pcall(L, 1, 1, 0); //调用函数，2个参数，1个返回值

// 	lua_pushnil(L);

// 	// printf("%s\n", __func__);
// 	// int sum = (int)lua_tonumber(L, -1); //获取栈顶元素（结果）
// 	int result = 0;
// 	const char *key,*value;

// 	struct json_object *obj_all = json_object_new_object();

// 	while(lua_next(L, -2)) {
// 		key = lua_tostring(L, -2);
// 		value = lua_tostring(L, -1);
// 		json_object_object_add(obj_all, key , json_object_new_string(value));
// 		lua_pop(L,1);                          
// 	}

// 	print_json(RESPONSE_CODE_OK, NULL, obj_all);

//     // lua_pop(L, 1); //栈顶元素出栈
// 	return result;
// }

int call_lua_get_wifi_settings(lua_State *L, const char *iface) {
    int result = 0;
    int array_idx = 0;
    int item_idx = 0;
    char *key, *value;
    char *keyS;//, *valueS;
    struct json_object *obj_data = json_object_new_object();
    struct json_object *obj_item = NULL;

    lua_getglobal(L, "get_wifi_settings"); //获取add函数
    lua_pushstring(L, iface);
    lua_pcall(L, 1, 1, 0); //调用函数，1个参数，1个返回值

    array_idx = lua_gettop(L);
    lua_pushnil(L);
    while (lua_next(L, array_idx)) {
        obj_item = json_object_new_object();
        keyS = (char *) lua_tostring(L, -2);
        item_idx = lua_gettop(L);
        lua_pushnil(L);

        while (lua_next(L, item_idx)) {
            key = (char *) lua_tostring(L, -2);
            value = (char *) lua_tostring(L, -1);

            if (wifi_setting_int_parameters_check(key) == 0) {
                json_object_object_add(obj_item, key, json_object_new_int(atoi(value)));
            } else {
                json_object_object_add(obj_item, key, json_object_new_string(value));
            }

            lua_pop(L, 1);
        }

        json_object_object_add(obj_data, keyS, obj_item);
        lua_pop(L, 1);
    }

    print_json(RESPONSE_CODE_OK, NULL, obj_data);
    return result;
}

int call_lua_get_sta_info(lua_State *L, const char *iface) {
    int result = 0;
    int array_idx = 0;
    int item_idx = 0;
    const char *key, *value;
    struct json_object *obj_array = json_object_new_array();

    lua_getglobal(L, "get_sta_info"); //获取add函数
    lua_pushstring(L, iface);
    lua_pcall(L, 1, 1, 0); //调用函数，1个参数，1个返回值

    array_idx = lua_gettop(L);
    lua_pushnil(L);
    while (lua_next(L, array_idx)) {
        struct json_object *obj_item = json_object_new_object();

        item_idx = lua_gettop(L);
        lua_pushnil(L);
        while (lua_next(L, item_idx)) {
            key = lua_tostring(L, -2);
            value = lua_tostring(L, -1);
            json_object_object_add(obj_item, key, json_object_new_string(value));
            lua_pop(L, 1);
        }

        json_object_array_add(obj_array, obj_item);
        lua_pop(L, 1);
    }

    print_json(RESPONSE_CODE_OK, NULL, obj_array);

    return result;
}

int lua_sta_info(const char *iface) {
    lua_State *L = luaL_newstate(); //新建lua解释器
    luaL_openlibs(L); //载入lua所有函数库
    luaL_dofile(L, "/bin/lua/hellapi.lua"); //执行"Test.lua"文件中的代码
    // luaL_loadfile(L, "/bin/lua/test.lua"); 
    // printf("%s\n", __func__);

    // 重定向 标准错误流 stderr
    // freopen("/tmp/lualog.err", "w", stderr);
    freopen("/dev/null", "w", stderr);

    call_lua_get_sta_info(L, iface);

    lua_close(L); //释放内存
    return 0;
}

int lua_wifi_settings() {
    lua_State *L = luaL_newstate(); //新建lua解释器
    luaL_openlibs(L); //载入lua所有函数库
    luaL_dofile(L, "/bin/lua/hellapi.lua"); //执行"Test.lua"文件中的代码

    // 重定向 标准错误流 stderr
    // freopen("/tmp/lualog.err", "w", stderr);
    freopen("/dev/null", "w", stderr);

    call_lua_get_wifi_settings(L, WIFI_INTERFACE_24G);

    lua_close(L); //释放内存
    return 0;
}

int lua_get_wifi_config(const char *device) {
    lua_State *L = luaL_newstate(); //新建lua解释器
    luaL_openlibs(L); //载入lua所有函数库
    luaL_dofile(L, "/bin/lua/hellapi.lua"); //执行"Test.lua"文件中的代码

    // 重定向 标准错误流 stderr
    // freopen("/tmp/lualog.err", "w", stderr);
    freopen("/dev/null", "w", stderr);

    call_lua_get_wifi_config(L, device);

    lua_close(L); //释放内存
    return 0;
}

void wifi_enbale(const char *device, const char *enable) {
    char *cmd = "ifconfig %s %s";
    char *tmpcmd;

    tmpcmd = malloc(strlen(cmd) + strlen(device) + strlen(enable));
    sprintf(tmpcmd, cmd, device, enable);

    system(tmpcmd);
}

// void wifi_disable(const char* device) 
// {
// 	char *cmd = "ifconfig %s down";
//     char *tmpcmd;

//     tmpcmd = malloc(strlen(cmd) + strlen(device));
//     sprintf(tmpcmd, cmd, device);

// 	system(tmpcmd);
// }


// void parseJsonString(struct json_object *obj)
// {
//     char *key = NULL;
//     struct lh_entry *entry = NULL;
//     struct json_object* val = NULL;

//     entry = json_object_get_object(obj)->head;

//     while (entry)
//     {
//         key = (char *)entry->k;
//         val = (struct json_object *)entry->v;

//         printf("key: %s\n", key);
//         switch (json_object_get_type(val))
//         {
//             case json_type_null:
//                 printf("json type: json_type_null\n");
//                 printf("val: %s\n\n", json_object_get_string(val));
//                 break;

//             case json_type_boolean:
//                 printf("json type: json_type_boolean\n");
//                 printf("val: %d\n\n", json_object_get_boolean(val));
//                 break;

//             case json_type_double:
//                 printf("json type: json_type_double\n");
//                 printf("val: %f\n\n", json_object_get_double(val));
//                 break;

//             case json_type_int:
//                 printf("json type: json_type_int\n");
//                 printf("val: %d\n\n", json_object_get_int(val));
//                 break;

//             case json_type_object:
//                 printf("json type: json_type_object\n");
//                 printf("val: %s\n\n", json_object_get_string(val));
//                 parseJsonString(val);
//                 break;

//             case json_type_array:
//                 printf("json type: json_type_array\n");
//                 printf("val: %s\n\n", json_object_get_string(val));
//                 break;

//             case json_type_string:
//                 printf("json type: json_type_string\n");
//                 printf("val: %s\n\n", json_object_get_string(val));
//                 break;

//         }

//         entry = entry->next;
//         if (NULL == entry)
//         {
//             printf("there is an end\n");
//         }
//     }
// }

void wifi_setting_reload(lua_State *L, const char *key) {
    lua_getglobal(L, "reload_wifi_setting");
    // lua_pushstring(L, "key");
    lua_pushstring(L, key);
    lua_pcall(L, 1, 1, 0); //调用函数，1个参数，1个返回值
    // int res = lua_tointeger(L,-1);//获取返回值
    lua_tointeger(L, -1);//获取返回值
    lua_pop(L, 1);
}

void wifi_setting_modify_profiles(struct json_object *obj, lua_State *L) {
    char *device_key = NULL;
    struct lh_entry *device_entry = NULL;
    // struct json_object *device_val = NULL;

    device_entry = json_object_get_object(obj)->head;
    lua_getglobal(L, "modify_wifi_setting_all"); //获取add函数

    lua_newtable(L);

    while (device_entry) {
        device_key = (char *) device_entry->k;
        // device_val = (struct json_object *)device_entry->v;

        struct lh_entry *entry = NULL;
        char *key = NULL;
        struct json_object *val = NULL;

        json_object *obj_data = sr_util_json_object_object_get(obj, device_key);

        entry = json_object_get_object(obj_data)->head;

        // table key
        lua_pushstring(L, device_key); // add
        // lua_pushinteger(L, k + 1);
        lua_newtable(L);  //创建一个子表

        // use key to get profile
        lua_pushstring(L, "key");
        lua_pushstring(L, device_key);
        lua_settable(L, -3);

        while (entry) {
            key = (char *) entry->k;
            val = (struct json_object *) entry->v;

            // printf("key: %s \n    val: %s\n", key, json_object_get_string(val));

            lua_pushstring(L, key);                            //设置table的KEY
            lua_pushstring(L, json_object_get_string(val));                            //设置table的value
            lua_settable(L, -3);

            entry = entry->next;
        }
        lua_settable(L, -3);

        device_entry = device_entry->next;
    }

    //调用函数，1个参数，1个返回值
    lua_pcall(L, 1, 1, 0);

    // int res = lua_tointeger(L,-1);//获取返回值
    lua_tointeger(L, -1);//获取返回值
    lua_pop(L, 1);
    // printf("======== res=%d\n", res);
    print_json(RESPONSE_CODE_OK, "Succeed to save profile", NULL);
}

void parseJsonString(struct json_object *obj_data, lua_State *L) {
    char *key = NULL;
    struct lh_entry *entry = NULL;
    struct json_object *val = NULL;

    lua_getglobal(L, "modify_wifi_settings"); //获取add函数
    // if(lua_isfunction(L, -1))
    // {
    // 	// printf("===lua_isfunction == true\n");
    // } else {
    // 	// printf("===lua_isfunction == false\n");
    // }

    entry = json_object_get_object(obj_data)->head;

    lua_newtable(L);  //创建一个子表
    while (entry) {
        key = (char *) entry->k;
        val = (struct json_object *) entry->v;

        // printf("key: %s \n    val: %s\n", key, json_object_get_string(val));

        lua_pushstring(L, key);                            //设置table的KEY
        lua_pushstring(L, json_object_get_string(val));                            //设置table的value
        lua_settable(L, -3);
        entry = entry->next;
    }

    lua_pcall(L, 1, 1, 0); //调用函数，1个参数，1个返回值

    // int res = lua_tointeger(L,-1);//获取返回值
    lua_tointeger(L, -1);
    lua_pop(L, 1);
    print_json(RESPONSE_CODE_OK, "Succeed to save profile", NULL);
}

// wifi integer parameters check
int wifi_setting_int_parameters_check(char *key) {
    int size = WIFI_INT_PARAMETERS_SIZE;
    for (int i = 0; i < size; i++) {
        if (strcmp(wifi_int_parameters[i], key) == 0) {
            return 0;
        }
    }

    return -1;
}

// Wi-Fi all parameters check
int wifi_setting_parameters_check(json_object *obj_json_orignal, char *key) {
    json_object *obj_json = NULL;
    if (key == NULL) {
        obj_json = obj_json_orignal;
    } else {
        obj_json = sr_util_json_object_object_get(obj_json_orignal, key);
    }

    if (obj_json == NULL) {
        printf("%s => obj_json is NULL =====\n", __func__);
        return -1;
    }

    // printf("===obj_json = [%s]=====\n", json_object_to_json_string(obj_json));
    for (int i = 0; i < WIFI_SETTING_PARAMETERS_SIZE; i++) {
        if (sr_util_json_object_object_get(obj_json, wifi_setting_parameters[i]) == NULL) {
            char *errString = "parameters are error, missing key [%s]";
            char *errMsg = NULL;
            errMsg = malloc(strlen(errString) + strlen(wifi_setting_parameters[i]));
            sprintf(errMsg, errString, wifi_setting_parameters[i]);
            print_json(RESPONSE_CODE_ERROR_PARAM, errMsg, NULL);
            return -1;
        }
    }

    return 0;
}

int set_wifi_settings(int argc, const char *argv[]) {
    lua_State *L = luaL_newstate(); //新建lua解释器
    luaL_openlibs(L); //载入lua所有函数库
    luaL_dofile(L, "/bin/lua/hellapi.lua"); //执行"Test.lua"文件中的代码

    if (argc >= 1) {
        const char *demoJSON = argv[0];
        // int stringlen = strlen(demoJSON);
        json_object *obj_demojson = json_tokener_parse(demoJSON);
        if (obj_demojson == NULL) {
            // printf("parameter is error\n");
            print_json(RESPONSE_CODE_ERROR_PARAM, "parameter is error", NULL);
            return -1;
        }

        // check parameters of 2g
        if (wifi_setting_parameters_check(obj_demojson, WIFI_KEY_24G) != 0) {
            return -1;
        }

        // check parameters of 5g
        if (wifi_setting_parameters_check(obj_demojson, WIFI_KEY_5G) != 0) {
            return -1;
        }

        // 重定向 标准错误流 stderr
        // freopen("/tmp/lualog.err", "w", stderr);
        freopen("/dev/null", "w", stderr);

        wifi_setting_modify_profiles(obj_demojson, L);

        // reload after saving setting begin
        wifi_setting_reload(L, WIFI_KEY_24G);
        wifi_setting_reload(L, WIFI_KEY_5G);
        // reload after saving setting end

        lua_close(L); //释放内存
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
    }

    return 0;
}

int wifi_test(int argc, const char *argv[]) {
    lua_State *L = luaL_newstate(); //新建lua解释器
    luaL_openlibs(L); //载入lua所有函数库
    luaL_dofile(L, "/bin/lua/hellapi.lua"); //执行"Test.lua"文件中的代码

    // wifi_enbale("")
    int i;
    // char *enable;
    // char *demoJSON = "{ \"code\": 200, \"data\": { \"2g\": { \"enable\": \"1\", \"password\": \"qqwwwwqq\", \"bandwidth\": \"60\", \"name\": \"CC50_08_24G\", \"channel\": \"0\", \"isolation\": \"0\", \"hideName\": \"0\", \"wirelessMode\": \"16\", \"authMode\": \"WPA2PSKWPA3PSK\" }, \"5g\": { \"enable\": \"1\", \"password\": \"qqwwwwqq\", \"bandwidth\": \"80\", \"name\": \"CC50_08_5G\", \"channel\": \"0\", \"isolation\": \"0\", \"hideName\": \"0\", \"wirelessMode\": \"17\", \"authMode\": \"WPA2PSKWPA3PSK\" } } }";

    // char *demoJSON = "{ \"code\": 200, \"data\": { \"device\": \"2g\", \"name\": \"CC50_08_24G_123\", \"enable\": \"1\", \"password\": \"qqwwwwqq\", \"bandwidth\": \"60\", \"channel\": \"0\", \"isolation\": \"0\", \"hideName\": \"0\", \"wirelessMode\": \"16\", \"authMode\": \"WPA2PSKWPA3PSK\" } }";
    // char *demoJSON = "{ \"device\": \"2g\", \"name\": \"CC50_08_24G_456\", \"enable\": \"1\", \"password\": \"qqwwwwqq\", \"bandwidth\": \"60\", \"channel\": \"0\", \"isolation\": \"0\", \"hideName\": \"0\", \"wirelessMode\": \"16\", \"authMode\": \"WPA2PSKWPA3PSK\" }";


    // for(i = 0;i < argc;i++) {
    // 	printf("func=[%s],index=[%d], value=[%s]\n", __func__, i , argv[i]);
    // }



    // printf("wifi_reload...111111...\n");
    // wifi_reload(L, "2g");
    // wifi_reload(L, "5g");
    // printf("wifi_reload......\n");

    // lua_close(L);
    // return 0;

// "{\"enable\":\"  dasdf  1\"}"
    if (argc >= 1) {
        // printf("func=[%s],index=[0], value=[%s]\n", __func__, argv[0]);

        // json_object *jobj = NULL;
        // char *demoJSON = NULL;
        // int stringlen = 0;
        // json_tokener *tok = json_tokener_new();
        // enum json_tokener_error jerr;
        // // do {
        // 	demoJSON = argv[0];  // get JSON string, e.g. read from file, etc...
        // 	stringlen = strlen(demoJSON);

        // 	printf("func=[%s],demoJSON=[%s], stringlen=[%d]\n", __func__, demoJSON , stringlen);
        // 	jobj = json_tokener_parse_ex(tok, demoJSON, stringlen);
        // // } while ((jerr = json_tokener_get_error(tok)) == json_tokener_continue);
        // if (jerr != json_tokener_success)
        // {
        // 	printf("Error: %s\n", json_tokener_error_desc(jerr));
        // 	return -1;
        //         // Handle errors, as appropriate for your application.
        // }

        // json_object *obj_demojson = json_tokener_parse(demoJSON);

        const char *demoJSON = argv[0];
        // int stringlen = strlen(demoJSON);
        // json_tokener tok = json_tokener_new();
        // jobj = json_tokener_parse_ex(tok, demoJSON, stringlen);
        json_object *obj_demojson = json_tokener_parse(demoJSON);
        if (obj_demojson == NULL) {
            printf("parameter is error\n");
            print_json(RESPONSE_CODE_ERROR_PARAM, "parameter is error", NULL);
            return -1;
        }


        int size = WIFI_SETTING_PARAMETERS_SIZE;//sizeof(wifi_setting_parameters)/sizeof(wifi_setting_parameters[0]);
        for (i = 0; i < size; i++) {
            if (sr_util_json_object_object_get(obj_demojson, wifi_setting_parameters[i]) == NULL) {
                print_json(RESPONSE_CODE_ERROR_PARAM, "parameter is error", NULL);
                return -1;
            }
        }

        // char **p_parameter = parameters;

        // for(p_parameter=parameters; *p_parameter!=NULL; p_parameter++)
        // {
        // 	if(json_object_object_get(obj_demojson, *p_parameter)==NULL)
        // 	{
        // 		print_json(RESPONSE_CODE_ERROR_PARAM, "parameter is error", NULL);
        // 	}
        // 	// for(j=0; j<strlen(*str);j++)
        // 	// {
        // 	// 	printf("%c ", *((*str)+j));
        // 	// }
        // 	// printf("\n");
        // }

        // printf("=== obj_demojson=[%s]\n", json_object_get_string(obj_demojson));

        // 重定向 标准错误流 stderr
        // freopen("/tmp/lualog.err", "w", stderr);
        freopen("/dev/null", "w", stderr);


        // json_object *obj_data = json_object_object_get(obj_demojson, "data");

        // json_object *obj_data_2g = json_object_object_get(obj_data, "2g");

        // json_object *obj_data_5g = json_object_object_get(obj_data, "5g");

        parseJsonString(obj_demojson, L);


        // printf("================================\n");
        // parseJsonString(obj_data_2g, L);


        // printf("================================\n");
        // parseJsonString(obj_data_5g, L);


        lua_close(L); //释放内存

        // json_object *obj_str2 = json_object_object_get(obj_str, "enable");
        // if(obj_str2 == NULL) {
        // 	// printf("paramter is error 2 \n");
        // 	print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error 2", NULL);
        // 	return -1;
        // }

        // enable = json_object_get_string(obj_str2);
        // printf("[%s] The value of \"enable\" is [%s]\n", __func__, enable);

        // if(strcmp(enable, "1")==0) {
        // 	wifi_enbale("ra0", "up");
        // 	print_json(200, "wifi 2.4g is enabled", NULL);
        // } else if(strcmp(enable, "0")==0) {
        // 	wifi_enbale("ra0", "down");
        // 	print_json(200, "wifi 2.4g is disabled", NULL);
        // } else {
        // 	// printf("wrong");
        // 	print_json(201, "wrong", NULL);
        // }
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
    }
    // json_object *obj_str = json_tokener_parse(str);

    return 0;
}

int heartbeat(int argc, const char *argv[]) {
    print_json(RESPONSE_CODE_OK, "alive", NULL);
    return 0;
}

int hellapi_install_ipk(char *file_name) {
    char *cmd = "opkg install %s";
    char *final_cmd;

    FILE *pFile = fopen(file_name, "r");
    if (pFile == NULL) {
        return -1;
    }

    final_cmd = malloc(strlen(cmd) + strlen(file_name));
    sprintf(final_cmd, cmd, file_name);

    system(final_cmd);
    return 0;
}

// init qos config
int qos_config_initialize() {
    {
        // open hnat_qos
        system("echo 0 1 > /proc/hnat/hnat_qos");

        // setting the rules by default
        // Do not setting the queue 0-47!!!!! Details please read QUECTEL document of QOS
        // queue-48 is the disable queue for all clients, No limit.
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

        // // initial uci index item
        // system("uci set hellapi.qos=qos");
        // system("uci add_list hellapi.qos.clients=placeholder");
        // system("uci commit");

        system("ebtables -F");
    }

    char *cmd_result;
    char *item;
    char mac[18] = {0}; // 00:00:00:00:00:00
    char *mark;

    char queue_rx[3] = {0};
    char queue_tx[3] = {0};

    {
        const char *cmd = "uci -d '|' get hellapi.qos.clients";
        cmd_result = execute_cmd(cmd);
        item = strtok(cmd_result, "|");
        while (item != NULL) {
            mark = strchr(item, '_');
            if (mark != NULL) {
                int length = mark - item;
                strncpy(mac, item, length);
                strncpy(queue_rx, item + length + 1, 2);
                strncpy(queue_tx, item + length + 4, 2); // +1 +3 // sizeof("56_")

                printf("mac = %s\n", mac);
                printf("queue_rx = %s\n", queue_rx);
                printf("queue_tx = %s\n", queue_tx);

                run_set_qos(mac, atoi(queue_rx), atoi(queue_tx));
            }
            item = strtok(NULL, "|");
        }
    }
    return 0;
}

// cause MTK modem policy, when modem is down the ccmni interface order number may change as random
// e.g: ccmni1 => ccmni11
int seek_current_modem() {
    char *currentModem;

    // ubus call network.interface.wan dump
    // or
    // ifconfig  ifconfig | grep ccmni
    // currentModem = "$currentModem";

    system("uci set hellapi.settings=settings");
    system("uci set hellapi.settings.currentModem=$(ifconfig | grep ccmni | cut -d ' ' -f 0)");
    system("uci commit");

    // So, when sb call hellapi he needs to find current modem interface from uci.
    // like vnstat, cat /sys/class/net/ccmni/blabla
    return 0;
}

// To fix wifi initial quectel fuck MTK policy issue.
int wifi_ssid_initialize() {
    // random Wi-Fi name both 24g & 5g
    // cat /sys/class/net/eth0/address | cut -c 16-18  get mac_address last 2 bytes.
    system("sed -ie \"s/CC50_24G/CC50_$(cat /sys/class/net/eth0/address | cut -c 13-14)$(cat /sys/class/net/eth0/address | cut -c 16-17)_24G/\" /etc/wireless/mediatek/mt7915.dbdc.b0.dat ");
    system("sed -ie \"s/CC50_5G/CC50_$(cat /sys/class/net/eth0/address | cut -c 13-14)$(cat /sys/class/net/eth0/address | cut -c 16-17)_5G/\" /etc/wireless/mediatek/mt7915.dbdc.b1.dat ");
    // system("wifi reload");
    return 0;
}

int vnstat_match_interface(const char *item_cmp) {
    char *cmd_result;
    char *item;
    {

        cmd_result = execute_cmd("uci -d '|' get vnstat.@vnstat[0].interface");
        item = strtok(cmd_result, "|");
        while (item != NULL) {
            if (strcmp(item, item_cmp) == 0) {
                return 1;
            }
            item = strtok(NULL, "|");
        }
    }

    return 0;
}

// To fix initial all modem interface cause no sure when MTK random which, data will be split
int vnstat_initialize() {
    char cmd[256];

    if (vnstat_match_interface("ccmni0")) {
        return 0;
    }

    // ccmni0 => ccmni20
    for (int i = 0; i < 21; i++) {
        sprintf(cmd, "uci add_list vnstat.@vnstat[0].interface=ccmni%d", i);
        if (system(cmd) != 0) {
            return -1;
        }
    }
    // system("vnstat --create -i $(uci get hellapi.settings.currentModem)");
    system("uci commit");

    return 0;
}

// for boot start=21
int hellapi_boot_init(int argc, const char *argv[]) {
    char *cmdResult;
    // char *cmd = "uci -q get hellapi.settings.boot";

    const char *cmd = "uci -q get hellapi.settings.boot";
    cmdResult = execute_cmd(cmd);
    // if already boot once
    if (strcmp("1", cmdResult) == 0) {
        return 0;
    }

    // rename EasyMesh_openwrt.sh
    system("mv /usr/bin/EasyMesh_openwrt.sh /usr/bin/EasyMesh_openwrt_bak.sh ");

    if (wifi_ssid_initialize() != 0) {
        printf("wifi_ssid_initialize failed to init!");
        // return -1;
    }

    if (vnstat_initialize() != 0) {
        printf("vnstat_initialize failed to init!");
        // return -1;
    }

    // boot done
    system("uci set hellapi.settings.boot=1");
    system("uci commit hellapi");
    return 0;
}

int hellapi_init(int argc, const char *argv[]) {
    // vnstat -i rai0 -l --json
    if (seek_current_modem() != 0) {
        printf("seek_current_modem failed to seek current modem!");
        // return -1;
    }

    if (qos_config_initialize() != 0) {
        printf("qos_config_initialize failed to init!");
        // return -1;
    }

    printf("hellapi_init done...\n");
    return 0;
}

int wifi_enable_24g(int argc, const char *argv[]) {
    int enable;

    if (argc >= 1) {
        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            // printf("paramter is error\n");
            print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
            return -1;
        }

        json_object *obj_str2 = sr_util_json_object_object_get(obj_str, "enable");
        if (obj_str2 == NULL) {
            // printf("paramter is error 2 \n");
            print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error 2", NULL);
            return -1;
        }

        enable = json_object_get_int(obj_str2);
        // printf("[%s] The value of enable is %d\n", __func__, enable);
        if (enable == 1) {
            wifi_enbale("ra0", "up");
            print_json(RESPONSE_CODE_OK, "wifi 2.4g is enabled", NULL);
        } else if (enable == 0) {
            wifi_enbale("ra0", "down");
            print_json(RESPONSE_CODE_OK, "wifi 2.4g is disabled", NULL);
        } else {
            // printf("wrong");
            print_json(RESPONSE_CODE_ERROR_PARAM, "wrong", NULL);
        }
    }
    // json_object *obj_str = json_tokener_parse(str);

    return 0;
}

int wifi_enable_5g(int argc, const char *argv[]) {
    char *enable;

    if (argc >= 1) {
        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            // printf("paramter is error\n");
            print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
            return -1;
        }

        json_object *obj_str2 = sr_util_json_object_object_get(obj_str, "enable");
        if (obj_str2 == NULL) {
            // printf("paramter is error 2 \n");
            print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error 2", NULL);
            return -1;
        }

        enable = (char *) json_object_get_string(obj_str2);
        // printf("[%s] The value of enable is %s\n", __func__, enable);
        if (strcmp(enable, "1") == 0) {
            wifi_enbale("rai0", "up");
            print_json(RESPONSE_CODE_OK, "wifi 5g is enabled", NULL);
        } else if (strcmp(enable, "0") == 0) {
            wifi_enbale("rai0", "down");
            print_json(RESPONSE_CODE_OK, "wifi 5g is disabled", NULL);
        } else {
            // printf("wrong");
            print_json(RESPONSE_CODE_ERROR_PARAM, "wrong", NULL);
        }
    }
    return 0;
}

int main(int argc, const char *argv[]) {
    func_pointer funcp;

    if (argc >= 3) {
        funcp = get_func_pointer(argv[1]);

        if (funcp != NULL) {
            (*funcp)(argc - 2, (argv + 2));
        }
    } else if (argc >= 2) {
        funcp = get_func_pointer(argv[1]);

        if (funcp != NULL) {
            (*funcp)(argc - 2, (argv + 2));
        }
    } else if (argc >= 1) {
        int i = 0;
        printf("Available API List:\n");
        for (i = 0; i < FUNC_POINTER_INFO_SIZE; i++) {
            printf("  %s\n", func_pointer_infos[i].func_name);
        }
    }

    return 0;
}

// print json object to string
void print_json(int code, const char *msg, json_object *obj_data) {
    struct json_object *obj_all = json_object_new_object();

    json_object_object_add(obj_all, "code", json_object_new_int(code));

    if (msg != NULL) {
        json_object_object_add(obj_all, "msg", json_object_new_string(msg));
    }
    if (obj_data != NULL) {
        json_object_object_add(obj_all, "data", obj_data);
    }

    printf("%s\n", json_object_to_json_string(obj_all));
}

// get system info
struct json_object *get_wifi_info(const char *device) {
    char *cmd = "ubus call iwinfo info '{\"device\":\"%s\"}'";
    char *tmpcmd;
    char *cmdResult;

    // char *tmpresult;
    // char *resultJson = "{\"code\":200, \"data\":%s}\n";

    printf("getWiFiInfo...\n");
    if (NULL == device) {
        printf("Error: device is NULL\n");
        return NULL;
    }

    tmpcmd = malloc(strlen(cmd) + strlen(device));

    sprintf(tmpcmd, cmd, device);

    printf("tmpcmd=[%s]\n", tmpcmd);
    cmdResult = execute_cmd(tmpcmd);

    return json_tokener_parse(cmdResult);
}

int sta_info_24g(int argc, const char *argv[]) {

    lua_sta_info(WIFI_INTERFACE_24G);

    return 0;
}

int sta_info_5g(int argc, const char *argv[]) {
    lua_sta_info(WIFI_INTERFACE_5G);

    return 0;
}

int get_wifi_settings(int argc, const char *argv[]) {
    lua_wifi_settings();
    return 0;
}

int wifi_status_24g(int argc, const char *argv[]) {
    lua_get_wifi_config("ra0");
    return 0;
}

int wifi_status_5g(int argc, const char *argv[]) {
    lua_get_wifi_config("rai0");
// {
// 	"phy": "rai0",
// 	"ssid": "CC50_5G-z",
// 	"bssid": "02:0C:43:36:46:44",
// 	"country": "00",
// 	"mode": "Master",
// 	"channel": 52,
// 	"txpower": 19,
// 	"quality": 10,
// 	"signal": -256,
// 	"noise": -54,
// 	"bitrate": 1201000,
// 	"hardware": {
// 		"name": "Generic WEXT"
// 	}
// }

    return 0;
}

int cpu_idle(int argc, const char *argv[]) {
    // int i;
    // printf("wifi mod\n");
    // for(i = 0; i < argc;i++) {
    // 	printf("%s index=[%d], value=[%s]\n", __func__, i , argv[i]);
    // }

    struct json_object *obj_all = json_object_new_object();
    struct json_object *obj_cmd_cpu_idle = NULL;

    // json_object_object_add(obj_all,"code", json_object_new_int(200));

    obj_cmd_cpu_idle = get_cpu_idle();
    json_object_object_add(obj_all, "cpuIdle", obj_cmd_cpu_idle);

    print_json(RESPONSE_CODE_OK, NULL, obj_all);

    return 0;
}

int sr_util_upper_mac(char *devmac, char *buffer) {
    int i = 0;
    int num = 0;
    int len = strlen(devmac);

    for (i = 0; i < len; i++) {
        if (devmac[i] != ':') {
            buffer[num] = toupper(devmac[i]);
            num++;
        } else {
            buffer[num] = devmac[i];
            num++;
        }
    }
    return 0;
}

struct json_object *get_mac_address() {
    char *cmdResult;
    char *cmd = "ubus call network.device status '{\"name\":\"eth0\"}'";

    cmdResult = execute_cmd(cmd);
    // printf("%s %d, cmdResult = %s\n", __func__, __LINE__, cmdResult);

    return sr_util_json_object_object_get(json_tokener_parse(cmdResult), "macaddr");
}

int system_info_get(int argc, const char *argv[]) {
    int ret = 0;
    // for sim
    char imsi[QL_SIM_IMSI_LENGTH + 1] = {0};
    char imei[QL_DM_IMEI_MAX_LEN + 1] = {0};

    char firmware_version[64] = {0};
    char soft_ver[256] = {0};
    struct json_object *obj_all = json_object_new_object();
    // struct json_object *obj_all2  = json_object_new_object();
    // ql_dm_device_serial_numbers_info_t info = {0};


    struct json_object *obj_cmd_board_result = NULL;
    struct json_object *obj_cmd_info_result = NULL;

    // struct json_object *obj_cmd_info_memory_result  = NULL;

    // struct json_object *obj_cmd_uptime = NULL;// = json_object_new_object();
    // struct json_object *obj_cmd_localtime = NULL;//  = json_object_new_object();

    // struct json_object *obj_cmd_cpu_idle = NULL;
    // struct json_object *obj_cmd_temperature = NULL;



    obj_cmd_board_result = get_system_board();
    obj_cmd_info_result = get_system_info();
    // obj_cmd_info_memory_result = sr_util_json_object_object_get(obj_cmd_info_result, "memory");

    // obj_cmd_cpu_idle = get_cpu_idle();
    // obj_cmd_temperature = get_temperature();


    dm_infomation_get(imei, firmware_version, soft_ver);

    sim_imsi_get(imsi);

    char upper_mac[20] = {0};
    sr_util_upper_mac((char *) json_object_get_string(get_mac_address()), upper_mac);
    json_object_object_add(obj_all, "mac", json_object_new_string(upper_mac));
    // system board model
    json_object_object_add(obj_all, "model", sr_util_json_object_object_get(obj_cmd_board_result, "model"));
    json_object_object_add(obj_all, "imei", json_object_new_string(imei));
    json_object_object_add(obj_all, "imsi", json_object_new_string(imsi));
    json_object_object_add(obj_all, "firmwareVersion", json_object_new_string(firmware_version));
    json_object_object_add(obj_all, "softwareVersion", json_object_new_string(soft_ver));
    // system info uptime
    json_object_object_add(obj_all, "uptime", sr_util_json_object_object_get(obj_cmd_info_result, "uptime"));
    // system info localtime
    json_object_object_add(obj_all, "localtime", sr_util_json_object_object_get(obj_cmd_info_result, "localtime"));
    // memory total & free
    // json_object_object_add(obj_all,"memoryTotal", sr_util_json_object_object_get(obj_cmd_info_memory_result, "total"));
    // json_object_object_add(obj_all,"memoryFree", sr_util_json_object_object_get(obj_cmd_info_memory_result, "free"));
    // cpu idle
    // json_object_object_add(obj_all,"cpuIdle", obj_cmd_cpu_idle);
    // temperature
    // json_object_object_add(obj_all,"temperature", obj_cmd_temperature);
    // printf("Hello World\n");
    // make_a_common_json_string();
    // printf("%s\n", json_object_to_json_string(obj_all));
    print_json(RESPONSE_CODE_OK, NULL, obj_all);


    ret = ql_dm_release();
    if (ret == QL_DEV_SUCCESS) {
        // printf("ok\n");
    }
    // printf("ql_dm_release, ret = %d\n", ret);

    ret = ql_sim_release();
    if (ret == QL_SIM_SUCCESS) {
        // printf("ok\n");
    }
    // else
    // {
    //     // printf("failed, ret = %d\n", ret);
    // }

    exit(EXIT_SUCCESS);
}

// get imei
void dm_infomation_get(char *imei, char *firmware_version, char *soft_ver) {
    char *software_verison = "MOBIWIRE_CPE_CC50_V00.1_20230426_TMP";
    int ret = QL_DEV_SUCCESS;
    ql_dm_device_serial_numbers_info_t info = {0};

    if (imei == NULL) {
        printf("==> %s %d imei==NULL \n", __func__, __LINE__);
        return;
    }

    if (firmware_version == NULL) {
        printf("==> %s %d firmware_version==NULL \n", __func__, __LINE__);
        return;
    }

    if (soft_ver == NULL) {
        printf("==> %s %d soft_ver==NULL \n", __func__, __LINE__);
        return;
    }

    ret = ql_dm_init(DM_IPC_MODE_DEFAULT);
    if (ret != QL_DEV_SUCCESS) {
        // printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        return;
    }

    ret = ql_dm_get_device_serial_numbers(&info);
    if (ret != QL_DEV_SUCCESS) {
        // printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        goto label_release;
    }

    if (info.imei_valid) {
        memcpy(imei, info.imei, sizeof(info.imei));
    }

    ret = ql_dm_get_device_firmware_rev_id(firmware_version, 64 - 1);
    if (ret != QL_DEV_SUCCESS) {
        // printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        goto label_release;
    }

    // ret = ql_dm_get_software_version(soft_ver, 256-1);
    // if(ret != QL_DEV_SUCCESS){
    // 	printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
    // 	return ;
    // }

    memcpy(soft_ver, software_verison, strlen(software_verison));

    label_release:
    ret = ql_dm_release();
    if (ret != QL_DEV_SUCCESS) {
        // printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        return;
    }
}

// get imsi
void sim_imsi_get(char *imsi) {
    int ret = QL_SIM_SUCCESS;
    ql_sim_card_info_t sim_card_info;
    ql_sim_get_imsi_resp_t sim_imsi;

    if (imsi == NULL) {
        printf("==> %s %d imsi==NULL\n", __func__, __LINE__);
        return;
    }

    ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    if (ret == QL_SIM_SUCCESS) {
        // printf("ok\n");
    } else {
        // printf("failed, ret = %d\n", ret);
        // printf("failed==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        return;
    }

    memset(&sim_card_info, 0, sizeof(ql_sim_card_info_t));
    memset(&sim_imsi, 0, sizeof(ql_sim_get_imsi_resp_t));

    ret = ql_sim_get_card_info(QL_SIM_SLOT_1, &sim_card_info);

    if (sim_card_info.state == QL_SIM_STATUS_NOT_INSERT) {
        // printf("sim is not insert... \n");
        goto label_release;
    }

    if (sim_card_info.state == QL_SIM_STATUS_SIM_PIN) {
        // printf("sim is sim pin... \n");
        goto label_release;
    }

    ret = ql_sim_get_imsi(QL_SIM_SLOT_1, &sim_imsi);
    if (ret == QL_SIM_SUCCESS) {
        memcpy(imsi, sim_imsi.imsi, strlen(sim_imsi.imsi));
        // printf("IMSI: %s\n", imsi);
    } else {
        // printf("failed, ret = %d\n", ret);
        // printf("failed==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        // return ;
    }

    label_release:
    ret = ql_sim_release();

    if (ret == QL_SIM_SUCCESS) {
        // printf("IMSI: %s\n", imsi);
    } else {
        // printf("failed, ret = %d\n", ret);
        printf("failed==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
        return;
    }
}

// get system board
struct json_object *get_system_board() {
    char *cmdResult;
    char *cmd = "ubus call system board";
    cmdResult = execute_cmd(cmd);

    return json_tokener_parse(cmdResult);
}

// get system info
struct json_object *get_system_info() {
    char *cmdResult;
    char *cmd = "ubus call system info";
    cmdResult = execute_cmd(cmd);
    // printf("%s %d, cmdResult = %s\n", __func__, __LINE__, cmdResult);
    return json_tokener_parse(cmdResult);
}

// get cpu idle
struct json_object *get_cpu_idle() {
    // char *cmd = "top -n 1 -b | head -2 | awk 'NR==2 {print $8}'";
    char *cmd = "top -n 1 -b | sed -n '2p' | awk '{print $8}'";
    char *cmdResult;
    cmdResult = execute_cmd(cmd);
//    printf("cmdResult = %s", cmdResult);
//    printf("cmdResult len = %s", strlen(cmdResult));
//    exit(0);

    return json_object_new_string(cmdResult);
}

// get temperature
struct json_object *get_temperature() {

    char *cmdResult;
    double tempdouble = 0;
    char tempchar[10] = {0};//tempNumber/1000;

    // printf("ok, %s %d \n", __func__ , __LINE__ );
    char *cmd = "cat /sys/class/thermal/thermal_zone0/temp";
    cmdResult = execute_cmd(cmd);
    tempdouble = atof(cmdResult);
    sprintf(tempchar, "%.2f", tempdouble / 1000);
    return json_object_new_string(tempchar);
}

// get wifi rssi
struct json_object *get_wifi_rssi(const char *iface) {
    char *cmdResult;
    // char *cmd = "top -n 1 -b | head -2 | awk 'NR==2 {print $8}'";
    char *base_cmd = "iwpriv %s stat | grep Rssi | cut -d ' ' -f 2";
    char *cmd;

//    cmd = malloc(strlen(base_cmd) + strlen(iface));
    sprintf(cmd, base_cmd, iface);

    //
    cmdResult = execute_cmd(cmd);

    return json_object_new_string(cmdResult);
}

// get system info
struct json_object *get_ip_status_wan() {
    char *cmdResult;
    char *cmd = "ifstatus wan";
    cmdResult = execute_cmd(cmd);
    // printf("%s %d, cmdResult = %s\n", __func__, __LINE__, cmdResult);
    return json_tokener_parse(cmdResult);
}

struct json_object *sr_util_json_object_object_get(struct json_object *obj, const char *key) {
    json_object *json_dst = NULL;//json_object_new_object();

    json_bool ret = json_object_object_get_ex(obj, key, &json_dst);

    // printf("sr_util_json_object_object_get ret=[%d]\n", ret);
    if (ret) {
        return json_dst;
    } else {
        return NULL;
    }
}

char *execute_cmd(const char *cmd) {
    char buffer[_EXE_BUFFER_LEN] = {0};
    char *result = (char *) calloc(1, sizeof(char));
//    memset(result,'\0',10);
//    printf("result = %s\n", result);
//    exit(0);
    FILE *fp = popen(cmd, "r");
    size_t buffer_len;
    int i = 1;
    if (NULL == fp)
        return result;

    while (!feof(fp)) {
        buffer_len = fread(buffer, 1, _EXE_BUFFER_LEN, fp);
//        printf("buffer_len = %d\n", buffer_len);
//        printf("buffer = %s\n", buffer);
//        printf("buffer strlen(buffer) = %d\n", strlen(buffer));
        result = realloc(result, _EXE_BUFFER_LEN * i);
        i++;
        strcat(result, buffer);
    }
    pclose(fp);
    
    if (result[strlen(result) - 1] == '\n')
        result[strlen(result) - 1] = '\0';

//    printf("result = %s\n", result);
//    printf("result strlen(result) = %d\n", strlen(result));
    return result;
}

struct json_object *get_sim_operator() {
    int ret = QL_SIM_SUCCESS;
    ql_sim_operator_name_t p_info;
    struct json_object *obj_operator = json_object_new_object();

    ql_sim_init(SIM_IPC_MODE_DEFAULT);
    memset((void *) &p_info, 0, sizeof(ql_sim_operator_name_t));
    ql_sim_get_operators(QL_SIM_SLOT_1, &p_info);

    json_object_object_add(obj_operator, "short_name", json_object_new_string(p_info.short_name));
    json_object_object_add(obj_operator, "name", json_object_new_string(p_info.long_name));
    json_object_object_add(obj_operator, "mcc", json_object_new_string(p_info.mcc));
    json_object_object_add(obj_operator, "mnc", json_object_new_string(p_info.mnc));

    ret = ql_sim_release();
    if (ret == QL_SIM_SUCCESS) {

    }

    return obj_operator;
}

struct json_object *get_nw_roaming() {
    int ret = QL_NW_SUCCESS;
    int roaming = QL_NW_ROAMING_MODE_DIS_NONE;
    ql_nw_get_roaming_disable_mode_resp_t get_roaming_disable_mode;

    ql_nw_init(NW_IPC_MODE_DEFAULT);
    memset(&get_roaming_disable_mode, 0, sizeof(ql_nw_get_roaming_disable_mode_resp_t));
    ret = ql_nw_get_roaming_disable_mode(&get_roaming_disable_mode);


    roaming = get_roaming_disable_mode.roaming_disable_mode == 0 ? 0 : 1;

    if (ret == QL_NW_SUCCESS) {
        // printf("set roaming disable mode success!\n");
        // printf("\n");
        // return;
    } else if (ret == QL_NW_NOT_INIT) {
        // printf("please perform ql_nw_init first!\n");
        // return;
    } else {
        // printf("set roaming disable mode error! ret = %d\n",ret);
        // printf("\n");
        // return;
    }


    ql_nw_release();

    return json_object_new_int(roaming);
}

int set_nw_roaming(int roaming_flag) {
    int ret = 0;
    int result = -1;
    ql_nw_set_roaming_disable_mode_req_t set_roaming_disable_mode;

    ql_nw_init(NW_IPC_MODE_DEFAULT);

    memset(&set_roaming_disable_mode, 0, sizeof(ql_nw_set_roaming_disable_mode_req_t));

    if (roaming_flag) {
        set_roaming_disable_mode.roaming_disable_mode = (
                QL_NW_ROAMING_MODE_DIS_INTERNATIONAL |
                QL_NW_ROAMING_MODE_DIS_NATIONAL |
                QL_NW_ROAMING_MODE_DIS_H_P_PLMN_SEARCH);
    } else {
        set_roaming_disable_mode.roaming_disable_mode = QL_NW_ROAMING_MODE_DIS_NONE;
    }
    ret = ql_nw_set_roaming_disable_mode(&set_roaming_disable_mode);

    if (ret == QL_NW_SUCCESS) {
        // printf("set roaming disable mode success!\n");
        // printf("\n");
        // return;
    } else if (ret == QL_NW_NOT_INIT) {
        // printf("please perform ql_nw_init first!\n");
        // return;
    } else {
        // printf("set roaming disable mode error! ret = %d\n",ret);
        // printf("\n");
        // return;
    }

    ql_nw_release();
    return result;
}

struct json_object *get_nw_signal_strength() {
    ql_nw_signal_strength_info_t info;
    QL_NW_SIGNAL_STRENGTH_LEVEL_E level = QL_NW_SIGNAL_STRENGTH_LEVEL_NONE;

    ql_nw_init(NW_IPC_MODE_DEFAULT);

    memset((void *) &info, 0, sizeof(ql_nw_signal_strength_info_t));
    ql_nw_get_signal_strength(&info, &level);

    // if(info.has_wcdma)
    // {
    //     printf("wcdma_sig_info: rssi=%d,rscp=%d, ecio=%d\n",
    //             info.wcdma.rssi,
    //             info.wcdma.rscp,
    //             info.wcdma.ecio);
    // }
    // if(info.has_lte)
    // {
    //     printf("lte_sig_info: rssi=%d,rsrq=%d, rsrp=%d, snr=%d\n",
    //             info.lte.rssi,
    //             info.lte.rsrq,
    //             info.lte.rsrp,
    //             info.lte.snr);
    //     printf("lte_sig_info: rsrp_rx0 = %d , rsrp_rx1 = %d , sinr_rx0 = %d , sinr_rx1 = %d\n",
    //             info.lte.rsrp_rx0,
    //             info.lte.rsrp_rx1,
    //             info.lte.sinr_rx0,
    //             info.lte.sinr_rx1);
    // }
    // if(info.has_nr5g)
    // {
    //     printf("nr5g_sig_info: rssi=%d,rsrq=%d, rsrp=%d, snr=%d\n",
    //             info.nr5g.rssi,
    //             info.nr5g.rsrq,
    //             info.nr5g.rsrp,
    //             info.nr5g.snr);
    //     printf("nr5g_sig_info: trs_rsrp_rx0 = %d , trs_rsrp_rx1 = %d , trs_rsrp_rx2 = %d , trs_rsrp_rx3 = %d\n",
    //             info.nr5g.trs_rsrp_rx0,
    //             info.nr5g.trs_rsrp_rx1,
    //             info.nr5g.trs_rsrp_rx2,
    //             info.nr5g.trs_rsrp_rx3);
    //     printf("nr5g_sig_info: trs_snr_rx0 = %d , trs_snr_rx1 = %d , trs_snr_rx2 = %d , trs_snr_rx3 = %d\n",
    //             info.nr5g.trs_snr_rx0,
    //             info.nr5g.trs_snr_rx1,
    //             info.nr5g.trs_snr_rx2,
    //             info.nr5g.trs_snr_rx3);
    //     printf("nr5g_sig_info: ssb_rsrp_rx0 = %d , ssb_rsrp_rx1 = %d , ssb_rsrp_rx2 = %d , ssb_rsrp_rx3 = %d\n",
    //             info.nr5g.ssb_rsrp_rx0,
    //             info.nr5g.ssb_rsrp_rx1,
    //             info.nr5g.ssb_rsrp_rx2,
    //             info.nr5g.ssb_rsrp_rx3);
    //     printf("nr5g_sig_info: ssb_snr_rx0 = %d , ssb_snr_rx1 = %d , ssb_snr_rx2 = %d , ssb_snr_rx3 = %d\n",
    //             info.nr5g.ssb_snr_rx0,
    //             info.nr5g.ssb_snr_rx1,
    //             info.nr5g.ssb_snr_rx2,
    //             info.nr5g.ssb_snr_rx3);
    // }

    // if(get_signal_strength_level(level, level_info, sizeof(level_info)) == 0)
    // {
    //     printf("signal strength level is %d, unrecognized\n", level);
    // }
    // else
    // {
    //     printf("signal strength level is %s\n", level_info);
    // }

    ql_nw_release();

    return json_object_new_int(level);
}

// NOT USED
struct json_object *get_nw_operator() {
    // int ret = QL_NW_SUCCESS;
    ql_nw_mobile_operator_name_info_t p_name_info;

    // if(operator == NULL) {
    // 	printf("==> %s %d operator==NULL \n", __func__, __LINE__);
    // 	return ;
    // }

    // ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    // if(ret != QL_SIM_SUCCESS) {
    // 	printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
    // 	return ;
    // }

    // ret = ql_sim_get_operators(QL_SIM_SLOT_1, &p_info);
    // if(ret != QL_SIM_SUCCESS){
    // 	printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
    // 	return ;
    // }
    ql_nw_init(NW_IPC_MODE_DEFAULT);
    // if(ret != QL_NW_SUCCESS) {
    // 	printf("==> %s %d ret=[%d]\n", __func__, __LINE__, ret);
    // 	return ;
    // }

    memset((void *) &p_name_info, 0, sizeof(ql_nw_mobile_operator_name_info_t));
    ql_nw_get_mobile_operator_name(&p_name_info);

    struct json_object *obj_operator = json_object_new_object();

    json_object_object_add(obj_operator, "short_name", json_object_new_string(p_name_info.short_eons));
    json_object_object_add(obj_operator, "name", json_object_new_string(p_name_info.long_eons));
    json_object_object_add(obj_operator, "mcc", json_object_new_string(p_name_info.mcc));
    json_object_object_add(obj_operator, "mnc", json_object_new_string(p_name_info.mnc));

    ql_nw_release();

    return obj_operator;
}

// NOT USED
struct json_object *get_pin_state() {
    int pin_state = mipc_sim_pin_state_get();

    return json_object_new_int(pin_state);
}

struct json_object *get_sim_status() {
    int sim_status = mipc_sim_get_status();

    return json_object_new_int(sim_status);
}

sim_card_pin_status_t get_sim_card_info() {

    sim_card_pin_status_t sim_card_pin_status;
    int ret = 0;
    ql_sim_card_info_t info = {0};

    int pinLockState = 0;
    int pinCodeState = 0;

    ql_sim_init(SIM_IPC_MODE_DEFAULT);

    memset((void *) &sim_card_pin_status, 0, sizeof(sim_card_pin_status_t));

    ret = ql_sim_get_card_info(QL_SIM_SLOT_1, &info);
    if (ret == QL_SIM_SUCCESS) {
        for (int index = 0; index < info.app_num; index++) {
            if (info.app_list[index].pin1_state == SIM_PIN_DISABLED) {
                pinLockState = 0;
                pinCodeState = 0;
            } else if (info.app_list[index].pin1_state == SIM_PIN_ENABLED_VERIFIED) {
                pinLockState = 0;
                pinCodeState = 1;
            } else if (info.app_list[index].pin1_state == SIM_PIN_ENABLED_NOT_VERIFIED) {
                pinLockState = 1;
                pinCodeState = 1;
            }

            sim_card_pin_status.pinLockState = pinLockState;
            sim_card_pin_status.pinCodeState = pinCodeState;
        }
    } else {
        // printf("failed, ret = %d\n", ret);
    }

    ql_sim_release();

    return sim_card_pin_status;
}

int sim_info_get(int argc, const char *argv[]) {
    // sim data enable
    int radio_state = mipc_sim_nw_radio_state_get(0);

    struct json_object *obj_date = json_object_new_object();
    struct json_object *obj_operator = get_sim_operator();

    int rat_mode = mipc_sim_nw_get_rat();

    struct json_object *obj_ip_status_wan_result = get_ip_status_wan();
    struct json_object *obj_ipv4_address_result;
    struct json_object *obj_ipv4_address_result1;
    struct json_object *obj_ipv4_address_result2;

    json_object_object_add(obj_date, "enable", json_object_new_int(radio_state));
    json_object_object_add(obj_date, "operator", obj_operator);

    // up true or false BEGIN
    // struct json_object *obj_up_result = sr_util_json_object_object_get(obj_ip_status_wan_result, "up");

    // printf("obj_up_result=%s\n", json_object_to_json_string(obj_up_result));

    // if(json_object_get_boolean (obj_up_result)) {
    // 	printf("===obj_up_bool = TRUE \n");
    // } else {
    // 	printf("===obj_up_bool = FALSE... \n");
    // }
    // END


    obj_ipv4_address_result = sr_util_json_object_object_get(obj_ip_status_wan_result, "ipv4-address");

    if (obj_ipv4_address_result != NULL) {
        struct json_object *obj_ipv4_address_result_mask;
        obj_ipv4_address_result1 = json_object_array_get_idx(obj_ipv4_address_result, 0);
        obj_ipv4_address_result2 = sr_util_json_object_object_get(obj_ipv4_address_result1, "address");
        if (obj_ipv4_address_result2 != NULL) {
            json_object_object_add(obj_date, "wan_ip", obj_ipv4_address_result2);
        }

        obj_ipv4_address_result_mask = sr_util_json_object_object_get(obj_ipv4_address_result1, "mask");
        if (obj_ipv4_address_result_mask != NULL) {
            json_object_object_add(obj_date, "mask", obj_ipv4_address_result_mask);
        }

    }

    json_object *obj_route_result = sr_util_json_object_object_get(obj_ip_status_wan_result, "route");
    if (obj_route_result != NULL) {
        json_object *obj_route_result_1 = json_object_array_get_idx(obj_route_result, 1);
        json_object *obj_gateway_result = sr_util_json_object_object_get(obj_route_result_1, "nexthop");

        json_object_object_add(obj_date, "gateway", obj_gateway_result);
    }

    json_object_object_add(obj_date, "roaming", get_nw_roaming());
    // // TODO: 0-4 temporary for now zhengzhida
    json_object_object_add(obj_date, "signal", get_nw_signal_strength());

    sim_card_pin_status_t sim_card_pin_status = get_sim_card_info();
    json_object_object_add(obj_date, "PINLockState", json_object_new_int(sim_card_pin_status.pinLockState));
    json_object_object_add(obj_date, "PINCodeState", json_object_new_int(sim_card_pin_status.pinCodeState));
    // json_object_object_add(obj_date,"PINLockState", get_pin_state());

    json_object_object_add(obj_date, "dataMode", json_object_new_int(rat_mode));

    print_json(RESPONSE_CODE_OK, NULL, obj_date);
    return 0;
}

int setting_sim_get(int argc, const char *argv[]) {
    // sim data enable
    int radio_state = mipc_sim_nw_radio_state_get(0);
    int rat_mode = mipc_sim_nw_get_rat();
    struct json_object *obj_date = json_object_new_object();

    json_object_object_add(obj_date, "enable", json_object_new_int(radio_state));
    json_object_object_add(obj_date, "roaming", get_nw_roaming());
    json_object_object_add(obj_date, "dataMode", json_object_new_int(rat_mode));

    print_json(RESPONSE_CODE_OK, NULL, obj_date);
    return 0;
}

int sim_enable_set(int argc, const char *argv[]) {
    char *enable;

    if (argc >= 1) {
        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        json_object *obj_str2 = sr_util_json_object_object_get(obj_str, "enable");
        if (obj_str2 == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        enable = (char *) json_object_get_string(obj_str2);
        if (strcmp(enable, "1") == 0) {
            mipc_sim_nw_radio_state_set(1);
            print_json(RESPONSE_CODE_OK, "SIM radio is ENABLED", NULL);
        } else if (strcmp(enable, "0") == 0) {
            mipc_sim_nw_radio_state_set(0);
            print_json(RESPONSE_CODE_OK, "SIM radio is DISABLED", NULL);
        } else {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
        }
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }
    return 0;
}

int setting_sim_set(int argc, const char *argv[]) {

    if (argc >= 1) {
        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        json_object *obj_str_enable = sr_util_json_object_object_get(obj_str, "enable");
        json_object *obj_str_roaming = sr_util_json_object_object_get(obj_str, "roaming");
        json_object *obj_str_dataMode = sr_util_json_object_object_get(obj_str, "dataMode");

        //
        if ((obj_str_enable == NULL) || (obj_str_roaming == NULL) || (obj_str_dataMode == NULL)) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        int enable = json_object_get_int(obj_str_enable);
        if (enable == 0) {
            mipc_sim_nw_radio_state_set(0);
        } else if (enable == 1) {
            mipc_sim_nw_radio_state_set(1);
        } else {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        // roaming para exists
        if (obj_str_roaming != NULL) {
            int roaming = json_object_get_int(obj_str_roaming);
            if (roaming == 0 || roaming == 1) {
                set_nw_roaming(roaming);
                // print_json(RESPONSE_CODE_OK, "roaming is off", NULL);
            } else {
                // printf("wrong");
                print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
                return -1;
            }
        }

        int data_mode = json_object_get_int(obj_str_dataMode);
        int result = mipc_sim_nw_set_rat(data_mode);
        if (result == -1) {
            print_json(RESPONSE_CODE_ERROR_PARAM, "nw_set_rat: set rat fail!", NULL);
            return -1;
        }
        print_json(RESPONSE_CODE_OK, "sim setting is set successfully", NULL);
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }
    return 0;
}

int system_reboot(int argc, const char *argv[]) {
    // /sbin/reboot
    char *cmd = "sleep 3 && /sbin/reboot &";

    if (argc >= 1) {
        int reboot_code = 0;

        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        json_object *obj_str_reboot = sr_util_json_object_object_get(obj_str, "reboot");
        reboot_code = json_object_get_int(obj_str_reboot);
        if (reboot_code == 1) {
            print_json(RESPONSE_CODE_OK, "reboot...", NULL);
            system(cmd);
        } else {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
        }
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }

    return 0;
}

int system_reset(int argc, const char *argv[]) {
    char *cmd = "sleep 3 && /sbin/firstboot -r -y &";

    if (argc >= 1) {
        int reset_code = 0;

        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            // printf("paramter is error\n");
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        json_object *obj_str_reset = sr_util_json_object_object_get(obj_str, "reset");
        reset_code = json_object_get_int(obj_str_reset);
        if (reset_code == 1) {
            print_json(RESPONSE_CODE_OK, "Factory reset...", NULL);
            system(cmd);
        } else {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
        }
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }

    return 0;
}

int system_info_heat_get(int argc, const char *argv[]) {
    struct json_object *obj_all = json_object_new_object();
    json_object_object_add(obj_all, "temp", get_temperature());
    print_json(RESPONSE_CODE_OK, NULL, obj_all);
    return 0;
}

int system_info_ram_get(int argc, const char *argv[]) {
    struct json_object *obj_all = json_object_new_object();
    struct json_object *obj_cmd_info_result = get_system_info();
    struct json_object *obj_cmd_info_memory_result = sr_util_json_object_object_get(obj_cmd_info_result, "memory");
    json_object_object_add(obj_all, "memoryTotal", sr_util_json_object_object_get(obj_cmd_info_memory_result, "total"));
    json_object_object_add(obj_all, "memoryFree", sr_util_json_object_object_get(obj_cmd_info_memory_result, "free"));
    print_json(RESPONSE_CODE_OK, NULL, obj_all);
    return 0;
}

int network_dhcp_dnsmasq_reload() {
    char *cmd = "/etc/init.d/dnsmasq reload";

    system(cmd);
    return 0;
}

int network_dhcp_get(int argc, const char *argv[]) {
    char ip_address[16] = {0};
    uci_dhcp_object uci_dhcp_obj = {0};
    uci_dhcp_option_get_all(&uci_dhcp_obj);

    struct json_object *obj_date = json_object_new_object();

    json_object_object_add(obj_date, "start", json_object_new_int(atoi(uci_dhcp_obj.start)));
    json_object_object_add(obj_date, "limit", json_object_new_int(atoi(uci_dhcp_obj.limit)));
    json_object_object_add(obj_date, "expire", json_object_new_string(uci_dhcp_obj.leasetime));

    // get ip
    uci_network_option_get_ipaddr(ip_address);
    json_object_object_add(obj_date, "gateway", json_object_new_string(ip_address));

    print_json(RESPONSE_CODE_OK, NULL, obj_date);
    return 0;
}

int network_dhcp_set(int argc, const char *argv[]) {
    if (argc >= 1) {
        uci_dhcp_object uci_dhcp_obj = {0};
        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        json_object *obj_str_start = sr_util_json_object_object_get(obj_str, "start");
        json_object *obj_str_limit = sr_util_json_object_object_get(obj_str, "limit");
        json_object *obj_str_leasetime = sr_util_json_object_object_get(obj_str, "expire");

        if ((obj_str_start == NULL) || (obj_str_limit == NULL) || (obj_str_leasetime == NULL)) {
            print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
            return -1;
        }

        uci_dhcp_obj.start = (char *) json_object_get_string(obj_str_start);
        uci_dhcp_obj.limit = (char *) json_object_get_string(obj_str_limit);
        uci_dhcp_obj.leasetime = (char *) json_object_get_string(obj_str_leasetime);

        int ret = uci_dhcp_option_set_all(&uci_dhcp_obj);

        if (ret == 0) {
            network_dhcp_dnsmasq_reload();
            print_json(RESPONSE_CODE_OK, "DHCP settings is saved successfully", NULL);
        } else {
            print_json(RESPONSE_CODE_ERROR_SET, "DHCP settings is error to set", NULL);
        }

        return 0;
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
        return -1;
    }
}

int traffic_project_get(int argc, const char *argv[]) {
    uci_traffic_object uci_traffic_obj = {0};
    uci_traffic_option_get(&uci_traffic_obj);

    struct json_object *obj_date = json_object_new_object();
    json_object_object_add(obj_date, "start", json_object_new_int(atoi(uci_traffic_obj.start)));
    json_object_object_add(obj_date, "limit", json_object_new_int(atoi(uci_traffic_obj.limit)));

    print_json(RESPONSE_CODE_OK, NULL, obj_date);
    return 0;
}

int traffic_project_set(int argc, const char *argv[]) {
    if (argc >= 1) {
        uci_traffic_object uci_traffic_obj = {0};

        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
            return -1;
        }

        json_object *obj_str_start = sr_util_json_object_object_get(obj_str, "start");
        json_object *obj_str_limit = sr_util_json_object_object_get(obj_str, "limit");

        //
        if ((obj_str_start == NULL) || (obj_str_limit == NULL)) {
            print_json(RESPONSE_CODE_ERROR_PARAM, "error paramters", NULL);
            return -1;
        }

        uci_traffic_obj.start = (char *) json_object_get_string(obj_str_start);
        uci_traffic_obj.limit = (char *) json_object_get_string(obj_str_limit);

        int ret = uci_traffic_option_set_all(&uci_traffic_obj);

        if (ret == 0) {
            print_json(RESPONSE_CODE_OK, "traffic configuration is set successfully", NULL);
        } else {
            print_json(RESPONSE_CODE_ERROR_SET, "traffic configuration is error to set", NULL);
        }
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }

    return 0;
}

int traffic_stat_modem_get(int argc, const char *argv[]) {
    char *cmdResult;
    // char *cmd = "vnstat -u && vnstat --json";
    // char *cmd = "CURRENT_MODEM=$(uci -q get hellapi.settings.currentModem) &&  [ -z \"$CURRENT_MODEM\" ] || vnstat -u -i $CURRENT_MODEM";


    system("CURRENT_MODEM=$(uci -q get hellapi.settings.currentModem) &&  [ -z \"$CURRENT_MODEM\" ] || vnstat -u -i $CURRENT_MODEM");
    char *cmd = "vnstat --json";
    // memset(cmdResult, '\0', sizeof(cmdResult));
    cmdResult = execute_cmd(cmd);
//    printf("cmdResult:%s", cmdResult);
    json_object *obj_data = json_tokener_parse(cmdResult);

    if (obj_data != NULL) {
        print_json(RESPONSE_CODE_OK, NULL, obj_data);
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }

    json_object_put(obj_data);

    return 0;
}

// int traffic_stat_get(int argc, const char *argv[])
// {
// 	char cmdResult[2048];
// 	char *cmd = "vnstat -i ccmni1 -u && vnstat -i ccmni1 --json";

// 	memset(cmdResult, '\0', sizeof(cmdResult));
// 	execute_cmd(cmd, cmdResult);
// 	// printf("%s %d, cmdResult = %s\n", __func__, __LINE__, cmdResult);
// 	print_json(RESPONSE_CODE_OK, NULL, json_tokener_parse(cmdResult));
// 	return 0;
// }

// int traffic_realtime_get(int argc, const char *argv[])
// {
// 	char cmdResult[2048];
// 	char *cmd = "vnstat -i ccmni1 -tr 2 --json";

// 	memset(cmdResult, '\0', sizeof(cmdResult));
// 	execute_cmd(cmd, cmdResult);
// 	// printf("%s %d, cmdResult = %s\n", __func__, __LINE__, cmdResult);
// 	print_json(RESPONSE_CODE_OK, NULL, json_tokener_parse(cmdResult));
// 	return 0;
// }


// #define QL_UART1_DEV  "/dev/ttyS1"

// static int fd_uart = -1;

// static pthread_t thrd_uart_rcv;
// static void* UartRecv_Proc(void* arg);

// int hellapi_uart(int argc, const char *argv[])
// {
// 	int iRet;
// 	int baudRate = 115200;
// 	char strTmp[] = "uart test, =+-_0)9(8*7&6^5%4$3#2@1!`~)\n";

// 	if (argc < 2)
// 	{
// 		printf("Usage: %s <baud rate> \n", argv[0]);
// 		return -1;
// 	}

// 	printf("< OpenLinux: UART example >\n");

// 	// baudRate = atoi(argv[1]);
// 	fd_uart = ql_uart_open(QL_UART1_DEV, O_RDWR | O_NOCTTY | O_NONBLOCK);
// 	if(fd_uart < 0){
// 		printf("<open\"%s\" fail,fd: %d >\n", QL_UART1_DEV, fd_uart);
// 		return -1;	
// 	}

// 	/* Start: If you need, to modify uart dcb config */
// 	ST_UARTDCB dcb = {
// 		.flowctrl = FC_NONE,	//none flow control
// 		.databit = DB_CS8,	//databit: 8
// 		.stopbit = SB_1,	//stopbit: 1
// 		.parity = PB_NONE,	//parity check: none
// 		.baudrate = baudRate	//baudrate: 115200
// 	};

// 	iRet = ql_uart_setdcb(fd_uart, &dcb);
// 	printf("SET DCB ret: %d\n", iRet);
// 	iRet = ql_uart_getdcb(fd_uart, &dcb);
// 	printf("GET DCB ret: %d: baudrate: %d, flowctrl: %d, databit: %d, stopbit: %d, paritybit: %d\n", 
// 				iRet, dcb.baudrate, dcb.flowctrl, dcb.databit, dcb.stopbit, dcb.parity);
// 	/* End: if need, to modify uart dcb config */


// 	/*
// 	*  Create a thread to handle uart rx data
// 	*/
// 	if (pthread_create(&thrd_uart_rcv, NULL, UartRecv_Proc, NULL) != 0)
// 	{
// 		printf("Fail to create thread!\n");
// 	}

// 	while (fd_uart >=0)
// 	{
// 		iRet = ql_uart_write(fd_uart, (const void*)strTmp, sizeof(strTmp));
// 		printf("< write(fd=%d)=%d\n", fd_uart, iRet);
// 		sleep(1);
// 	}
// 	return 0;
// }

// static void* UartRecv_Proc(void* arg)
// {
// 	int iRet;
// 	fd_set fdset;
// 	struct timeval timeout = {3, 0};	// timeout 3s
// 	char buffer[100] = {0};

// 	while (fd_uart >=0)
// 	{
// 		FD_ZERO(&fdset); 
// 		FD_SET(fd_uart, &fdset); 
// 		iRet = select(fd_uart + 1, &fdset, NULL, NULL, &timeout);
// 		if (-1 == iRet)
// 		{
// 			printf("< failed to select >\n");
// 			exit(-1);
// 		}
// 		else if (0 == iRet)
// 		{// no data in Rx buffer
// 			printf("< no data >\n");
// 			timeout.tv_sec  = 3;
// 			timeout.tv_usec = 0;
// 		}
// 		else
// 		{// data is in Rx data
// 			if (FD_ISSET(fd_uart, &fdset)) 
// 			{
// 				do {
// 					memset(buffer, 0x0, sizeof(buffer));
// 					iRet = ql_uart_read(fd_uart, buffer, 100);
// 					printf("> read(uart)=%d:%s\n", iRet, buffer);
// 				} while (100 == iRet);
// 			}
// 		}
// 	}
// 	return (void *)1;
// }

// int clients_list_get(int argc, const char *argv[])
// {
// 	Enum_PinName m_GpioPin = PINNAME_GPIO_206;
// 	int iRet = Ql_GPIO_SetPullSelection(PINNAME_GPIO_206, PINPULLSEL_PULLUP);

// 	printf("< Ql_GPIO_SetPullSelection: gpio=%d, pullsel=%d, iRet=%d >\n", m_GpioPin, PINPULLSEL_PULLUP, iRet);

// 	iRet = Ql_GPIO_SetPullSelection(PINNAME_GPIO_173, PINPULLSEL_PULLUP);
// 	printf("< Ql_GPIO_SetPullSelection: gpio=%d, pullsel=%d, iRet=%d >\n", PINNAME_GPIO_173, PINPULLSEL_PULLUP, iRet);
// 	return 0;
// }

void speed_moniter_print_mac_pair(struct mac_ip_pair *pair) {
    // struct json_object *obj_date;// = json_object_new_object();
    // struct json_object *obj_item;// = json_object_new_object();

    // struct json_object *obj_array = json_object_new_array();

    // int i = 0;
    // int j = 0;
    // int item_id = -1;

    // for (i = 0; is_zero_ether_addr(pair[i].mac_addr) != SPEED_MONITOR_ZERO_ADDR; i++)
    // {
    // 	char key[18] = {0};
    // 	sprintf(key, "%02x:%02x:%02x:%02x:%02x:%02x", NMACQUAD(pair[i].mac_addr));

    // 	int size = json_object_array_length(obj_array);
    // 	item_id = -1;

    // 	// find the json_item by key
    // 	for(j = 0; j< size; j++) {
    // 		if(sr_util_json_object_object_get(json_object_array_get_idx (obj_array, j), key) != NULL) {
    // 			// if exist get item_id
    // 			item_id = j;
    // 		}
    // 	}

    // 	if(item_id == -1)
    // 	{
    // 		obj_date = json_object_new_object();
    // 		obj_item = json_object_new_object();
    // 		json_object_object_add(obj_item, "tx", json_object_new_int64(pair[i].total_packets.tx_bytes));
    // 		json_object_object_add(obj_item, "rx", json_object_new_int64(pair[i].total_packets.rx_bytes));

    // 		json_object_object_add(obj_date, key, obj_item);
    // 		json_object_array_add(obj_array, obj_date);
    // 	} else {
    // 		obj_date = json_object_array_get_idx(obj_array, item_id);
    // 		long long tx = 	json_object_get_int64 (sr_util_json_object_object_get(sr_util_json_object_object_get(obj_date, key), "tx"));
    // 		long long rx = json_object_get_int64 (sr_util_json_object_object_get(sr_util_json_object_object_get(obj_date, key), "rx"));
    // 		obj_item = json_object_new_object();
    // 		json_object_object_add(obj_item, "tx", json_object_new_int64(tx + pair[i].total_packets.tx_bytes));
    // 		json_object_object_add(obj_item, "rx", json_object_new_int64(rx + pair[i].total_packets.rx_bytes));

    // 		json_object_object_del (obj_date, key);
    // 		json_object_object_add(obj_date, key, obj_item);
    // 	}
    // }
    // print_json(RESPONSE_CODE_OK, NULL, obj_array);
}

void speed_moniter_inject_stream_to_pair(struct mac_ip_pair *pair, struct hwnat_mib_ip_mac *entries) {
// 	int i = 0;
// Again:
// 	if(is_zero_ether_addr(pair[i].mac_addr) == SPEED_MONITOR_ZERO_ADDR) {
// 		memcpy(pair[i].mac_addr, entries->mac_addr, ETH_ALEN);
// 		pair[i].total_packets.tx_bytes = entries->total_packets.tx_bytes;
// 		pair[i].total_packets.rx_bytes = entries->total_packets.rx_bytes;
// 	} else {
// 		//this iterator will take around pair struct, if you find suitable mac_addr would inc pair:i,otherwise would goto indect func again.
// 		for (i = i; is_zero_ether_addr(pair[i].mac_addr) != SPEED_MONITOR_ZERO_ADDR; i++)
// 		{
// 			if(memcmp(pair[i].mac_addr, entries->mac_addr, ETH_ALEN) == 0) {
// 				pair[i].total_packets.tx_bytes += entries->total_packets.tx_bytes;
// 				pair[i].total_packets.rx_bytes += entries->total_packets.rx_bytes;
// 			} else {
// 				i++;
// 				goto Again;
// 			}
// 		}
// 	}
}

void speed_moniter_print_data(void *arg_in) {
    // int i = 0;
    // struct mac_ip_pair pair_ip_mac[HWNAT_MAX_MIB_IP_ENTRY_NUM] = {0};
    // struct hwnat_mib_all_ip_mac_args_total *argsSpeed = NULL;
    // if(is_pop_total) {
    // 	argsSpeed = (struct hwnat_mib_all_ip_mac_args_total *)arg_in;
    // }
    // else {
    // 	argsSpeed = (struct hwnat_mib_all_ip_mac_args_rt *)arg_in;
    // }
    // for(i = 0; i<argsSpeed->entry_num; i++) {
    // 	if(is_zero_ether_addr(argsSpeed->entries[i].mac_addr) != SPEED_MONITOR_ZERO_ADDR) {
    // 		speed_moniter_inject_stream_to_pair(pair_ip_mac, &argsSpeed->entries[i]);
    // 	}
    // }
    // speed_moniter_print_mac_pair(pair_ip_mac);


    // int i = 0;
    // struct hwnat_mib_all_ip_mac_args_total *argsSpeed = NULL;
    // argsSpeed = (struct hwnat_mib_all_ip_mac_args_total *)arg_in;

    // printf("\r\n==================entry_num===================================\r\n");
    // printf("MAC            tx/bps          rx/bps            tx                rx\n");
    // for(i=0; i<argsSpeed->total_num; i++) {
    // printf("%02X:%02X:%02X:%02X:%02X:%02X   %12ld %12ld        %16ld  %16ld \n",
    // 	NMACQUAD(argsSpeed->entries[i].packets_total.mac_addr),
    // 	argsSpeed->entries[i].packets_currect.packets.tx_bytes*8,
    // 	argsSpeed->entries[i].packets_currect.packets.rx_bytes*8,
    // 	argsSpeed->entries[i].packets_total.packets.tx_bytes*8,
    // 	argsSpeed->entries[i].packets_total.packets.rx_bytes*8);
    // }
}

void clients_client_get_info(const char *client_item) {
    // char *tempstr = str;
    char *item_info = strtok(client_item, "_");
    int id = 0;
    while (item_info != NULL) {
        if (id == 0) {
            printf("mac = %s\n", item_info);
        } else if (id == 1) {
            printf("tx  = %s\n", item_info);
        } else {
            printf("rx  = %s\n", item_info);
        }

        id++;
        item_info = strtok(NULL, "_");
    }
}

char *clients_client_get_traffic(const char *mac_cmp) {
    char *cmd_result;
    char *item;
    char mac[18] = {0}; // 00:00:00:00:00:00
    char *mark;

    {
        cmd_result = execute_cmd("uci -c /tmp/config get vnstat.clients.client");
        item = strtok(cmd_result, "|");
        while (item != NULL) {
            mark = strchr(item, '_');
            if (mark != NULL) {
                int length = mark - item;
                strncpy(mac, item, length);

                if (strcmp(mac, mac_cmp) == 0) {
                    return item;
                }
            }
            item = strtok(NULL, "|");
        }
    }

    return "";
}

char *clients_client_get_qos(const char *mac_cmp) {
    char *cmd_result;
    char *item;
    char mac[18] = {0}; // 00:00:00:00:00:00
    char *mark;

    {
        cmd_result = execute_cmd("uci -d \"|\" get hellapi.qos.clients");
        item = strtok(cmd_result, "|");
        while (item != NULL) {
            mark = strchr(item, '_');
            if (mark != NULL) {
                int length = mark - item;
                strncpy(mac, item, length);

                if (strcmp(mac, mac_cmp) == 0) {
                    return item;
                }
            }
            item = strtok(NULL, "|");
        }
    }

    return "";
}

char *clients_client_match_traffic(char *result, const char *mac_cmp) {
    char cmd_result[2048] = {0};
    char *item;
    char mac[18] = {0}; // 00:00:00:00:00:00
    char *mark;

    {
        // execute_cmd("uci -d '|' get vnstat.clients.client", cmd_result);
        strcpy(cmd_result, result);
        item = strtok(cmd_result, "|");
        while (item != NULL) {
            mark = strchr(item, '_');
            if (mark != NULL) {
                int length = mark - item;
                strncpy(mac, item, length);

                if (strcmp(mac, mac_cmp) == 0) {
                    return item;
                }
            }
            item = strtok(NULL, "|");
        }
    }

    return "";
}

char *clients_client_match_qos(char *result, const char *mac_cmp) {
    char cmd_result[2048] = {0};
    char *item;
    char mac[18] = {0}; // 00:00:00:00:00:00
    char *mark;
    if (strlen(result) > 0) {
        // execute_cmd("uci -d '|' get hellapi.qos.clients", cmd_result);
        strcpy(cmd_result, result);
        item = strtok(cmd_result, "|");
        while (item != NULL) {
            mark = strchr(item, '_');
            if (mark != NULL) {
                int length = mark - item;
                strncpy(mac, item, length);
                if (strcmp(mac, mac_cmp) == 0) {
                    return item;
                }
            }
            item = strtok(NULL, "|");
        }
    }

    return "";
}

#if 0 // shmget 
char *clients_shm_get_traffic()
{
    int shm_fd;
    key_t key;
    key = ftok("/tmp", 23);

    shm_fd = shmget(key, 0, 0);
    if (shm_fd == -1) {
        perror("because");
        // exit(-1);
        return NULL;
    }
    return (char *)shmat(shm_fd, 0, 0);
}
#endif

// void *pthread_clients_list_get()
int clients_list_get(int argc, const char *argv[]) {
    // shm mmap for traffic
    char *result_traffic;
    int shm_fd2 = shm_open("traffics", O_RDONLY, 0666);
    ftruncate(shm_fd2, 1024 * 4);
    result_traffic = mmap(NULL, 1024 * 4, PROT_READ, MAP_SHARED, shm_fd2, 0);

    // get qos
    char *result_qos;
    result_qos = execute_cmd("uci -d \"|\" get hellapi.qos.clients");

    // get DHCP
    char *cmd_result;
    cmd_result = execute_cmd("ubus call luci-rpc getDHCPLeases");
    json_object *obj_result = json_tokener_parse(cmd_result);
    json_object *obj_array = sr_util_json_object_object_get(obj_result, "dhcp_leases");

    struct json_object *obj_data = json_object_new_object();
    int array_length = json_object_array_length(obj_array);
    // get array
    for (int i = 0; i < array_length; i++) {
        json_object *obj_mac = sr_util_json_object_object_get(json_object_array_get_idx(obj_array, i), "macaddr");
        char *mac = (char *) json_object_get_string(obj_mac);
        struct json_object *obj_item = json_object_new_object();
        json_object_object_add(obj_item, "traffic",
                               json_object_new_string(clients_client_match_traffic(result_traffic, mac)));
        json_object_object_add(obj_item, "qos", json_object_new_string(clients_client_match_qos(result_qos, mac)));
        json_object_object_add(obj_data, mac, obj_item);
    }

    print_json(RESPONSE_CODE_OK, NULL, obj_data);

    json_object_put(obj_data);
    json_object_put(obj_array);
    json_object_put(obj_result);

    fflush(stdout);
    return 0;
}

// get sim pin setting
int sim_setting_pin_get(int argc, const char *argv[]) {

    int ret = 0;
    ql_sim_card_info_t info = {0};
    uint16_t remain_time = 0;

    ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to init", NULL);
        return -1;
    }

    ret = ql_sim_get_card_info(QL_SIM_SLOT_1, &info);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to get pin state", NULL);
        goto RELEASE;
    }


    ret = ql_sim_get_pin_remain_time(QL_SIM_SLOT_1, &remain_time);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to get remian time", NULL);
        goto RELEASE;
    }

    // info.state
    // QL_SIM_STATUS_SIM_PIN			= 3,
    // QL_SIM_STATUS_SIM_PUK			= 4,
    // QL_SIM_STATUS_COMPLETE_READY		= 21,


    // printf("pin_type  = %d\n", pin_resp_info.pin_type);
    // printf("pin_state = %d\n", pin_resp_info.pin_state);
    // printf("remaining_attempts = %d\n", pin_resp_info.remaining_attempts);

    struct json_object *obj_date = json_object_new_object();
    // pinState
    if (info.state == QL_SIM_STATUS_SIM_PUK) {
        json_object_object_add(obj_date, "pinState", json_object_new_string("PUK_Block"));
    } else if (info.state == QL_SIM_STATUS_SIM_PIN) {
        json_object_object_add(obj_date, "pinState", json_object_new_string("enable+no_verify"));
    } else if (info.state == QL_SIM_STATUS_COMPLETE_READY) {
        for (int index = 0; index < info.app_num; index++) {
            if (info.app_list[index].pin1_state == 3) {
                json_object_object_add(obj_date, "pinState", json_object_new_string("disable"));
            } else if (info.app_list[index].pin1_state == 2) {
                json_object_object_add(obj_date, "pinState", json_object_new_string("enable+verify_success"));
            }
        }
    } else {
        // wrong status
        json_object_object_add(obj_date, "pinState", json_object_new_string("Invalid Status!"));
    }

    json_object_object_add(obj_date, "pinRemain", json_object_new_int(remain_time));

    print_json(RESPONSE_CODE_OK, NULL, obj_date);

    RELEASE:
    ret = ql_sim_release();
    if (ret != QL_SIM_SUCCESS) {
        // printf("failed, ret = %d\n", ret);
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to release", NULL);
    }

    return 0;
}

SIM_PIN_ACTION_E sim_pin_get_action(const char *action) {
    if (strcmp(action, "enable") == 0) {
        return SIM_PIN_ACTION_ENABLE;
    } else if (strcmp(action, "disable") == 0) {
        return SIM_PIN_ACTION_DISABLE;
    } else if (strcmp(action, "change") == 0) {
        return SIM_PIN_ACTION_CHANGE;
    } else if (strcmp(action, "verify") == 0) {
        return SIM_PIN_ACTION_VERIFY;
    } else {
        return SIM_PIN_ACTION_ERROR;
    }
}

void sim_setting_pin_enable(const char *pin_value) {
    int ret = 0;
    ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to init", NULL);
        return;
    }
    ret = ql_sim_enable_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value);

    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to enable pin", NULL);
        goto RELEASE;
    }

    print_json(RESPONSE_CODE_OK, "sim pin is enbled successfully", NULL);

    RELEASE:
    ret = ql_sim_release();
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to release", NULL);
    }
}

void sim_setting_pin_disable(const char *pin_value) {
    int ret = 0;
    ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to init", NULL);
        return;
    }
    ret = ql_sim_disable_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value);

    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to disable pin", NULL);
        goto RELEASE;
    }

    print_json(RESPONSE_CODE_OK, "sim pin is disabled successfully", NULL);

    RELEASE:
    ret = ql_sim_release();
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to release", NULL);
    }
}

void sim_setting_pin_verify(const char *pin_value) {
    int ret = 0;
    ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to init", NULL);
        return;
    }
    ret = ql_sim_verify_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value);

    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to verify pin", NULL);
        goto RELEASE;
    }

    print_json(RESPONSE_CODE_OK, "sim pin is verified successfully", NULL);

    RELEASE:
    ret = ql_sim_release();
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to release", NULL);
    }
}

void sim_setting_pin_change_pin(const char *pin_value, const char *new_pin_value) {
    int ret = 0;
    ret = ql_sim_init(SIM_IPC_MODE_DEFAULT);
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to init", NULL);
        return;
    }

    ret = ql_sim_change_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value, new_pin_value);

    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to change pin", NULL);
        goto RELEASE;
    }

    print_json(RESPONSE_CODE_OK, "sim pin is changed successfully", NULL);

    RELEASE:
    ret = ql_sim_release();
    if (ret != QL_SIM_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sim pin failed to release", NULL);
    }
}

// set sim pin setting
int sim_setting_pin_set(int argc, const char *argv[]) {
    // enable;disable;change;verify
    // pinAction
    // pinCurrentCode
    // pinNewCode
    if (argc == 0) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "too few parameters", NULL);
        return -1;
    }

    json_object *obj_str = json_tokener_parse(argv[0]);
    if (obj_str == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    struct json_object *obj_action = sr_util_json_object_object_get(obj_str, "pinAction");
    if (obj_action == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    struct json_object *obj_pin_value = sr_util_json_object_object_get(obj_str, "pinCurrentCode");
    if (obj_pin_value == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "pin value cannot be null", NULL);
        return -1;
    }

    char *action = (char *) json_object_get_string(obj_action);
    char *pin_value = (char *) json_object_get_string(obj_pin_value);

    SIM_PIN_ACTION_E sim_pin_action = sim_pin_get_action(action);
    if (sim_pin_action == SIM_PIN_ACTION_ENABLE) {
        // ql_sim_enable_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value);
        sim_setting_pin_enable(pin_value);
    } else if (sim_pin_action == SIM_PIN_ACTION_DISABLE) {
        // ql_sim_disable_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value);
        sim_setting_pin_disable(pin_value);
    } else if (sim_pin_action == SIM_PIN_ACTION_VERIFY) {
        // ql_sim_verify_pin(QL_SIM_SLOT_1, QL_SIM_PIN_1, pin_value);
        sim_setting_pin_verify(pin_value);
    } else if (sim_pin_action == SIM_PIN_ACTION_CHANGE) {
        // ql_sim_change_pin(L_SIM_SLOT_1, QL_SIM_PIN_1, ole_pin_value, new_pin_value);
        struct json_object *obj_new_pin_value = sr_util_json_object_object_get(obj_str, "pinNewCode");
        if (obj_new_pin_value == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, "new pin value cannot be null", NULL);
            return -1;
        }
        char *new_pin_value = (char *) json_object_get_string(obj_new_pin_value);
        sim_setting_pin_change_pin(pin_value, new_pin_value);
    } else {
        //error
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    return 0;
}

int sms_list_get(int argc, const char *argv[]) {
    int ret = 0;
    int i = 0;
    int used_message_num = 0;

    // all
    ql_sms_read_pdu_req_t read_pdu_req;
    ql_sms_read_pdu_resp_t read_pdu_info;
    // index
    ql_sms_read_pdu_req_t read_pdu_req_index;
    ql_sms_read_pdu_resp_t read_pdu_info_index;

    struct json_object *obj_array = json_object_new_array();
    struct json_object *obj_date;// = json_object_new_object();

    ret = ql_sms_init(SMS_IPC_MODE_DEFAULT);
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms init error", NULL);
        return -1;
    }

    memset((void *) &read_pdu_req, 0, sizeof(ql_sms_read_pdu_req_t));
    read_pdu_req.flag = QL_SMS_FLAG_ALL;

    memset((void *) &read_pdu_info, 0, sizeof(ql_sms_read_pdu_resp_t));
    ret = ql_sms_read_pdu(&read_pdu_req, &read_pdu_info);
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms read get message number error", NULL);
        return -1;
    }
    used_message_num = read_pdu_info.message_count;

    memset((void *) &read_pdu_req_index, 0, sizeof(ql_sms_read_pdu_req_t));
    read_pdu_req_index.flag = QL_SMS_FLAG_INDEX;

    char content[QL_SMS_MAX_SEND_PDU_LENGTH];//= {0};
    for (int j = 0; j < used_message_num; j++) {
        char temparr[3] = {0};
        //request index
        read_pdu_req_index.message_index = read_pdu_info.all_message_index[j];
        memset((void *) &read_pdu_info_index, 0, sizeof(ql_sms_read_pdu_resp_t));
        ret = ql_sms_read_pdu(&read_pdu_req_index, &read_pdu_info_index);
        if (ret != QL_SMS_SUCCESS) {
            print_json(RESPONSE_CODE_ERROR_SET, "read sms error", NULL);
            continue;
        }

        memset(content, 0, QL_SMS_MAX_SEND_PDU_LENGTH);

        for (i = 0; i < read_pdu_info_index.content_size; i++) {
            sprintf(temparr, "%02x", read_pdu_info_index.content[i]);
            strcat(content, temparr);
            memset(temparr, 0, 3);
        }

        obj_date = json_object_new_object();
        json_object_object_add(obj_date, "id", json_object_new_int(read_pdu_req_index.message_index));
        json_object_object_add(obj_date, "content", json_object_new_string(content));
        json_object_array_add(obj_array, obj_date);
    }

    ret = ql_sms_release();
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms release error", NULL);
        return -1;
    }
    print_json(RESPONSE_CODE_OK, NULL, obj_array);
    return 0;
}

int sms_send_message(int argc, const char *argv[]) {
    int ret = 0;
    int val = 0;

    char *content = NULL;
    int content_len = 0;

    if (argc == 0) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "too few parameters", NULL);
        return -1;
    }

    json_object *obj_str = json_tokener_parse(argv[0]);
    if (obj_str == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    struct json_object *obj_array = sr_util_json_object_object_get(obj_str, "content");
    if (obj_array == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    int sms_array_length = json_object_array_length(obj_array);

    // init
    ret = ql_sms_init(SMS_IPC_MODE_DEFAULT);
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms init error", NULL);
        return -1;
    }

    ql_sms_pdu_t pdu;

    // get array
    for (int i = 0; i < sms_array_length; i++) {
        content = (char *) json_object_get_string(json_object_array_get_idx(obj_array, i));
        content_len = strlen(content);

        memset((void *) &pdu, 0, sizeof(ql_sms_pdu_t));
        pdu.format = QL_SMS_PDU_FORMAT_GW_PP;

        int i = 0;
        while (i < content_len) {
            char dest[3] = {0};
            strncpy(dest, content + (i), 2);

            sscanf(dest, "%x", &val);
            pdu.content[pdu.content_size++] = val;
            i = i + 2;
        }

        ret = ql_sms_send_pdu(&pdu);
        if (ret != QL_SMS_SUCCESS) {
            print_json(RESPONSE_CODE_ERROR_SET, "SMS failed to be sent", NULL);
            goto RELEASE;
        }
    }

    print_json(RESPONSE_CODE_OK, "SMS sent successfully", NULL);

    RELEASE:
    ret = ql_sms_release();
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms release error", NULL);
        return -1;
    }

    return 0;
}

int sms_delete_message(int argc, const char *argv[]) {
    int ret = 0;

    if (argc == 0) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "too few parameters", NULL);
        return -1;
    }

    json_object *obj_str = json_tokener_parse(argv[0]);
    if (obj_str == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    struct json_object *obj_array = sr_util_json_object_object_get(obj_str, "id");
    if (obj_array == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
        return -1;
    }

    int sms_array_length = json_object_array_length(obj_array);
    ret = ql_sms_init(SMS_IPC_MODE_DEFAULT);
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms init error", NULL);
        return -1;
    }

    for (int i = 0; i < sms_array_length; i++) {
        int storage_index = json_object_get_int(json_object_array_get_idx(obj_array, i));
        ret = ql_sms_delete_pdu(storage_index);
        if (ret != QL_SMS_SUCCESS) {
            print_json(RESPONSE_CODE_ERROR_SET, "SMS failed to be deleted", NULL);
            goto RELEASE;
        }
    }

    print_json(RESPONSE_CODE_OK, "Deleted successfully", NULL);

    RELEASE:
    // release
    ret = ql_sms_release();
    if (ret != QL_SMS_SUCCESS) {
        print_json(RESPONSE_CODE_ERROR_SET, "sms release error", NULL);
        return -1;
    }
    return 0;
}

// typedef enum {
//   QL_NET_AUTH_PREF_MIN = -1,
//   QL_NET_AUTH_PREF_PAP_CHAP_NOT_ALLOWED = 0, 
//   QL_NET_AUTH_PREF_PAP_ONLY_ALLOWED = 1, 
//   QL_NET_AUTH_PREF_CHAP_ONLY_ALLOWED = 2, 
//   QL_NET_AUTH_PREF_PAP_CHAP_BOTH_ALLOWED = 3, 
//   QL_NET_AUTH_PREF_MAX
// } QL_NET_AUTH_PREF_E;

// get sim apn setting
int sim_setting_apn_get(int argc, const char *argv[]) {
    int ret = 0;
    freopen("/dev/null", "w", stdout);
    ret = ql_data_call_init(DC_IPC_MODE_DEFAULT);
    if (ret) // != QL_ERR_OK
    {
        freopen("/dev/tty", "w", stdout);
        print_json(RESPONSE_CODE_ERROR_SET, "data call init error", NULL);
        return -1;
    }
    ql_get_ia_apn_config_t apn_config;
    memset(&apn_config, 0, sizeof(ql_get_ia_apn_config_t));

// typedef struct
// {
//     uint8_t has_iaapn;
//     QL_NET_IP_VER_E ip_type;
//     QL_NET_IP_VER_E roaming_type;
//     QL_NET_AUTH_PREF_E auth_type;
//     char apn_name[QL_NET_MAX_APN_NAME_LEN];
//     char username[QL_NET_MAX_APN_USERNAME_LEN];
//     char password[QL_NET_MAX_APN_PASSWORD_LEN];
// } ql_get_ia_apn_config_t;
    ret = ql_ia_apn_get(&apn_config);
    if (ret) // != QL_ERR_OK
    {
        freopen("/dev/tty", "w", stdout);
        print_json(RESPONSE_CODE_ERROR_SET, "date call error, failed to get apn", NULL);
        goto RELEASE;
    }

    // printf("%s %d has_iaapn=%d\n", __func__, __LINE__, apn_config.has_iaapn);
    // printf("%s %d ip_type=%d\n", __func__, __LINE__, apn_config.ip_type);
    // printf("%s %d roaming_type=%d\n", __func__, __LINE__, apn_config.roaming_type);
    // printf("%s %d auth_type=%d\n", __func__, __LINE__, apn_config.auth_type);
    // printf("%s %d apn_name=%s\n", __func__, __LINE__, apn_config.apn_name);
    // printf("%s %d username=%s\n", __func__, __LINE__, apn_config.username);
    // printf("%s %d password=%s\n", __func__, __LINE__, apn_config.password);

    freopen("/dev/tty", "w", stdout);
    print_json(RESPONSE_CODE_OK, "date call get apn successfully", NULL);

    RELEASE:
    ret = ql_data_call_deinit();
    if (ret) // != QL_ERR_OK
    {
        print_json(RESPONSE_CODE_ERROR_SET, "data call deinit error", NULL);
        return -1;
    }
    return 0;
}

// set sim apn setting
int sim_setting_apn_set(int argc, const char *argv[]) {
    int ret = 0;
    // if select TRUE, load the default apn when the apn_config setting fails
    bool set_ia_default = FALSE;

    if (argc == 0) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "too few parameters", NULL);
        return -1;
    }

    json_object *obj_str = json_tokener_parse(argv[0]);
    if (obj_str == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 0", NULL);
        return -1;
    }

    struct json_object *obj_select_mode = sr_util_json_object_object_get(obj_str, "selectMode");
    if (obj_select_mode == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 1", NULL);
        return -1;
    }

    struct json_object *obj_ip_type = sr_util_json_object_object_get(obj_str, "pdp");
    if (obj_ip_type == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 2", NULL);
        return -1;
    }

    struct json_object *obj_apn_name = sr_util_json_object_object_get(obj_str, "apnName");
    if (obj_apn_name == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 3", NULL);
        return -1;
    }

    struct json_object *obj_auth_type = sr_util_json_object_object_get(obj_str, "authType");
    if (obj_auth_type == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 4", NULL);
        return -1;
    }

    struct json_object *obj_username = sr_util_json_object_object_get(obj_str, "username");
    if (obj_username == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 5", NULL);
        return -1;
    }

    struct json_object *obj_password = sr_util_json_object_object_get(obj_str, "password");
    if (obj_password == NULL) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error 6", NULL);
        return -1;
    }

    char *select_mode = (char *) json_object_get_string(obj_select_mode);
    char *apn_name = (char *) json_object_get_string(obj_apn_name);
    char *username = (char *) json_object_get_string(obj_username);
    char *password = (char *) json_object_get_string(obj_password);

    int ip_type = json_object_get_int(obj_ip_type);
    int auth_type = json_object_get_int(obj_auth_type);

    // range check
    if (strcmp(select_mode, "auto") != 0 && strcmp(select_mode, "manual") != 0) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter selectMode error", NULL);
        return -1;
    }

    if (auth_type < 0 || auth_type > 3) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter authType range error", NULL);
        return -1;
    }

    if (ip_type < 1 || ip_type > 3) {
        print_json(RESPONSE_CODE_ERROR_PARAM, "paramter pdp range error", NULL);
        return -1;
    }

// selectMode 是 String   auto=自动 manual=手动 只有manual时其他选项可编辑
// pdp        是 Integer  0=IPv4 1=IPv6 2=IPv4v6
// apnName 	  是 String   可选择 已知的APN 自动返回账号密码 鉴权模式
// authType   是 Integer  PAP（0）、CHAP（1）、PAP/CHAP（2）和 NONE（3）
// username   是 String   
// password   是 String 

    freopen("/dev/null", "w", stdout);
    ret = ql_data_call_init(DC_IPC_MODE_DEFAULT);
    if (ret) // != QL_ERR_OK
    {
        freopen("/dev/tty", "w", stdout);
        print_json(RESPONSE_CODE_ERROR_SET, "data call init error", NULL);
        return -1;
    }

    ql_set_ia_apn_config_t apn_config;
    memset(&apn_config, 0, sizeof(ql_set_ia_apn_config_t));

    strncpy(apn_config.apn_name, apn_name, QL_NET_MAX_APN_NAME_LEN - 1);
    strncpy(apn_config.username, username, QL_NET_MAX_APN_USERNAME_LEN - 1);
    strncpy(apn_config.password, password, QL_NET_MAX_APN_PASSWORD_LEN - 1);
    apn_config.ip_type = ip_type;
    // set ip_type to roaming_type
    apn_config.roaming_type = ip_type;
    apn_config.auth_type = auth_type;


    // {{ save config tu UCI BEGIN
    uci_apn_config_object uci_apn_config_obj = {0};
    // memset(&uci_apn_config_obj, 0, sizeof(uci_apn_config_object));

    uci_apn_config_obj.apn_name = apn_name;
    uci_apn_config_obj.username = username;
    uci_apn_config_obj.password = password;

    // strncpy(uci_apn_config_obj.apn_name, apn_name, QL_NET_MAX_APN_NAME_LEN-1);
    // strncpy(uci_apn_config_obj.username, username, QL_NET_MAX_APN_USERNAME_LEN-1);
    // strncpy(uci_apn_config_obj.password, password, QL_NET_MAX_APN_PASSWORD_LEN-1);
    uci_apn_config_obj.ip_type = ip_type;
    uci_apn_config_obj.roaming_type = ip_type;
    uci_apn_config_obj.auth_type = auth_type;

    uci_apn_config_option_set_all(&uci_apn_config_obj);
    // }} save config tu UCI END

    // printf("%s %d apn_name=%s\n", __func__, __LINE__, apn_config.apn_name);
    ret = ql_ia_apn_set(&apn_config, set_ia_default);
    if (ret) // != QL_ERR_OK
    {
        freopen("/dev/tty", "w", stdout);
        print_json(RESPONSE_CODE_ERROR_SET, "date call error, failed to set apn", NULL);
        goto RELEASE;
    }

    freopen("/dev/tty", "w", stdout);
    print_json(RESPONSE_CODE_OK, "date call set apn successfully", NULL);

    RELEASE:
    ret = ql_data_call_deinit();
    if (ret) // != QL_ERR_OK
    {
        print_json(RESPONSE_CODE_ERROR_SET, "data call deinit error", NULL);
        return -1;
    }

    return 0;
}

// qos set
int clients_qos_set(int argc, const char *argv[]) {
    if (argc >= 1) {
        uci_traffic_object uci_traffic_obj = {0};

        json_object *obj_str = json_tokener_parse(argv[0]);
        if (obj_str == NULL) {
            print_json(RESPONSE_CODE_ERROR_PARAM, "paramter error", NULL);
            return -1;
        }

        json_object *obj_str_mac = sr_util_json_object_object_get(obj_str, "client");
        json_object *obj_str_rx = sr_util_json_object_object_get(obj_str, "rx");
        json_object *obj_str_tx = sr_util_json_object_object_get(obj_str, "tx");

        //
        if ((obj_str_rx == NULL) || (obj_str_tx == NULL) || (obj_str_mac == NULL)) {
            print_json(RESPONSE_CODE_ERROR_PARAM, "error paramters", NULL);
            return -1;
        }

        char *mac = (char *) json_object_get_string(obj_str_mac);
        int rx_queue = json_object_get_int(obj_str_rx);
        int tx_queue = json_object_get_int(obj_str_tx);

        // int ret_rx = run_set_qos(mac,rx_queue, QOS_DIRECTION_DOWNLOAD);
        // int ret_tx = run_set_qos(mac,tx_queue, QOS_DIRECTION_UPLOAD);
        int ret = run_set_qos(mac, rx_queue, tx_queue);

        if (ret == 0)//if(ret_rx == 0 && ret_tx == 0 )
        {
            print_json(RESPONSE_CODE_OK, "qos is set successfully", NULL);
        } else {
            print_json(RESPONSE_CODE_ERROR_SET, "qos is error to set", NULL);
        }
    } else {
        print_json(RESPONSE_CODE_ERROR_PARAM, ERROR_TIP_INVALID_ARUGMENT, NULL);
    }

    return 0;
}

int run_set_qos(char mac[], int queue_rx, int queue_tx) {
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

    char *match_qos = clients_client_get_qos(mac);
    if (strcmp(match_qos, "") != 0) {
        // printf("match_qos = %s", match_qos);
        sprintf(cmd, "uci del_list hellapi.qos.clients=%s", match_qos);

        // printf("uci del_list hellapi.qos.clients=%s", match_qos);

        system(cmd);
    }
    sprintf(cmd, "uci add_list hellapi.qos.clients=%s_%d_%d", mac, queue_rx, queue_tx);
    system(cmd);
    system("uci commit");

    return 0;
}

int wifi_test2(int argc, const char *argv[]) {

    // char cmdResult[1024];
    // char *cmd = "uci -q get hellapi.settings.boot";

    // memset(cmdResult, '\0', sizeof(cmdResult));
    // execute_cmd(cmd, cmdResult);
    // if(strcmp("1", cmdResult) == 0) {
    // 	printf("111 boot = %s\n", cmdResult);

    // 	system("uci set hellapi.settings.boot=0");
    // 	system("uci commit hellapi");
    // } else {
    // 	printf("222 boot = %s\n", cmdResult);

    // 	char *cmd2 = "uci set hellapi.settings.boot=1";
    // 	memset(cmdResult, '\0', sizeof(cmdResult));
    // 	execute_cmd(cmd2, cmdResult);

    // 	printf("111 boot = %s\n", cmdResult);
    // 	system("uci commit hellapi");
    // }

    // char str[] = "holy_12345";
    // const char ch = '_';
    // char *ptr;
    // char mac[20]={0};

    // ptr = strchr(str, ch);

    // if (ptr != NULL) {
    // 	// printf("ptr = %s", ptr);
    //     // printf("字符 '_' 出现的位置为 %ld。\n", ptr - str );
    //     int length = ptr - str;
    //     strncpy(mac, str, length );
    //     printf("mac = %s\n", mac);
    //     printf("number = %s\n", str + length + sizeof(ch));

    // } else {
    //     printf("没有找到字符 '_' 。\n");
    // }


    // char test_str[10]= "fuck_123";

    // char *tempchar;

    // int i = 0;
    // tempchar = strtok(test_str, "_");
    // while(tempchar != NULL)
    // {

    // 	if(i == 0) {
    // 		printf("mac = %s\n", tempchar);
    // 	} else {
    // 		printf("number = %s\n", tempchar);
    // 	}

    // 	tempchar = strtok(NULL, "_");
    // 	i++;
    // }
    // uci_test_set();
    // char start[16] = {0};

    // uci_test_set();


    // uci_network_option_get_ipaddr(start);
    // printf("[%s][%d] start=[%s]\n", __func__, __LINE__, "");

    // char *limit;
    // char *leasetime;

    // uci_dhcp_object uci_dhcp_obj = { 0 };
    // uci_dhcp_option_get_all(&uci_dhcp_obj);

    // printf("wifi_test2 start=[%d],limit=[%d],start=[%s]\n", uci_dhcp_obj.start, uci_dhcp_obj.limit, uci_dhcp_obj.leasetime);
    // printf("============================\n");

    // uci_init_package();
    // start = uci_dhcp_option_get(uci_get_context(),"start");
    // printf("start option=[%s]\n", start);
    // limit = uci_dhcp_option_get(uci_get_context(),"limit");
    // printf("limit option=[%s]\n", limit);
    // leasetime = uci_dhcp_option_get(uci_get_context(),"leasetime");
    // printf("leasetime option=[%s]\n", leasetime);
    // uci_free_package();

    // if(argc >= 1) {
    // 	json_object *obj_str = json_tokener_parse(argv[0]);
    // 	if(obj_str == NULL) {
    // 		// printf("paramter is error\n");
    // 		print_json(RESPONSE_CODE_ERROR_PARAM, "paramter is error", NULL);
    // 		return -1;
    // 	}

    // 	json_object *obj_str_start = json_object_object_get(obj_str, "start");

    // 	json_object_get_int(obj_str_start);
    // 	// json_object *obj_str_roaming = json_object_object_get(obj_str, "roaming");
    // 	// json_object *obj_str_dataMode = json_object_object_get(obj_str, "dataMode");
    // }
    // uci_option_set

    return 0;
}

// int wifi_mipc_test(int argc, const char *argv[])
// {
// 	// printf("%s Line:%d 111 \n", __func__, __LINE__);
// 	// sim_get_state(1);
// 	// hell_mipc_sim();
// 	int sim_state;
// 	int rat_mode;
// 	int pin_state;
// 	int radio_state;

// 	sim_state = sim_get_state();

//     rat_mode = nw_get_rat();

//     pin_state = sim_pin_info_get();

//     radio_state = nw_radio_state_get(0);
//     struct json_object *obj_all = json_object_new_object();

// 	json_object_object_add(obj_all, "simState" , json_object_new_int(sim_state));

// 	json_object_object_add(obj_all, "dataMode" , json_object_new_int(rat_mode));

// 	json_object_object_add(obj_all, "radioState" , json_object_new_int(radio_state));

// 	json_object_object_add(obj_all, "pinState" , json_object_new_int(pin_state));

// 	print_json(RESPONSE_CODE_OK, "Succeed to get sim state", obj_all);
// 	// print_json

//     // printf("sim_state=%d, rat_mode=%d, pin_state=%d\n", sim_state, rat_mode, pin_state);

// 	// printf("%s Line:%d 222 \n", __func__, __LINE__);
// 	return 0;
// }
