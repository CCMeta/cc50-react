import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Radio, RadioGroup, Select, Stack, Switch, TextField, Typography } from '@mui/material';

import { createEffect, useObserver } from 'react-solid-state';

import { CheckCircle } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { Define, fetching, FormBuilder } from './utils';


function Item(props) {
  const { children, ...other } = props;
  return (
    <Stack justifyContent={`center`}
      sx={{ height: "60px", lineHeight: "60px", fontSize: { xs: "15px", md: "1rem" }, marginBottom: "0" }}
      {...other} >
      {children}
    </Stack>
  );
}

function TextFieldSelf(props) {
  return (
    <TextField label="" variant="outlined" size="small" {...props} />
  );
}

function TextField1(props) {
  return (
    <TextField label="" variant="outlined" type="number" size="small" {...props} />
  );
}


export default function SetNetwork() {
  /*********constants**********/
  const leaseTimeOptions = [
    { value: 0, name: "Auto" },
    { value: 1, name: "1 Hour" },
    { value: 6, name: "6 Hours" },
    { value: 12, name: "12 Hours" },
    { value: 24, name: "24 Hours" }
  ]
  //定义动态变量
  const enable = Define(true), mode = Define("auto"), gateway = Define("192.168.10.1"), deviceName = Define("Unnamed");
  const start1 = Define(""), end1 = Define(""), start2 = Define(""), end2 = Define(""), lease = Define(0);

  const HandleChangeBoolean = (element, event) => {
    element.set(event.target.checked); //滑动按钮、勾选框等
  };

  const HandleChangeValue = (element, event) => {
    element.set(event.target.value); //输入框、选择框等
  };

  const HandleJudgeValue = (element, event) => {
    if (event.target.value > 255) {
      element.set(255);
    } else if (event.target.value < 0) {
      element.set(0);
    } else {
      element.set(event.target.value); //输入框、选择框等
    }
  };

  /*********createEffect**********/
  createEffect(async () => {
    // await fetching_get_wifi_setting();
  })

  /*********functions**********/
  const fetching_get_network = async () => {
    return await fetching(FormBuilder({
      "cmd": `network.dhcp.get`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      enable.set(res.enable);
      mode.set(res.mode);
      gateway.set(res.gateway);
      start1.set(res.start.split(".")[2]);
      start2.set(res.start.split(".")[3]);
      end1.set(res.end.split(".")[2]);
      end2.set(res.end.split(".")[3]);
    })
  }

  const onSubmit = async () => {
    const form = {
      enable: enable.get(),
      mode: mode.get(),
      gateway: gateway.get(),
      start: "192.168." + start1.get() + "." + start2.get(),
      end: "192.168." + end1.get() + "." + end2.get()
    }
    return await fetching(FormBuilder({
      "cmd": `network.dhcp.get` + form,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {

    })
  }
  /*********styles**********/
  //   sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"12px", md:"1rem"}}}}

  return useObserver(() => (
    <Stack>

      {/* Mobile DHCP Configuration Settings */}
      <Box display={{ md: "none" }}>

        <Paper variant="outlined" elevation={0} sx={{ my: '1rem' }}>
          <List>
            <ListSubheader>
              <Typography align="left" variant="caption" component="div">
                {"DHCP Configuration"}
              </Typography>
            </ListSubheader>
            <ListItem>
              <ListItemText>
                <Divider />
              </ListItemText>
            </ListItem>


            <ListItem>
              <ListItemText primary="DHCP Enable" />
              <FormControlLabel label="Enable" control={<Checkbox size="small" value={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} />} />
            </ListItem>

            <ListItem>
              <FormControl fullWidth>
                <InputLabel id="select-label-Wireless-DHCP-Lease-Time">DHCP Lease Time</InputLabel>
                <Select labelId="select-label-Wireless-DHCP-Lease-Time" label="DHCP Lease Time" variant="outlined" size="small" value={lease.get()} onChange={(e) => HandleChangeValue(lease, e)}>
                  {leaseTimeOptions.map((i) => (
                    <MenuItem value={i.value}>{i.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>

            <ListItem secondaryAction={<Typography variant="caption" color="text.secondary">{gateway.get()}</Typography>}>
              <ListItemText primary={`DHCP Gateway`} />
            </ListItem>

            <ListItem>
              <TextField fullWidth label="Range Start Address" variant="outlined" size="small" value={start1.get()} onChange={(e) => HandleChangeValue(start1, e)} />
            </ListItem>

            <ListItem>
              <TextField fullWidth label="Range End Address" variant="outlined" size="small" value={end1.get()} onChange={(e) => HandleChangeValue(end1, e)} />
            </ListItem>

            <ListItem>
              <TextField fullWidth label="Device Name" variant="outlined" size="small" value={deviceName.get()} onChange={(e) => HandleChangeValue(deviceName, e)} />
            </ListItem>

          </List>
        </Paper>

      </Box>


      {/* PC DHCP Configuration Settings */}
      <Box display={{ xs: "none", md: "block" }}>
        <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
          <Typography variant="h6">
            <b>DHCP Configuration</b>
          </Typography>
        </Divider>

        <Box px={{ md: '4rem' }}>

          <Grid container spacing={2}>
            <Grid xs={5} md={3} sx={{ textAlign: "left" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Enable`}
                </Typography>
              </Item>
            </Grid>
            <Grid xs={7} md={9}>
              <Item>
                <FormControlLabel label="Enable" control={<Checkbox size="small" value={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} />} />
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={4} md={3} sx={{ textAlign: "left" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`Device Name`}
                </Typography>
              </Item>
            </Grid>
            <Grid xs={8} md={6} sx={{ textAlign: "left", "& input": { fontSize: { xs: "15px", md: "1rem" } } }} >
              <Item><TextFieldSelf placeholder="Device Name" /></Item>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={0} md={3}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Range`}
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={9}>
              <Item>
                <Stack direction={`row`} alignItems="center">
                  <Typography component={`span`}>
                    192.168.
                  </Typography>
                  <TextField1 value={start1.get()} onChange={(e) => HandleJudgeValue(start1, e)} />.
                  <TextField1 value={start2.get()} onChange={(e) => HandleJudgeValue(end1, e)} />
                </Stack>
              </Item>
              <Item>
                <Stack direction={`row`} alignItems="center">
                  <Typography component={`span`}>
                    192.168.
                  </Typography>
                  <TextField1 value={end1.get()} onChange={(e) => HandleJudgeValue(start2, e)} />.
                  <TextField1 value={end2.get()} onChange={(e) => HandleJudgeValue(end2, e)} />
                </Stack>
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={8} md={3}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Lease`}
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={6}>
              <Item>
                <Select size="small" value={lease.get()} onChange={(e) => HandleChangeValue(lease, e)}>
                  {leaseTimeOptions.map((i) => (
                    <MenuItem value={i.value}>{i.name}</MenuItem>
                  ))}
                </Select>
              </Item>

            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Gateway`}
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={9} sx={{ textAlign: "left", fontSize: { xs: "15px", md: "1rem" } }}>
              <Item>
                <FormControl sx={{ flexDirection: "row" }}>
                  <RadioGroup row value={mode.get()} onChange={(e) => HandleChangeValue(mode, e)} >
                    <FormControlLabel value="auto" control={<Radio />} label="Auto" />
                    <FormControlLabel value="maunal" control={<Radio />} label="Maunal" />
                  </RadioGroup>
                  <FormControlLabel
                    value={gateway.get()}
                    control={<TextFieldSelf sx={{ "& input": { fontSize: { xs: "15px", md: "1rem" } } }} placeholder="192.168.10.1" />}
                    disabled={mode.get() == "auto"}
                    onChange={(e) => HandleChangeValue(gateway, e)}
                  />
                </FormControl>
              </Item>
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
