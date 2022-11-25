import { Divider, Stack, Box, FormGroup, FormControlLabel, Checkbox, TextField, Select, 
    MenuItem, Switch, Button  } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import 'animate.css';
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { bytesToHuman, Define, fetching, rpc as $rpc, secondsToWatch, FormBuilder } from './utils';
import { textAlign } from '@mui/system';

function BpCheckbox(props) {
    return (
      <Checkbox
        sx={{
          '&:hover': { bgcolor: 'transparent' },
        }}
        disableRipple
        inputProps={{ 'aria-label': 'Checkbox demo' }}
        {...props}
      />
    );
  }
  function Item(props) {
    const { children, ...other } = props;
    return (
      <Box
        sx={{ height: {md:"60px", xs:"40px"}, lineHeight: {md:"60px", xs:"40px"}, mb: "5px", fontSize: {xs:"12px",md:"1rem"}}}
        {...other}
      >
          <Box>
            <Stack>{children}</Stack>
          </Box>
      </Box>
    );
  }
  function TextFieldSelf(props) {
    return (
        <TextField
          label="" variant="outlined" sx={{ padding: "5px"}} size="small" {...props}
        />
      );
  }
  function DividerBlue(props) {
    return (
        <Divider textAlign="left" 
        sx={{mt: "30px", color: "#90caf9", 
            "& ::before": {borderTop: "thin solid #90caf9"},
            "& ::after": {borderTop: "thin solid #90caf9"}
        }}
        >{props.label}</Divider>
      );
  }

