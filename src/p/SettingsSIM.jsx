import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import { CheckCircle } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { boolToInt, Define, webcmd } from './utils';

function BpCheckbox(props) {
  return (
    <FormControlLabel label={props.label} control={<Checkbox sx={{ '&:hover': { bgcolor: 'transparent' }, }} size="small" {...props} />}
    />
  );
}

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
    { value: 0, name: "2G" },
    { value: 1, name: "3G" },
    { value: 3, name: "4G" },
    { value: 15, name: "5G" },
    { value: 19, name: "4G/5G" },
    { value: 21, name: "3G/4G/5G" },
  ]
  const pdps = [
    { value: 0, name: "IPV4" },
    { value: 1, name: "IPV6" },
    { value: 2, name: "IPv4v6" }
  ]
  //定义动态变量
  const enable = Define(false), roaming = Define(false), dataMode = Define(0);
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

    await webcmd(`internet.setting.sim.get`).then(v => {
      const res = v.data
      enable.set(boolToInt(res["enable"]))
      roaming.set(boolToInt(res["roaming"]))
      dataMode.set(res["dataMode"])
    })

  })

  /*********functions**********/
  const onSubmit = async () => {
    const form = {
      enable: boolToInt(enable.get()),
      roaming: boolToInt(roaming.get()),
      dataMode: dataMode.get(),
    }
    return console.log(form)
    const result = await webcmd(`internet.setting.sim.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
  }
  /*********styles**********/

  return useObserver(() => (
    <Stack>

      {/* Mobile SIM Settings */}
      <Box display={{ md: "none" }}>

        <Paper variant="outlined" elevation={0} sx={{ my: '1rem' }}>
          <List>
            <ListSubheader>
              <Typography align="left" variant="caption" component="div">
                {"SIM Card Network Configuration"}
              </Typography>
            </ListSubheader>
            <ListItem>
              <ListItemText>
                <Divider />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText primary="Network" />
              <BpCheckbox label="Enable" checked={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Roaming" />
              <BpCheckbox label="Enable" checked={roaming.get()} onChange={(e) => HandleChangeBoolean(roaming, e)} />
            </ListItem>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel id="select-label-Wireless-DataMode">Data Mode</InputLabel>
                <Select labelId="select-label-Wireless-DataMode" label="Data Mode" variant="outlined" size="small" value={dataMode.get()} onChange={(e) => HandleChangeValue(dataMode, e)}>
                  {modes.map((mode) => (
                    <MenuItem value={mode.value}>{mode.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </Paper>

      </Box>

      {/* PC SIM Settings */}
      <Box display={{ xs: "none", md: "block" }}>
        <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
          <Typography variant="h6">
            <b>SIM Network Configuration</b>
          </Typography>
        </Divider>

        <Box px={{ md: '4rem' }}>
          <Grid container spacing={2}>
            <Grid xs={4} md={3} sx={{ textAlign: "left" }}>
              <Item>Network</Item>
              <Item>Roaming</Item>
              <Item>DataMode</Item>
            </Grid>
            <Grid xs={4} md={6} sx={{ textAlign: "left" }}>
              <Item>
                <BpCheckbox label="Enable" checked={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} />
              </Item>
              <Item>
                <BpCheckbox label="Enable" checked={roaming.get()} onChange={(e) => HandleChangeBoolean(roaming, e)} />
              </Item>
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

        <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
          <Typography variant="h6">
            <b>APN Configuration</b>
          </Typography>
        </Divider>

        <Box px={{ md: '4rem' }}>
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
      </Box>

      <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
        <Button onClick={onSubmit} fullWidth color="error" startIcon={<CheckCircle />} variant="contained">Save</Button>
      </Box>

    </Stack>
  ))
}
