import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { Define, fetching, FormBuilder, webcmd } from './utils';
import { CheckCircle, Done } from '@mui/icons-material';

function BpCheckbox(props) {
  return (
    <FormControlLabel label={props.label} control={<Checkbox sx={{ '&:hover': { bgcolor: 'transparent' }, }} disableRipple {...props} />}
    />
  );
}

function Item(props) {
  const { children, ...other } = props;
  return (
    <Stack justifyContent={`center`} sx={{ height: { md: "60px", xs: "40px" }, lineHeight: { md: "60px", xs: "40px" } }} {...other} >
      {children}
    </Stack>
  );
}

function TextFieldSelf(props) {
  return (
    <TextField label="" variant="outlined" sx={{ py: "5px" }} size="small" {...props} />
  );
}

export default function SetWiFi() {
  /*********constants**********/
  //定义动态变量
  const showHigh = Define("flex");
  const commonCheck = Define(true), show5GCheck = Define(true), Disable5G = Define(true);
  const wifi_enable = Define(true), wifi_enable_5 = Define(true);
  const wifi_name = Define(""), wifi_name_5 = Define("");
  const hide_wifi_name = Define(true), hide_wifi_name_5 = Define(true);
  const wifi_pwd = Define(""), wifi_pwd_5 = Define("");
  const ap = Define(true), ap_5 = Define(true);
  const security = Define("WPA2PSK"), security_5 = Define("WPA2PSK");
  const wireless = Define("1"), wireless_5 = Define("0");
  const bandwidth = Define("20"), bandwidth_5 = Define("20");
  const channel = Define("1"), channel_5 = Define("0");

  const securities = [
    { value: "WPAPSKWPA2PSK", name: "WPAPSK / WPA2PSK" },
    { value: "WPA2PSK", name: "WPA2PSK" },
    { value: "WPA2PSKWPA3PSK", name: "WPA2PSK / WPA3PSK" },
    { value: "WPA3PSK", name: "WPA3PSK" }
  ]
  const wirelessModes_24G = [
    { value: "1", name: "B only" },
    { value: "4", name: "G only" },
    { value: "9", name: "B/G/GN mode" },
    { value: "16", name: "HE_2G mode" },
  ]
  const wirelessModes_5G = [
    { value: "0", name: "B/G mixed" },
    { value: "2", name: "A only" },
    { value: "8", name: "A/N in 5 band" },
    { value: "14", name: "A/AC/AN mixed" },
    { value: "15", name: "AC/AN mixed" },
    { value: "17", name: "HE_5G mode" },
  ]
  const channels_24G = [
    { value: 0, name: "Channel 0 (Auto)" },
    { value: 1, name: "Channel 1" },
    { value: 2, name: "Channel 2" },
    { value: 3, name: "Channel 3" },
    { value: 4, name: "Channel 4" },
    { value: 5, name: "Channel 5" },
    { value: 6, name: "Channel 6" },
    { value: 7, name: "Channel 7" },
    { value: 8, name: "Channel 8" },
    { value: 9, name: "Channel 9" },
    { value: 10, name: "Channel 10" },
    { value: 11, name: "Channel 11" },
    { value: 12, name: "Channel 12" },
    { value: 13, name: "Channel 13" }
  ]
  const channels_5G = [
    { value: 0, name: "Channel 0 (Auto)" },
    { value: 36, name: "Channel 36 (5.180GHz)" },
    { value: 40, name: "Channel 40 (5.200GHz)" },
    { value: 44, name: "Channel 44 (5.220GHz)" },
    { value: 48, name: "Channel 48 (5.240GHz)" },
    { value: 52, name: "Channel 52 (5.260GHz)" },
    { value: 56, name: "Channel 56 (5.280GHz)" },
    { value: 60, name: "Channel 60 (5.300GHz)" },
    { value: 64, name: "Channel 64 (5.320GHz)" }
  ]

  const HandleChangeValue = (dom, event, key) => {
    dom.set(event.target.value); //输入框、选择框等
    if (key && commonCheck.get()) {
      switch (key) {
        case "name": wifi_name_5.set(event.target.value); break;
        case "pwd": wifi_pwd_5.set(event.target.value); break;
        case "security": security_5.set(event.target.value); break;
      }
    }
  };

  const HandleChangeBoolean = (dom, event, key) => {
    dom.set(event.target.checked); //滑动按钮、勾选框等
    if (key && commonCheck.get()) {
      switch (key) {
        case "enable": wifi_enable_5.set(event.target.checked); break;
        case "hide": hide_wifi_name_5.set(event.target.checked); break;
        case "ap": ap_5.set(event.target.checked); break;
      }
    }
  };

  const Synchronize = (event) => {
    //同步2.4G与5G
    commonCheck.set(event.target.checked);
    Disable5G.set(event.target.checked ? true : false);
    if (event.target.checked === false)
      return
    wifi_enable_5.set(wifi_enable.get());
    hide_wifi_name_5.set(hide_wifi_name.get());
    wifi_name_5.set(wifi_name.get());
    wifi_pwd_5.set(wifi_pwd.get());
    ap_5.set(ap.get());
    security_5.set(security.get());
  };

  const ShowOrHide5G = (event) => {
    //显示高级设置
    show5GCheck.set(event.target.checked);
    showHigh.set(event.target.checked ? "flex" : "none");
  }

  /*********createEffect**********/
  createEffect(async () => {

    await webcmd(`wifi.setting.get`).then(v => {
      const res = v.data
      security.set(res['2g'].authMode)
      bandwidth.set(res['2g'].bandwidth)
      channel.set(res['2g'].channel)
      wifi_enable.set(res['2g'].enable)
      hide_wifi_name.set(res['2g'].hideName)
      ap.set(res['2g'].isolation)
      wifi_name.set(res['2g'].name)
      wifi_pwd.set(res['2g'].password)
      wireless.set(res['2g'].wirelessMode)

      security_5.set(res['5g'].authMode)
      bandwidth_5.set(res['5g'].bandwidth)
      channel_5.set(res['5g'].channel)
      wifi_enable_5.set(res['5g'].enable)
      hide_wifi_name_5.set(res['5g'].hideName)
      ap_5.set(res['5g'].isolation)
      wifi_name_5.set(res['5g'].name)
      wifi_pwd_5.set(res['5g'].password)
      wireless_5.set(res['5g'].wirelessMode)
    })

    // await fetching_get_wifi_setting();
  })

  /*********functions**********/
  const onSubmit = async () => {
    const form = {
      "2g": {
        authMode: security.get(),
        bandwidth: bandwidth.get(),
        channel: channel.get(),
        enable: wifi_enable.get(),
        hideName: hide_wifi_name.get(),
        isolation: ap.get(),
        name: wifi_name.get(),
        password: wifi_pwd.get(),
        wirelessMode: wireless.get(),
      },
      "5g": {
        authMode: security_5.get(),
        bandwidth: bandwidth_5.get(),
        channel: channel_5.get(),
        enable: wifi_enable_5.get(),
        hideName: hide_wifi_name_5.get(),
        isolation: ap_5.get(),
        name: wifi_name_5.get(),
        password: wifi_pwd_5.get(),
        wirelessMode: wireless_5.get(),
      },
    }
    // return console.log(form)
    const result = await webcmd(`wifi.setting.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
  }

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (
    <Stack>

      <Grid container spacing={2}>
        <Grid sx={{ textAlign: "left" }}>
          <FormGroup>
            <FormControlLabel checked={commonCheck.get()} control={<Checkbox disableRipple />}
              onChange={(e) => Synchronize(e)} label="Synchronous 2.4 and 5G common configuration" />
            <FormControlLabel checked={show5GCheck.get()} control={<Checkbox disableRipple />}
              onChange={(e) => ShowOrHide5G(e)} label="Show advanced options" />
          </FormGroup>
        </Grid>
      </Grid>
      {/* Title */}

      <Divider textAlign="left" sx={{ mt: 6 }}>
        <Typography variant="h6">
          <b>Common Configuration</b>
        </Typography>
      </Divider>

      <Box px={10}>
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
          <Grid xs={4} md={4} >
            <Item></Item>
          </Grid>
          <Grid xs={4} md={4} >
            <Item><b>2.4G</b></Item>
          </Grid>
          <Grid xs={4} md={4} sx={{ display: { xs: "none", md: "block" } }}>
            <Item><b>5G</b></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid xs={4} sx={{ textAlign: "left", whiteSpace: "nowrap" }}>
            <Item>WiFi Enable</Item>
            <Item>WiFi Name</Item>
            <Item>Hide WiFi Name</Item>
            <Item>WiFi Password</Item>
            <Item>AP Isolation</Item>
            <Item>Security Protocol</Item>
          </Grid>
          <Grid xs={8} md={4} sx={{ textAlign: "left", "& input": { fontSize: { xs: "13px", md: "1rem" } } }}>
            <Item><Switch sx={{ margin: "0 auto" }} checked={wifi_enable.get()} onChange={(e) => HandleChangeBoolean(wifi_enable, e, "enable")} /></Item>
            <Item><TextFieldSelf value={wifi_name.get()} onChange={(e) => HandleChangeValue(wifi_name, e, "name")} placeholder="Enter Your WiFi name" /></Item>
            <Item><BpCheckbox label="Enable" checked={hide_wifi_name.get()} onChange={(e) => HandleChangeBoolean(hide_wifi_name, e, "hide")} /></Item>
            <Item><TextFieldSelf value={wifi_pwd.get()} type="password" onChange={(e) => HandleChangeValue(wifi_pwd, e, "pwd")} placeholder="Enter Your WiFi password" /></Item>
            <Item><BpCheckbox label="Enable" checked={ap.get()} onChange={(e) => HandleChangeBoolean(ap, e, "ap")} /></Item>
            <Item>
              <Select size="small"
                value={security.get()}
                onChange={(e) => HandleChangeValue(security, e, "security")}
              >
                {securities.map((sec) => (
                  <MenuItem value={sec.value}>{sec.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
          <Grid xs={4} sx={{ textAlign: "left", display: { xs: "none", md: "block" } }}>
            <Item><Switch checked={wifi_enable_5.get()} sx={{ margin: "0 auto", "& input": { fontSize: { xs: "13px", md: "1rem" } } }} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeBoolean(wifi_enable_5, e)} /></Item>
            <Item><TextFieldSelf value={wifi_name_5.get()} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeValue(wifi_name_5, e)} placeholder="Enter Your WiFi name" inputProps={{ maxLength: "50" }} /></Item>
            <Item><BpCheckbox label="Enable" checked={hide_wifi_name_5.get()} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeBoolean(hide_wifi_name_5, e)} /></Item>
            <Item><TextFieldSelf value={wifi_pwd_5.get()} disabled={Disable5G.get()}
              type="password" onChange={(e) => HandleChangeValue(wifi_pwd_5, e)} placeholder="Enter Your WiFi password" /></Item>
            <Item><BpCheckbox label="Enable" checked={ap_5.get() == 0 ? false : true} disabled={Disable5G.get()} onChange={(e) => HandleChangeBoolean(ap_5, e)} /></Item>
            <Item>
              <Select size="small"
                value={security_5.get()}
                onChange={(e) => HandleChangeValue(security_5, e)}
                disabled={Disable5G.get()}
              >
                {securities.map((security) => (
                  <MenuItem value={security.value}>{security.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>
      </Box>

      {/* This is from chenyan start */}
      <Stack display={`none`}>
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
          <Grid xs={4} md={4} >
            <Item></Item>
          </Grid>
          <Grid xs={4} md={4} sx={{ display: { xs: "block", md: "none" } }}>
            <Item>5G</Item>
          </Grid>
          <Grid xs={4} md={4} sx={{ display: { xs: "none", md: "none" } }}>
            <Item><b>5G</b></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" >
          <Grid xs={4} md={4} sx={{ textAlign: "left", display: { xs: "block", md: "none" }, whiteSpace: "nowrap" }}>
            <Item>WiFi Enable</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item><Switch checked={wifi_enable_5.get()} sx={{ margin: "0 auto" }} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeBoolean(wifi_enable_5, e)} /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" >
          <Grid xs={4} md={4} sx={{ textAlign: "left", display: { xs: "block", md: "none" }, whiteSpace: "nowrap" }}>
            <Item>WiFi Name</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item><TextFieldSelf value={wifi_name.get()} onChange={(e) => HandleChangeValue(wifi_name, e, "name")} sx={{ height: "30px", padding: "5px", "& input": { fontSize: { xs: "13px", md: "1rem" } } }} placeholder="Enter Your WiFi name" /></Item>
          </Grid>
          {/* <Grid xs={6} md={4}>
                <Item><TextFieldSelf value={wifi_name_5.get()} sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"15px", md:"1rem"}}}} disabled={Disable5G.get()}
                        onChange={(e) => HandleChangeValue(wifi_name_5, e)} placeholder="Enter Your WiFi name" inputProps={{maxLength: "50"}}/></Item>
            </Grid> */}
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" >
          <Grid xs={4} md={4} sx={{ textAlign: "left", display: { xs: "block", md: "none" }, whiteSpace: "nowrap" }}>
            <Item>Hide WiFi Name</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item><BpCheckbox label="Enable" checked={hide_wifi_name_5.get()} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeBoolean(hide_wifi_name_5, e)} /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid xs={4} md={4} sx={{ textAlign: "left", display: { xs: "block", md: "none" }, whiteSpace: "nowrap" }}>
            <Item>WiFi Password</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item><TextFieldSelf value={wifi_pwd_5.get()} sx={{ height: "30px", padding: "5px", "& input": { fontSize: { xs: "13px", md: "1rem" } } }} disabled={Disable5G.get()}
              type="password" onChange={(e) => HandleChangeValue(wifi_pwd_5, e)} placeholder="Enter Your WiFi password" /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" >
          <Grid xs={4} md={4} sx={{ textAlign: "left", display: { xs: "block", md: "none" }, whiteSpace: "nowrap" }}>
            <Item>AP Isolation</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item><BpCheckbox label="Enable" checked={ap_5.get() == 0 ? false : true} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeBoolean(ap_5, e)} /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid xs={4} md={4} sx={{ textAlign: "left", display: { xs: "block", md: "none" }, whiteSpace: "nowrap" }}>
            <Item>Security Protocol</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item>
              <Select size="small"
                value={security_5.get()}
                onChange={(e) => HandleChangeValue(security_5, e)}
                disabled={Disable5G.get()}
              >
                {securities.map((security) => (
                  <MenuItem value={security.value}>{security.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>
      </Stack>
      {/* This is from chenyan end */}

      <Divider textAlign="left" sx={{ mt: 6, display: showHigh.get() }}>
        <Typography variant="h6">
          <b>Advanced Configuration</b>
        </Typography>
      </Divider>

      <Box px={10}>
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ display: showHigh.get() }}>
          <Grid xs={4} sx={{ textAlign: "left", whiteSpace: "nowrap" }}>
            <Item></Item>
            <Item>Wireless Mode</Item>
            <Item>Channel Bandwidth</Item>
            <Item>Channels</Item>
          </Grid>
          <Grid xs={8} md={4} sx={{ textAlign: "left", whiteSpace: "nowrap" }}>
            <Item><b>2.4G</b></Item>
            <Item>
              <Select size="small"
                value={wireless.get()}
                onChange={(e) => HandleChangeValue(wireless, e)}
              >
                {wirelessModes_24G.map((wirelessMode) => (
                  <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
                ))}
              </Select>
            </Item>
            <Item>
              <Select size="small"
                value={bandwidth.get()}
                onChange={(e) => HandleChangeValue(bandwidth, e)}
              >
                <MenuItem value={"0"}>Auto</MenuItem>
                <MenuItem value={"20"}>20M</MenuItem>
                <MenuItem value={"40"}>40M</MenuItem>
                <MenuItem value={"60"}>40M</MenuItem>
              </Select>
            </Item>
            <Item>
              <Select size="small"
                value={channel.get()}
                onChange={(e) => HandleChangeValue(channel, e)}
              >
                {channels_24G.map((channel) => (
                  <MenuItem value={channel.value}>{channel.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
          <Grid xs={4} sx={{ textAlign: "left", whiteSpace: "nowrap", display: { xs: "none", md: "block" } }}>
            <Item><b>5G</b></Item>
            <Item>
              <Select size="small"
                value={wireless_5.get()}
                onChange={(e) => HandleChangeValue(wireless_5, e)}
              >
                {wirelessModes_5G.map((wirelessMode) => (
                  <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
                ))}
              </Select>
            </Item>
            <Item>
              <Select size="small"
                value={bandwidth_5.get()}
                onChange={(e) => HandleChangeValue(bandwidth_5, e)}
              >
                <MenuItem value={"0"}>Auto</MenuItem>
                <MenuItem value={"20"}>20M</MenuItem>
                <MenuItem value={"40"}>40M</MenuItem>
                <MenuItem value={"80"}>80M</MenuItem>
                <MenuItem value={"160"}>160M</MenuItem>
              </Select>
            </Item>
            <Item>
              <Select size="small"
                value={channel_5.get()}
                onChange={(e) => HandleChangeValue(channel_5, e)}
              >
                {channels_5G.map((channel) => (
                  <MenuItem value={channel.value}>{channel.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>
      </Box>

      {/* This is from chenyan start */}
      <Stack display={`none`}>
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ display: showHigh.get() }}>
          <Grid xs={4} md={4} >
            <Item></Item>
          </Grid>
          <Grid xs={4} md={4} sx={{ display: { xs: "block", md: "none" } }}>
            <Item>5G</Item>
          </Grid>
          <Grid xs={4} md={4} sx={{ display: { xs: "none", md: "none" } }}>
            <Item><b>5G</b></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ display: showHigh.get() }}>
          <Grid xs={4} md={4} sx={{ textAlign: "left", whiteSpace: "nowrap", display: { xs: "block", md: "none" } }}>
            <Item>Wireless Mode</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item>
              <Select size="small"
                value={wireless_5.get()}
                onChange={(e) => HandleChangeValue(wireless_5, e)}
              >
                {wirelessModes_24G.map((wirelessMode) => (
                  <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ display: showHigh.get() }}>
          <Grid xs={4} md={4} sx={{ textAlign: "left", whiteSpace: "nowrap", display: { xs: "block", md: "none" } }}>
            <Item>Channel Bandwidth</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item>
              <Select size="small"
                value={bandwidth_5.get()}
                onChange={(e) => HandleChangeValue(bandwidth_5, e)}
                sx={{ height: "40px", margin: "5px", fontSize: { xs: "5px", md: "1rem", } }}
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

        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ display: showHigh.get() }}>
          <Grid xs={4} md={4} sx={{ textAlign: "left", whiteSpace: "nowrap", display: { xs: "block", md: "none" } }}>
            <Item>Channels</Item>
          </Grid>
          <Grid xs={8} md={7} sx={{ display: { xs: "block", md: "none" } }}>
            <Item>
              <Select
                value={channel_5.get()}
                onChange={(e) => HandleChangeValue(channel_5, e)}
                sx={{ height: "40px", margin: "5px", fontSize: { xs: "5px", md: "1rem" } }}
              >
                {channels_5G.map((channel) => (
                  <MenuItem value={channel.value}>{channel.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>
      </Stack>
      {/* This is from chenyan end */}

      <Box px={20} py={6}>
        <Button onClick={onSubmit} fullWidth color="error" startIcon={<CheckCircle />} variant="contained">Save</Button>
      </Box>

    </Stack>

  ))
}