export default function SetWiFi() {
  /*********constants**********/
  //定义动态变量
  const showHigh = Define("none");
  const commonCheck = Define(true), show5GCheck = Define(false), Disable5G = Define(true);
  const wifi_enable = Define(true), wifi_enable_5 = Define(true);
  const wifi_name = Define(""), wifi_name_5 = Define("");
  const hide_wifi_name = Define(true), hide_wifi_name_5 = Define(true);
  const wifi_pwd = Define(""), wifi_pwd_5 = Define("");
  const ap = Define(true), ap_5 = Define(true);
  const security = Define("WPA2PSK"), security_5 = Define("WPA2PSK");
  const wireless = Define("1"), wireless_5 = Define("1");
  const bandwidth = Define("20"), bandwidth_5 = Define("20");
  const channel = Define("1"), channel_5 = Define("0");

  const securities = [
    {value: "WPAPSK/WPA2PSK", name: "WPAPSK/WPA2PSK"},
    {value: "WPA2PSK", name: "WPA2PSK"},
    {value: "WPA2PSK/WPA3PSK", name: "WPA2PSK/WPA3PSK"},
    {value: "WPA3PSK", name: "WPA3PSK"}
  ]
  const wirelessModes = [
    {value: "1", name: "B only"},
    {value: "4", name: "G only"},
    {value: "9", name: "B/G/GN mode"},
    {value: "16", name: "HE_2G mode"},
    {value: "0", name: "B/G mixed"},
    {value: "2", name: "A only"},
    {value: "8", name: "A/N in 5 band"},
    {value: "17", name: "HE_5G mode"},
    {value: "14", name: "A/AC/AN mixed"},
    {value: "15", name: "AC/AN mixed"}
  ]
  const channels = [
    {value: 1, name: "Channel 1"},
    {value: 2, name: "Channel 2"},
    {value: 3, name: "Channel 3"},
    {value: 4, name: "Channel 4"},
    {value: 5, name: "Channel 5"},
    {value: 6, name: "Channel 6"},
    {value: 7, name: "Channel 7"},
    {value: 8, name: "Channel 8"},
    {value: 9, name: "Channel 9"},
    {value: 10, name: "Channel 10"},
    {value: 11, name: "Channel 11"},
    {value: 12, name: "Channel 12"},
    {value: 13, name: "Channel 13"}
  ]
  const channels2 = [
    {value: 0, name: "Channel 0 (Auto)"},
    {value: 36, name: "Channel 36 (5.180GHz)"},
    {value: 40, name: "Channel 40 (5.200GHz)"},
    {value: 44, name: "Channel 44 (5.220GHz)"},
    {value: 48, name: "Channel 48 (5.240GHz)"},
    {value: 52, name: "Channel 52 (5.260GHz)"},
    {value: 56, name: "Channel 56 (5.280GHz)"},
    {value: 60, name: "Channel 60 (5.300GHz)"},
    {value: 64, name: "Channel 64 (5.320GHz)"}
  ]

  const HandleChangeValue = (dom, event, key) => {
    dom.set(event.target.value); //输入框、选择框等
    if(key && commonCheck.get()) {
        switch(key){
            case "name": wifi_name_5.set(event.target.value); break;
            case "pwd": wifi_pwd_5.set(event.target.value); break;
            case "security": security_5.set(event.target.value); break;
        }
    }
  };
  const HandleChangeBoolean = (dom, event, key) => {
    dom.set(event.target.checked); //滑动按钮、勾选框等
    if(key && commonCheck.get()) {
        switch(key){
            case "enable": wifi_enable_5.set(event.target.checked); break;
            case "hide": hide_wifi_name_5.set(event.target.checked); break;
            case "ap": ap_5.set(event.target.checked); break;
        }
    }
  };
  const Synchronize = (event) => {
    //同步2.4G与5G
    commonCheck.set(event.target.checked);
    wifi_enable_5.set(wifi_enable.get());
    hide_wifi_name_5.set(hide_wifi_name.get());
    wifi_name_5.set(wifi_name.get());
    wifi_pwd_5.set(wifi_pwd.get());
    ap_5.set(ap.get());
    security_5.set(security.get());
    Disable5G.set(event.target.checked ? true : false);
  };
  const ShowOrHide5G = (event) => {
    //显示高级设置
    show5GCheck.set(event.target.checked);
    showHigh.set(event.target.checked ? "flex" : "none");
  }

  /*********createEffect**********/
  createEffect(async () => {
    // await fetching_get_wifi_setting();
  })

  /*********functions**********/
  const fetching_get_wifi_setting = async () => {
    return await fetching(FormBuilder({
      "cmd": `wifi.setting.get`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
        wifi_enable.set(res["2g"].enable); wifi_name.set(res["2g"].name);
        hide_wifi_name.set(res["2g"].hideName == "0" ? false : true);
        wifi_pwd.set(res["2g"].password); ap.set(res["2g"].isolation == "0" ? false : true);
        security.set(res["2g"].authMode); channel.set(res["2g"].channel);
        bandwidth.set(res["2g"].bandwidth);  wireless.set(res["2g"].wirelessMode);
        wifi_enable_5.set(res["5g"].enable); wifi_name_5.set(res["5g"].name);
        hide_wifi_name_5.set(res["5g"].hideName == "0" ? false : true);
        wifi_pwd_5.set(res["5g"].password); ap_5.set(res["5g"].isolation == "0" ? false : true);
        security_5.set(res["5g"].authMode); channel_5.set(res["5g"].channel);
        bandwidth_5.set(res["5g"].bandwidth);  wireless_5.set(res["5g"].wirelessMode);
        commonCheck.set(res.sync == "0" ? false : true);
    })
  }
  const fetching_set_wifi_setting = async () => {
    const G2 = {
        enable: wifi_enable.get() ? "0" : "1",
        name: wifi_name.get(),
        hideName: hide_wifi_name.get() ? "0" : "1",
        password: wifi_pwd.get(),
        isolation: ap.get() ? "0" : "1",
        authMode: security.get(),
        channel: channel.get(),
        bandwidth: bandwidth.get(),
        wireless: wireless.get()
    }
    const G5 = {
        enable: wifi_enable_5.get() ? "0" : "1",
        name: wifi_name_5.get(),
        hideName: hide_wifi_name_5.get() ? "0" : "1",
        password: wifi_pwd_5.get(),
        isolation: ap_5.get() ? "0" : "1",
        authMode: security_5.get(),
        channel: channel_5.get(),
        bandwidth: bandwidth_5.get(),
        wireless: wireless_5.get()
    }
    return await fetching(FormBuilder({
        "cmd": `wifi.setting.set` + {"2g": G2, "5g": G5},
        "token": sessionStorage.getItem('sid'),
      }), 'webcmd'
      )
  }

  /*********styles**********/

  return useObserver(()=>(
    <Stack >
            <Grid container spacing={2}>
            <Grid xs={0.5}/>
            <Grid sx={{textAlign:"left"}}>
                <FormGroup>
                    <FormGroup>
                        <FormControlLabel checked={commonCheck.get()} control={<Checkbox disableRipple/>} 
                            onChange={(e)=>Synchronize(e)} label="Synchronous 2.4 and 5G common configuration"/>
                        <FormControlLabel checked={show5GCheck.get()} control={<Checkbox disableRipple/>} 
                            onChange={(e)=>ShowOrHide5G(e)} label="Show advanced options"/>
                    </FormGroup>
                </FormGroup>
            </Grid>
        </Grid>
        <Stack sx={{marginLeft: "4%", fontSize: "24px", marginTop: "20px", textAlign: "left", color: "#8dc8f7"}}><b>Common Configuration</b></Stack>
        <Divider/>
        {/* <DividerBlue label="Common Configuration"/> */}
        {/* <Divider textAlign="left" sx={{mt: "30px", color: "#90caf9", "& .css-1lu65d9-MuiDivider-root::before, .css-1lu65d9-MuiDivider-root::after": {borderTop: "thin solid #90caf9"}}}>Common Configuration</Divider> */}
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
        <Grid xs={4} md={4} >
                <Item></Item>   
            </Grid>
            <Grid xs={4} md={4} >
                <Item>2.4G</Item>   
            </Grid>
            <Grid xs={4} md={4} sx={{display: {xs: "none", md: "block"}}}>
            <Item><b>5G</b></Item>
            </Grid>
        </Grid>
        
        <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid xs={4} sx={{textAlign: "center",whiteSpace:"nowrap"}}>
                <Item>WiFi Enable</Item>
                <Item>WiFi Name</Item>
                <Item>Hide WiFi Name</Item>
                <Item>WiFi Password</Item>
                <Item>AP Isolation</Item>
                <Item>Security Protocol</Item>
            </Grid>
            <Grid xs={8} md={4} sx={{textAlign: "left","& input":{fontSize: {xs:"13px", md:"1rem"}}}}>
                <Item><Switch sx={{margin: "0 auto"}} checked={wifi_enable.get()} onChange={(e) => HandleChangeBoolean(wifi_enable, e, "enable")} /></Item>
                <Item><TextFieldSelf value={wifi_name.get()} onChange={(e) => HandleChangeValue(wifi_name, e, "name")} placeholder="Enter Your WiFi name"/></Item>
                <Item><BpCheckbox checked={hide_wifi_name.get()} onChange={(e) => HandleChangeBoolean(hide_wifi_name, e, "hide")} /></Item>
                <Item><TextFieldSelf value={wifi_pwd.get()} type="password" onChange={(e) => HandleChangeValue(wifi_pwd, e, "pwd")} placeholder="Enter Your WiFi password" /></Item>
                <Item><BpCheckbox checked={ap.get()} onChange={(e) => HandleChangeBoolean(ap, e, "ap")} /></Item>
                <Item>
                    <Select
                        value={security.get()}
                        onChange={(e) => HandleChangeValue(security, e, "security")}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"12px", md:"1rem"}}}
                    >
                        {securities.map((sec) => (
                            <MenuItem value={sec.value}>{sec.name}</MenuItem>
                        ))}
                    </Select>
                </Item>
            </Grid>
            <Grid xs={4} sx={{display: {xs: "none", md: "block"}}}>
                <Item><Switch checked={wifi_enable_5.get()} sx={{margin: "0 auto","& input":{fontSize: {xs:"13px", md:"1rem"}}}} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeBoolean(wifi_enable_5, e)} /></Item>
                <Item><TextFieldSelf value={wifi_name_5.get()} sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"13px", md:"1rem"}}}} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeValue(wifi_name_5, e)} placeholder="Enter Your WiFi name" inputProps={{maxLength: "50"}}/></Item>
                <Item><BpCheckbox checked={hide_wifi_name_5.get()} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeBoolean(hide_wifi_name_5, e)} /></Item>
                <Item><TextFieldSelf value={wifi_pwd_5.get()} sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"13px", md:"1rem"}}}} disabled={Disable5G.get()}
                        type="password" onChange={(e) => HandleChangeValue(wifi_pwd_5, e)} placeholder="Enter Your WiFi password" /></Item>
                <Item><BpCheckbox checked={ap_5.get() == 0 ? false : true} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeBoolean(ap_5, e)} /></Item>
                <Item>
                    <Select
                        value={security_5.get()}
                        onChange={(e) => HandleChangeValue(security_5, e)}
                        sx={{height: "40px", margin: "5px"}}
                        disabled={Disable5G.get()}
                    >
                    {securities.map((security) => (
                        <MenuItem value={security.value}>{security.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
        <Grid xs={4} md={4} >
                <Item></Item>   
            </Grid>
            <Grid xs={4} md={4} sx={{display: {xs: "block", md: "none"}}}>
                <Item>5G</Item>   
            </Grid>
            <Grid xs={4} md={4} sx={{display: {xs: "none", md: "none"}}}>
            <Item><b>5G</b></Item>
            </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" >
            <Grid xs={4} md={4} sx={{textAlign: "center" ,display: {xs: "block", md: "none"},whiteSpace:"nowrap"}}>
                <Item>WiFi Enable</Item>   
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item><Switch checked={wifi_enable_5.get()} sx={{margin: "0 auto"}} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeBoolean(wifi_enable_5, e)} /></Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
            <Grid xs={4} md={4} sx={{textAlign: "center",display: {xs: "block", md: "none"},whiteSpace:"nowrap"}}>
                <Item>WiFi Name</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item><TextFieldSelf value={wifi_name.get()} onChange={(e) => HandleChangeValue(wifi_name, e, "name")} sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"13px", md:"1rem"}}}} placeholder="Enter Your WiFi name"/></Item>
            </Grid>
            {/* <Grid xs={6} md={4}>
                <Item><TextFieldSelf value={wifi_name_5.get()} sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"15px", md:"1rem"}}}} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeValue(wifi_name_5, e)} placeholder="Enter Your WiFi name" inputProps={{maxLength: "50"}}/></Item>
            </Grid> */}
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
            <Grid xs={4} md={4} sx={{textAlign: "center",display: {xs: "block", md: "none"},whiteSpace:"nowrap"}}>
                <Item>Hide WiFi Name</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item><BpCheckbox checked={hide_wifi_name_5.get()} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeBoolean(hide_wifi_name_5, e)} /></Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid xs={4} md={4} sx={{textAlign: "center",display: {xs: "block", md: "none"},whiteSpace:"nowrap"}}>
                <Item>WiFi Password</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item><TextFieldSelf value={wifi_pwd_5.get()} sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"13px", md:"1rem"}}}} disabled={Disable5G.get()}
                        type="password" onChange={(e) => HandleChangeValue(wifi_pwd_5, e)} placeholder="Enter Your WiFi password"  /></Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
            <Grid xs={4} md={4} sx={{textAlign: "center",display: {xs: "block", md: "none"},whiteSpace:"nowrap"}}>
                <Item>AP Isolation</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item><BpCheckbox checked={ap_5.get() == 0 ? false : true} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeBoolean(ap_5, e)} /></Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid xs={4} md={4} sx={{textAlign: "center",display: {xs: "block", md: "none"},whiteSpace:"nowrap"}}>
                <Item>Security Protocol</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item>
                    <Select
                        value={security_5.get()}
                        onChange={(e) => HandleChangeValue(security_5, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                        disabled={Disable5G.get()}
                    >
                    {securities.map((security) => (
                        <MenuItem value={security.value}>{security.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
            </Grid>
        </Grid>
        <Divider textAlign="left" sx={{mt: "30px", display: showHigh.get(),marginTop:"60px"}}><b>Advanced Configuration</b></Divider>  
        
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{display: showHigh.get()}}>
            <Grid xs={4} sx={{textAlign: "center" ,whiteSpace:"nowrap"}}>
                <Item></Item>
                <Item>Wireless Mode</Item>
                <Item>Channel Bandwidth</Item>
                <Item>Channels</Item>
            </Grid>
            <Grid xs={8} md={4}>
                <Item><b>2.4G</b></Item>
                <Item>
                    <Select
                        value={wireless.get()}
                        onChange={(e) => HandleChangeValue(wireless, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                    {wirelessModes.map((wirelessMode) => (
                        <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
                <Item>
                    <Select
                        value={bandwidth.get()}
                        onChange={(e) => HandleChangeValue(bandwidth, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                        <MenuItem value={"20"}>20M</MenuItem>
                        <MenuItem value={"40"}>40M</MenuItem>
                        <MenuItem value={"0"}>Auto</MenuItem>
                    </Select>
                </Item>
                <Item>
                    <Select
                        value={channel.get()}
                        onChange={(e) => HandleChangeValue(channel, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                    {channels.map((channel) => (
                        <MenuItem value={channel.value}>{channel.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
            </Grid>
            <Grid xs={4} sx={{display: {xs: "none", md: "block"}}}>
                <Item><b>5G</b></Item>
                <Item>
                    <Select
                        value={wireless_5.get()}
                        onChange={(e) => HandleChangeValue(wireless_5, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                    {wirelessModes.map((wirelessMode) => (
                        <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
                <Item>
                    <Select
                        value={bandwidth_5.get()}
                        onChange={(e) => HandleChangeValue(bandwidth_5, e)}
                        sx={{height: "40px", margin: "5px" ,fontSize: {xs:"5px", md:"1rem"}}}
                    >
                        <MenuItem value={"20"}>20M</MenuItem>
                        <MenuItem value={"40"}>40M</MenuItem>
                        <MenuItem value={"80"}>80M</MenuItem>
                        <MenuItem value={"160"}>160M</MenuItem>
                        <MenuItem value={"0"}>Auto</MenuItem>
                    </Select>
                </Item>
                <Item>
                    <Select
                        value={channel_5.get()}
                        onChange={(e) => HandleChangeValue(channel_5, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                    {channels2.map((channel) => (
                        <MenuItem value={channel.value}>{channel.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
            </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{display: showHigh.get()}}>
        <Grid xs={4} md={4} >
                <Item></Item>   
            </Grid>
            <Grid xs={4} md={4} sx={{display: {xs: "block", md: "none"}}}>
                <Item>5G</Item>   
            </Grid>
            <Grid xs={4} md={4} sx={{display: {xs: "none", md: "none"}}}>
            <Item><b>5G</b></Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{display: showHigh.get()}}>
            <Grid  xs={4} md={4} sx={{textAlign: "center",whiteSpace:"nowrap",display: {xs: "block", md: "none"}}}>
                <Item>Wireless Mode</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item>
                    <Select
                        value={wireless_5.get()}
                        onChange={(e) => HandleChangeValue(wireless_5, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                    {wirelessModes.map((wirelessMode) => (
                        <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{display: showHigh.get()}}>
            <Grid  xs={4} md={4} sx={{textAlign: "center",whiteSpace:"nowrap",display: {xs: "block", md: "none"}}}>
                <Item>Channel Bandwidth</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item>
                    <Select
                        value={bandwidth_5.get()}
                        onChange={(e) => HandleChangeValue(bandwidth_5, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem",whiteSpace:"nowrap"}}}
                    >
                        <MenuItem value={"20"}>20M</MenuItem>
                        <MenuItem value={"40"}>40M</MenuItem>
                        <MenuItem value={"80"}>80M</MenuItem>
                        <MenuItem value={"160"}>160M</MenuItem>
                        <MenuItem value={"0"}>Auto</MenuItem>
                    </Select>
                </Item>
            </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{display: showHigh.get()}}>
            <Grid  xs={4} md={4} sx={{textAlign: "center",whiteSpace:"nowrap",display: {xs: "block", md: "none"}}}>
                <Item>Channels</Item>
            </Grid>
            <Grid xs={8} md={7} sx={{display: {xs: "block", md: "none"}}}>
                <Item>
                    <Select
                        value={channel_5.get()}
                        onChange={(e) => HandleChangeValue(channel_5, e)}
                        sx={{height: "40px", margin: "5px",fontSize: {xs:"5px", md:"1rem"}}}
                    >
                    {channels2.map((channel) => (
                        <MenuItem value={channel.value}>{channel.name}</MenuItem>
                    ))}
                    </Select>
                </Item>
            </Grid>
        </Grid>
        <Grid container sx={{mt:"15px"}}>
            <Grid xs={12} md={12} sx={{textAlign: "center",marginTop:"30px"}} >
                <Button variant="contained">Save</Button>
            </Grid>
        </Grid> 
    </Stack>

  ))
}