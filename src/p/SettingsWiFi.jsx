import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { boolToInt, Define, fetching, FormBuilder, webcmd } from './utils';
import { CheckCircle, Done, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { display } from '@mui/system';
import HelpPopover from './c/HelpPopover';

function BpCheckbox(props) {
  return (
    <FormControlLabel label={props.label} control={<Checkbox sx={{ '&:hover': { bgcolor: 'transparent' }, }} size="small" {...props} />}
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
  const syncConfigures = Define(true), showAdvances = Define(true), Disable5G = Define(true);

  const wifi_enable = Define(true), wifi_enable_5 = Define(true);
  const wifi_name = Define(""), wifi_name_5 = Define("");
  const hide_wifi_name = Define(true), hide_wifi_name_5 = Define(true);
  const wifi_pwd = Define(""), wifi_pwd_5 = Define("");
  const ap = Define(true), ap_5 = Define(true);
  const security = Define("WPA2PSK"), security_5 = Define("WPA2PSK");

  const wireless = Define("1"), wireless_5 = Define("0");
  const bandwidth = Define(0), bandwidth_5 = Define(0);
  const channel = Define("1"), channel_5 = Define("0");

  const showPassword = Define(false), showPassword_5 = Define(false);

  const securities = [
    { value: "WPAPSKWPA2PSK", name: "WPAPSK / WPA2PSK" },
    { value: "WPA2PSK", name: "WPA2PSK" },
    { value: "WPA2PSKWPA3PSK", name: "WPA2PSK / WPA3PSK" },
    { value: "WPA3PSK", name: "WPA3PSK" }
  ]
  const wirelessModes_24G = [
    { value: 1, name: "B only" },
    { value: 4, name: "G only" },
    { value: 9, name: "B/G/GN mode" },
    { value: 16, name: "B/G/GN/AX mode" },
  ]
  const wirelessModes_5G = [
    { value: 0, name: "B/G mixed" },
    { value: 2, name: "A only" },
    { value: 8, name: "A/N in 5 band" },
    { value: 14, name: "A/AC/AN mixed" },
    { value: 15, name: "AC/AN mixed" },
    { value: 17, name: "AC/AN/AX mode" },
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

  const HandleChangeValue = (element, event, key) => {
    element.set(event.target.value); //输入框、选择框等
    if (key && syncConfigures.get()) {
      switch (key) {
        case "name": wifi_name_5.set(event.target.value); break;
        case "pwd": wifi_pwd_5.set(event.target.value); break;
        case "security": security_5.set(event.target.value); break;
      }
    }
  };

  const HandleChangeBoolean = (element, event, key) => {
    element.set(event.target.checked); //滑动按钮、勾选框等
    if (key && syncConfigures.get()) {
      switch (key) {
        case "enable": wifi_enable_5.set(event.target.checked); break;
        case "hide": hide_wifi_name_5.set(event.target.checked); break;
        case "ap": ap_5.set(event.target.checked); break;
      }
    }
  };

  const Synchronize = (event) => {
    //同步2.4G与5G
    syncConfigures.set(event.target.checked);
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
    showAdvances.set(event.target.checked);
  }

  /*********createEffect**********/
  createEffect(async () => {

    await webcmd(`wifi.setting.get`).then(v => {
      const res = v.data

      wifi_enable.set(boolToInt(res['2g'].enable))
      hide_wifi_name.set(boolToInt(res['2g'].hideName))
      ap.set(boolToInt(res['2g'].isolation))
      wifi_name.set(res['2g'].name)
      wifi_pwd.set(res['2g'].password)
      wireless.set(res['2g'].wirelessMode)
      security.set(res['2g'].authMode)
      bandwidth.set(res['2g'].bandwidth)
      channel.set(res['2g'].channel)

      wifi_enable_5.set(boolToInt(res['5g'].enable))
      hide_wifi_name_5.set(boolToInt(res['5g'].hideName))
      ap_5.set(boolToInt(res['5g'].isolation))
      wifi_name_5.set(res['5g'].name)
      wifi_pwd_5.set(res['5g'].password)
      wireless_5.set(res['5g'].wirelessMode)
      security_5.set(res['5g'].authMode)
      bandwidth_5.set(res['5g'].bandwidth)
      channel_5.set(res['5g'].channel)
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
        enable: boolToInt(wifi_enable.get()),
        hideName: boolToInt(hide_wifi_name.get()),
        isolation: boolToInt(ap.get()),
        name: wifi_name.get(),
        password: wifi_pwd.get(),
        wirelessMode: wireless.get(),
      },
      "5g": {
        authMode: security_5.get(),
        bandwidth: bandwidth_5.get(),
        channel: channel_5.get(),
        enable: boolToInt(wifi_enable_5.get()),
        hideName: boolToInt(hide_wifi_name_5.get()),
        isolation: boolToInt(ap_5.get()),
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
  return useObserver(() => (<Stack>

    {/* PC WiFi global Configuration */}
    <Grid container spacing={2} sx={{ display: { xs: "none", md: "block" }, my: { xs: '1rem', md: '1rem' } }}>
      <Grid sx={{ textAlign: "left" }}>
        <FormGroup>
          <BpCheckbox checked={syncConfigures.get()} control={<Checkbox disableRipple />}
            onChange={(e) => Synchronize(e)} label="Synchronous 2.4 and 5G common configuration" />
          <BpCheckbox checked={showAdvances.get()} control={<Checkbox disableRipple />}
            onChange={(e) => ShowOrHide5G(e)} label="Show advanced options" />
        </FormGroup>
      </Grid>
    </Grid>

    {/* PC WiFi 2.4G + 5G base Configuration title */}
    <Divider textAlign="left" sx={{ display: { xs: "none", md: "flex" }, my: { md: '3rem' } }}>
      <Typography variant="h6">
        <b>Common Configuration</b>
      </Typography>
    </Divider>

    {/* PC WiFi 2.4G + 5G Base Configuration */}
    <Box display={{ xs: "none", md: "block" }} px={{ md: "4rem" }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center" >
        <Grid xs={4} md={4} >
          <Item></Item>
        </Grid>
        <Grid xs={4} md={4} >
          <Item>
            <Typography textAlign="center" variant="subtitle1" color='text.secondary'>
              <b>2.4G</b>
            </Typography>
          </Item>
        </Grid>
        <Grid xs={4} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <Item>
            <Typography textAlign="center" variant="subtitle1" color='text.secondary'>
              <b>5G</b>
            </Typography>
          </Item>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid xs={4} sx={{ textAlign: "left", whiteSpace: "nowrap" }}>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`WiFi ON`}
              <HelpPopover>
                {`Check this box to open Wi-Fi, uncheck to disable`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`WiFi Name`}
              <HelpPopover>
                {`The SSID can be any alphanumeric, case-sensitive entry from 2 to 32 characters.
                The printable characters plus the space (ASCII 0x20) are allowed.`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`Hide WiFi`}
              <HelpPopover>
                {`Check this box to hide WiFi name, do not broadcast`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`WiFi Password`}
              <HelpPopover>
                {`The device will accept passwords no less than 8 characters in length, and no more than 32 characters in length.`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`AP Isolation`}
              <HelpPopover>
                {`Completely block wireless client-to-client traffic. 
                Even broadcasts don't go from one wireless client to another.`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`Security Protocol`}
              <HelpPopover>
                {`When choosing from among WEP, WPA, WPA2 and WPA3 wireless security protocols, experts agree WPA3 is best for Wi-Fi security. 
                As the most up-to-date wireless encryption protocol, WPA3 is the most secure choice. 
                Some wireless APs do not support WPA3, the next best option is WPA2, which is widely deployed in the enterprise space today.`}
              </HelpPopover>
            </Typography>
          </Item>
        </Grid>
        <Grid xs={8} md={4} sx={{ textAlign: "left", "& input": { fontSize: { xs: "13px", md: "1rem" } } }}>
          <Item>
            <BpCheckbox label="Enable" checked={wifi_enable.get()} onChange={(e) => HandleChangeBoolean(wifi_enable, e, "enable")} />
            {/* <TextField size="small" label="WiFi Enable" value={wifi_enable.get()} helperText="This is helperText" fullWidth /> */}
          </Item>
          <Item>
            <TextFieldSelf value={wifi_name.get()} onChange={(e) => HandleChangeValue(wifi_name, e, "name")} placeholder="Enter Your WiFi name" /></Item>
          <Item>
            <BpCheckbox label="Enable" checked={hide_wifi_name.get()} onChange={(e) => HandleChangeBoolean(hide_wifi_name, e, "hide")} />
          </Item>
          <Item>
            <TextFieldSelf value={wifi_pwd.get()} type={showPassword.get() ? 'text' : 'password'} onChange={(e) => HandleChangeValue(wifi_pwd, e, "pwd")} placeholder="Enter Your WiFi password" InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton onClick={_ => showPassword.set(!showPassword.get())} edge="end" >
                    {showPassword.get() ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                  </IconButton>
                </InputAdornment>
            }} />
          </Item>
          <Item>
            <BpCheckbox label="Enable" checked={ap.get()} onChange={(e) => HandleChangeBoolean(ap, e, "ap")} />
          </Item>
          <Item>
            <Select size="small" value={security.get()} onChange={(e) => HandleChangeValue(security, e, "security")} >
              {securities.map((sec) => (
                <MenuItem value={sec.value}>{sec.name}</MenuItem>
              ))}
            </Select>
          </Item>
        </Grid>
        <Grid xs={4} sx={{ textAlign: "left", display: { xs: "none", md: "block" } }}>
          <Item>
            <BpCheckbox label="Enable" checked={wifi_enable_5.get()} onChange={(e) => HandleChangeBoolean(wifi_enable_5, e, "enable")} disabled={Disable5G.get()} />
          </Item>
          <Item>
            <TextFieldSelf value={wifi_name_5.get()} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeValue(wifi_name_5, e)} placeholder="Enter Your WiFi name" inputProps={{ maxLength: "50" }} />
          </Item>
          <Item>
            <BpCheckbox label="Enable" checked={hide_wifi_name_5.get()} disabled={Disable5G.get()}
              onChange={(e) => HandleChangeBoolean(hide_wifi_name_5, e)} />
          </Item>
          <Item>
            <TextFieldSelf value={wifi_pwd_5.get()} disabled={Disable5G.get()}
              type={showPassword_5.get() ? 'text' : 'password'} onChange={(e) => HandleChangeValue(wifi_pwd_5, e)} placeholder="Enter Your WiFi password" InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton onClick={_ => showPassword_5.set(!showPassword_5.get())} edge="end" >
                      {showPassword_5.get() ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                    </IconButton>
                  </InputAdornment>
              }} />
          </Item>
          <Item>
            <BpCheckbox label="Enable" checked={ap_5.get() == 0 ? false : true} disabled={Disable5G.get()} onChange={(e) => HandleChangeBoolean(ap_5, e)} />
          </Item>
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

    {/* PC WiFi 2.4G + 5G Advanced Configuration title */}
    <Divider textAlign="left" sx={{ my: { md: '3rem' }, display: { xs: "none", md: showAdvances.get() ? "flex" : "none" } }}>
      <Typography variant="h6">
        <b>Advanced Configuration</b>
      </Typography>
    </Divider >

    {/* PC WiFi 2.4G + 5G Advanced Configuration */}
    <Box px={{ md: "4rem" }} sx={{ display: { xs: "none", md: showAdvances.get() ? "block" : "none" } }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid xs={4} sx={{ textAlign: "left", whiteSpace: "nowrap" }}>
          <Item></Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`Wireless Mode`}
              <HelpPopover>
                {`Please make sure that your device supports the same version.
                A higher version is usually backward compatible with a lower version of the mode`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`Channel Bandwidth`}
              <HelpPopover>
                {`The channel bandwidth of a wireless signal determines that signal's data rate.
                At the same distance, the higher the channel bandwidth, the faster the connection.`}
              </HelpPopover>
            </Typography>
          </Item>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              {`Channels`}
              <HelpPopover>
                {`Channel 0 indicates automatic calculation using the channel algorithm built in the device.
                Then the channel selected with the highest efficiency at present is obtained.`}
              </HelpPopover>
            </Typography>
          </Item>
        </Grid>
        <Grid xs={8} md={4} sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              <b>2.4G</b>
            </Typography>
          </Item>
          <Item>
            <Select size="small" value={wireless.get()} onChange={(e) => HandleChangeValue(wireless, e)}>
              {wirelessModes_24G.map((wirelessMode) => (
                <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
              ))}
            </Select>
          </Item>
          <Item>
            <Select size="small" value={bandwidth.get()} onChange={(e) => HandleChangeValue(bandwidth, e)}>
              <MenuItem value={0}>Auto</MenuItem>
              <MenuItem value={20}>20M</MenuItem>
              <MenuItem value={40}>40M</MenuItem>
              <MenuItem value={60}>60M</MenuItem>
            </Select>
          </Item>
          <Item>
            <Select size="small" value={channel.get()} onChange={(e) => HandleChangeValue(channel, e)}>
              {channels_24G.map((channel) => (
                <MenuItem value={channel.value}>{channel.name}</MenuItem>
              ))}
            </Select>
          </Item>
        </Grid>
        <Grid xs={4} sx={{ textAlign: "center", whiteSpace: "nowrap", display: { xs: "none", md: "block" } }}>
          <Item>
            <Typography variant="subtitle1" color='text.secondary'>
              <b>5G</b>
            </Typography>
          </Item>
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
              <MenuItem value={0}>Auto</MenuItem>
              <MenuItem value={20}>20M</MenuItem>
              <MenuItem value={40}>40M</MenuItem>
              <MenuItem value={80}>80M</MenuItem>
              <MenuItem value={160}>160M</MenuItem>
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

    {/* mobile WiFi global Configuration */}
    <Paper variant="outlined" elevation={0} sx={{ my: '1rem', display: { md: "none" }, position: "sticky", top: 0, zIndex: "9999" }}>
      <List dense disablePadding>
        <ListItem >
          <FormControlLabel checked={syncConfigures.get()} control={<Checkbox size="small" />} onChange={(e) => Synchronize(e)} label="Synchronous 2.4 and 5G options" />
        </ListItem>
        <ListItem >
          <FormControlLabel checked={showAdvances.get()} control={<Checkbox size="small" />} onChange={(e) => ShowOrHide5G(e)} label="Show advanced options" />
        </ListItem>
      </List>
    </Paper >

    {/* mobile WiFi 2.4G Base + Advanced Configuration */}
    <Paper variant="outlined" elevation={0} sx={{ display: { md: "none" }, my: '1rem' }}>
      <List>
        <ListSubheader>
          <Typography align="left" variant="caption" component="div">
            {"WiFi 2.4G Base Configuration"}
          </Typography>
        </ListSubheader>
        <ListItem>
          <ListItemText>
            <Divider />
          </ListItemText>
        </ListItem>
        <ListItem>
          <TextField fullWidth label="WiFi Name" variant="outlined" size="small" value={wifi_name.get()} onChange={(e) => HandleChangeValue(wifi_name, e, "name")} />
        </ListItem>
        <ListItem>
          <TextField fullWidth label="WiFi Password" variant="outlined" size="small" value={wifi_pwd.get()} type={showPassword.get() ? 'text' : 'password'} onChange={(e) => HandleChangeValue(wifi_pwd, e, "pwd")} placeholder="Enter Your WiFi password" InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton onClick={_ => showPassword.set(!showPassword.get())} edge="end" >
                  {showPassword.get() ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                </IconButton>
              </InputAdornment>
          }} />
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Security-Protocol">Security Protocol</InputLabel>
            <Select labelId="select-label-Security-Protocol" label="Security Protocol" variant="outlined" size="small" value={security.get()} onChange={(e) => HandleChangeValue(security, e, "security")} >
              {securities.map((sec) => (
                <MenuItem value={sec.value}>{sec.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <ListItemText primary="Hide WiFi" />
          <BpCheckbox label="Enable" checked={hide_wifi_name.get()} onChange={(e) => HandleChangeBoolean(hide_wifi_name, e, "hide")} />
        </ListItem>
        <ListItem >
          <ListItemText primary="AP Isolation" />
          <BpCheckbox label="Enable" checked={ap.get()} onChange={(e) => HandleChangeBoolean(ap, e, "ap")} />
        </ListItem>
      </List>
      <List sx={{ display: showAdvances.get() ? "block" : "none" }}>
        <ListSubheader>
          <Typography align="left" variant="caption" component="div">
            {"WiFi 2.4G Advanced Configuration"}
          </Typography>
        </ListSubheader>
        <ListItem>
          <ListItemText>
            <Divider />
          </ListItemText>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Wireless-Mode">Wireless Mode</InputLabel>
            <Select labelId="select-label-Wireless-Mode" label="Wireless Mode" variant="outlined" size="small" value={wireless.get()} onChange={(e) => HandleChangeValue(wireless, e)}>
              {wirelessModes_24G.map((wirelessMode) => (
                <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Channel-Bandwidth">Channel Bandwidth</InputLabel>
            <Select labelId="select-label-Channel-Bandwidth" label="Channel Bandwidth" variant="outlined" size="small" value={bandwidth.get()} onChange={(e) => HandleChangeValue(bandwidth, e)}>
              <MenuItem value={0}>Auto</MenuItem>
              <MenuItem value={20}>20M</MenuItem>
              <MenuItem value={40}>40M</MenuItem>
              <MenuItem value={60}>60M</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Channels">Channels</InputLabel>
            <Select labelId="select-label-Channels" label="Channels" variant="outlined" size="small" value={channel.get()} onChange={(e) => HandleChangeValue(channel, e)}>
              {channels_24G.map((channel) => (
                <MenuItem value={channel.value}>{channel.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </Paper>

    {/* mobile WiFi 5G Base + Advanced Configuration */}
    <Paper variant="outlined" elevation={0} sx={{ display: { md: "none" }, my: '1rem' }}>
      <List>
        <ListSubheader>
          <Typography align="left" variant="caption" component="div">
            {"WiFi 5G Base Configuration"}
          </Typography>
        </ListSubheader>
        <ListItem>
          <ListItemText>
            <Divider />
          </ListItemText>
        </ListItem>
        <ListItem>
          <TextField fullWidth label="WiFi Name" variant="outlined" size="small" value={wifi_name_5.get()} disabled={Disable5G.get()} onChange={(e) => HandleChangeValue(wifi_name_5, e)} placeholder="Enter Your WiFi name" inputProps={{ maxLength: "50" }} />
        </ListItem>
        <ListItem>
          <TextField fullWidth label="WiFi Password" variant="outlined" size="small" value={wifi_pwd_5.get()} disabled={Disable5G.get()} type={showPassword_5.get() ? 'text' : 'password'} onChange={(e) => HandleChangeValue(wifi_pwd_5, e)} placeholder="Enter Your WiFi password" InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton onClick={_ => showPassword_5.set(!showPassword_5.get())} edge="end" >
                  {showPassword_5.get() ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                </IconButton>
              </InputAdornment>
          }} />
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Security-Protocol-5">Security Protocol</InputLabel>
            <Select labelId="select-label-Security-Protocol-5" label="Security Protocol" variant="outlined" size="small" value={security_5.get()} onChange={(e) => HandleChangeValue(security_5, e, "security")} disabled={Disable5G.get()} >
              {securities.map((sec) => (
                <MenuItem value={sec.value}>{sec.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <ListItemText primary="Hide WiFi" />
          <BpCheckbox label="Enable" checked={hide_wifi_name_5.get()} disabled={Disable5G.get()} onChange={(e) => HandleChangeBoolean(hide_wifi_name_5, e)} />
        </ListItem>
        <ListItem >
          <ListItemText primary="AP Isolation" />
          <BpCheckbox label="Enable" checked={ap_5.get() == 0 ? false : true} disabled={Disable5G.get()} onChange={(e) => HandleChangeBoolean(ap_5, e)} />
        </ListItem>
      </List>
      <List sx={{ display: showAdvances.get() ? "block" : "none" }}>
        <ListSubheader>
          <Typography align="left" variant="caption" component="div">
            {"WiFi 5G Advanced Configuration"}
          </Typography>
        </ListSubheader>
        <ListItem>
          <ListItemText>
            <Divider />
          </ListItemText>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Wireless-Mode-5">Wireless Mode</InputLabel>
            <Select labelId="select-label-Wireless-Mode-5" label="Wireless Mode" variant="outlined" size="small" value={wireless_5.get()} onChange={(e) => HandleChangeValue(wireless_5, e)}>
              {wirelessModes_5G.map((wirelessMode) => (
                <MenuItem value={wirelessMode.value}>{wirelessMode.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Channel-Bandwidth-5">Channel Bandwidth</InputLabel>
            <Select labelId="select-label-Channel-Bandwidth-5" label="Channel Bandwidth" variant="outlined" size="small" value={bandwidth_5.get()} onChange={(e) => HandleChangeValue(bandwidth_5, e)}>
              <MenuItem value={0}>Auto</MenuItem>
              <MenuItem value={20}>20M</MenuItem>
              <MenuItem value={40}>40M</MenuItem>
              <MenuItem value={80}>80M</MenuItem>
              <MenuItem value={160}>160M</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <FormControl fullWidth>
            <InputLabel id="select-label-Channels-5">Channels</InputLabel>
            <Select labelId="select-label-Channels-5" label="Channels" variant="outlined" size="small" value={channel_5.get()} onChange={(e) => HandleChangeValue(channel_5, e)}>
              {channels_5G.map((channel) => (
                <MenuItem value={channel.value}>{channel.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </Paper>


    {/* PC + mobile WiFi 2.4G + 5G submit button */}
    <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
      <Button onClick={onSubmit} fullWidth color="error" startIcon={<CheckCircle />} variant="contained">Save</Button>
    </Box>

  </Stack >))
}
