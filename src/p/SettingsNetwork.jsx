import {
  Divider, Stack, Box, FormGroup, FormControlLabel, Checkbox, TextField, Select,
  MenuItem, Switch, Button, FormControl, RadioGroup, Radio, Typography
} from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import 'animate.css';
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { bytesToHuman, Define, fetching, rpc as $rpc, secondsToWatch, FormBuilder } from './utils';
import { CheckCircle } from '@mui/icons-material';


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
  const modes = [
    { value: "0", name: "Auto" },
    { value: "1", name: "1H" },
    { value: "6", name: "6H" },
    { value: "12", name: "12H" },
    { value: "24", name: "24H" }
  ]
  //定义动态变量
  const enable = Define(true), mode = Define("auto"), gateway = Define("");
  const start1 = Define(""), end1 = Define(""), start2 = Define(""), end2 = Define(""), lease = Define("0");
  const HandleChangeBoolean = (dom, event) => {
    dom.set(event.target.checked); //滑动按钮、勾选框等
  };
  const HandleChangeValue = (dom, event) => {
    dom.set(event.target.value); //输入框、选择框等
  };
  const HandleJudgeValue = (dom, event) => {
    if (event.target.value > 255) {
      dom.set(255);
    } else if (event.target.value < 0) {
      dom.set(0);
    } else {
      dom.set(event.target.value); //输入框、选择框等
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
  const fetching_set_network = async () => {
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

      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6">
          <b>Network Configuration</b>
        </Typography>
      </Divider>

      <Box px={{ md: '4rem' }}>
        <Grid container spacing={2}>
          <Grid xs={4} md={3} sx={{ textAlign: "left" }}>
            <Item>Device Name</Item>
          </Grid>
          <Grid xs={8} md={6} sx={{ textAlign: "left", "& input": { fontSize: { xs: "15px", md: "1rem" } } }} >
            <Item><TextFieldSelf placeholder="Device Name" /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={5} md={3} sx={{ textAlign: "left" }}>
            <Item>DHCP Enable</Item>
          </Grid>
          <Grid xs={7} md={9}>
            <Item><Switch value={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={0} md={3} sx={{ textAlign: "left", marginTop: "10px" }}>
            <Item>DHCP Range</Item>
          </Grid>
          <Grid xs={12} md={9} sx={{ textAlign: "left", marginTop: "10px" }}>
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
          <Grid xs={8} md={3} sx={{ textAlign: "left", marginTop: "10px" }}>
            <Item>DHCP Lease</Item>
          </Grid>
          <Grid xs={12} md={6} sx={{ textAlign: "left", marginTop: "10px" }}>
            <Item>
              <Select size="small"
                value={lease.get()}
                onChange={(e) => HandleChangeValue(lease, e)}
              >
                {modes.map((mode) => (
                  <MenuItem value={mode.value}>{mode.name}</MenuItem>
                ))}
              </Select>
            </Item>

          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
            <Item>DHCP Gateway</Item>
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

      <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
        <Button fullWidth color="error" startIcon={<CheckCircle />} variant="contained">Save</Button>
      </Box>
      {/* <Divider sx={{marginBottom: "10px", marginTop: "10px"}}/>
        <Grid container spacing={2}>
                <Grid xs={3} sx={{textAlign: "left"}}>
                <Item>NAT</Item>
                <Item>MTU</Item>
                <Item>MSS</Item>
            </Grid>
            <Grid xs={8.5}>
                <Item><Switch /></Item>
                <Item><TextFieldSelf/></Item>
                <Item><TextFieldSelf/></Item>
            </Grid>
        </Grid>
        <Divider sx={{marginBottom: "10px", marginTop: "10px"}}/>
        <Grid container spacing={2}>
            <Grid xs={0.5}/>
            <Grid xs={3} sx={{textAlign: "left"}}>
                <Item>DHCP DNS</Item>
            </Grid>
            <Grid xs={8.5} sx={{textAlign: "left"}}>
                <Item>
                    <Stack sx={{display: "inline-block"}}>1. <TextFieldSelf/></Stack>
                    <Stack sx={{display: "inline-block"}}>2. <TextFieldSelf/></Stack>
                </Item>
            </Grid>
        </Grid> */}
    </Stack>
  ))
}
