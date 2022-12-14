import {
  Divider, Stack, Box, FormGroup, FormControlLabel, Checkbox, TextField, Select,
  MenuItem, Switch, FormControl, RadioGroup, Radio, Chip, Typography, Button
} from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import 'animate.css';
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { bytesToHuman, Define, fetching, rpc as $rpc, secondsToWatch, FormBuilder } from './utils';
import { height } from '@mui/system';
import { CheckCircle } from '@mui/icons-material';

function Item(props) {
  const { children, ...other } = props;
  return (
    <Stack justifyContent={`center`}
      sx={{ height: "50px", lineHeight: "50px", mb: "5px", margin: "0 auto", fontSize: { xs: "15px", md: "1rem" } }}
      {...other}
    >
      {children}
    </Stack>
  );
}
function TextFieldSelf(props) {
  return (
    <TextField label="" variant="outlined" size="small" {...props} />
  );
}


export default function SetSIM() {
  /*********constants**********/
  const modes = [
    { value: "0", name: "3G" },
    { value: "1", name: "4G" },
    { value: "2", name: "5G" },
    { value: "3", name: "4G/5G" },
    { value: "4", name: "3G/4G/5G" },
  ]
  const pdps = [
    { value: "0", name: "IPV4" },
    { value: "1", name: "IPV6" },
    { value: "2", name: "IPv4v6" }
  ]
  //定义动态变量
  const enable = Define(true), roaming = Define(false), dataMode = Define("1");
  const selectMode = Define("auto"), pdp = Define(""), apnName = Define("");
  const authType = Define("0"), username = Define(""), password = Define(""), current = Define("");
  const HandleChangeBoolean = (dom, event) => {
    dom.set(event.target.checked); //滑动按钮、勾选框等
  };
  const HandleChangeValue = (dom, event) => {
    dom.set(event.target.value); //输入框、选择框等
  };

  /*********createEffect**********/
  createEffect(async () => {
    // await fetching_get_wifi_setting();
  })

  /*********functions**********/
  const fetching_get_wifi_setting = async () => {
    return await fetching(FormBuilder({
      "cmd": `internet.setting.sim.get`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      enable.set(res.enable);
      roaming.set(res.roaming);
      dataMode.set(res.dataMode);
    })
  }
  /*********styles**********/

  return useObserver(() => (
    <Stack>

      <Divider textAlign="left" sx={{ my: { md: '3rem' } }}>
        <Typography variant="h6">
          <b>SIM Configuration</b>
        </Typography>
      </Divider>

      <Box px={'4rem'}>
        <Grid container spacing={2}>
          <Grid xs={4} md={3} sx={{ textAlign: "left" }}>
            <Item>Network</Item>
            <Item>Roaming</Item>
            <Item>DataMode</Item>
          </Grid>
          <Grid xs={4} md={6} sx={{ textAlign: "left" }}>
            <Item><Switch checked={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} /></Item>
            <Item><Switch checked={roaming.get()} onChange={(e) => HandleChangeBoolean(roaming, e)} /></Item>
            <Item>
              <Select size="small" value={dataMode.get()} onChange={(e) => HandleChangeValue(dataMode, e)} >
                {modes.map((mode) => (
                  <MenuItem value={mode.value}>{mode.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>
      </Box>

      <Divider textAlign="left" sx={{ my: { md: '3rem' } }}>        <Typography variant="h6">
        <b>APN Configuration</b>
      </Typography>
      </Divider>

      <Box px={'4rem'}>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>Current APN</Item>
          </Grid>
          <Grid xs={12} md={6}><Item>
            <TextFieldSelf value={current.get()} onChange={(e) => HandleChangeValue(current, e)} /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}><Item>APN Select Mode</Item></Grid>
          <Grid xs={12} md={6}>
            <Item>
              <FormControl md={{ paddingLeft: "9px" }} xs={{ paddingLeft: "0px" }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectMode.get()}
                  onChange={(e) => HandleChangeValue(selectMode, e)}
                >
                  <FormControlLabel value="auto" control={<Radio />} label="Auto" />
                  <FormControlLabel value="maunal" control={<Radio />} label="Maunal" />
                </RadioGroup>
              </FormControl>
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}><Item>PDP Type</Item></Grid>
          <Grid xs={12} md={6} sx={{ textAlign: "left" }}>
            <Item>
              <Select size="small" value={pdp.get()} onChange={(e) => HandleChangeValue(pdp, e)} >
                {pdps.map((pdpp) => (
                  <MenuItem value={pdpp.value}>{pdpp.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}><Item>APN Name</Item></Grid>
          <Grid xs={12} md={6}>
            <Item><TextFieldSelf value={current.get()} onChange={(e) => HandleChangeValue(current, e)} /></Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left", }}><Item>Auth Type</Item></Grid>
          <Grid xs={12} md={6}>
            <Item>
              <FormControl sx={{ paddingLeft: "9px", flexDirection: "row", }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={authType.get()}
                  onChange={(e) => HandleChangeValue(authType, e)}
                >
                  <FormControlLabel value="0" control={<Radio />} label="PAP" />
                  <FormControlLabel value="1" control={<Radio />} label="CHAP" />
                  <FormControlLabel value="2" control={<Radio />} label="PAP/CHAP" />
                  <FormControlLabel value="3" control={<Radio />} label="NONE" />
                </RadioGroup>
              </FormControl>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left", marginTop: "30px" }}><Item>Username</Item></Grid>
          <Grid xs={12} md={6}>
            <Item><TextFieldSelf value={username.get()} onChange={(e) => HandleChangeValue(username, e)} maxLength="30" /></Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}><Item>Password</Item></Grid>
          <Grid xs={12} md={6}>
            <Item><TextFieldSelf value={password.get()} onChange={(e) => HandleChangeValue(password, e)} maxLength="30" /></Item>
          </Grid>
        </Grid>
      </Box>

      <Box px={20} py={6}>
        <Button fullWidth color="error" startIcon={<CheckCircle />} variant="contained">Save</Button>
      </Box>

    </Stack>
  ))
}
