import { Box, Button, Divider, Stack, styled, TextField } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { createEffect, useObserver } from 'react-solid-state';

import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { Define, fetching, FormBuilder } from './utils';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function Item(props) {
  const { children, ...other } = props;
  return (
    <Box
      sx={{ height: "65px", lineHeight: "50px", mb: "5px", margin: "0 auto", fontSize: { xs: "15px", md: "1rem" } }}
      {...other}
    >
      <Box>
        <Stack>{children}</Stack>
      </Box>
    </Box>
  );
}
function AboutTextField(props) {
  return (
    <TextField
      label="" InputProps={{ readOnly: true }} variant="filled"
      sx={{ padding: "5px", maxWidth: "410px", "& input": { textAlign: "center" } }} {...props}
    />
  );
}

export default function SetAbout() {
  /*********constants**********/
  //定义动态变量

  const hardwareV = Define("CC50_HW_V01"), softwareV = Define("CC50_SW_V01");
  const firmwareV = Define("CC50_Firmware_V01"), uiV = Define("CC50_Web_V01");
  const model = Define("CC50_CPE_SKU6_EU_FR");
  const mac = Define("XX:XX:XX:XX:XX:XX"), IMEI = Define("123456789");
  const IMSI = Define("123456789"), sn = Define("123456789");
  const storage = Define(15);
  const rom = Define("100MB"), romFree = Define("15MB");

  /*********createEffect**********/
  createEffect(async () => {
    // await fetching_get_wifi_setting();
  })

  /*********functions**********/
  const fetching_get_wifi_setting = async () => {
    return await fetching(FormBuilder({
      "cmd": `system.info.get`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      hardwareV.set(res.hardwareVersion); softwareV.set(res.softwareVersion);
      firmwareV.set(res.firmwareVersion); model.set(res, model);
      mac.set(res.mac); IMEI.set(res.imei);
      IMSI.set(res.imsi); sn.set(res.sn);
      rom.set(res.rom); romFree.set(res.romFree);
    })
  }
  /*********styles**********/

  
  /*********component**********/
  return useObserver(() => (
    <Stack>
      <Divider textAlign="center" sx={{ mt: "30px" }}><b>Version</b></Divider>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>Hardware Version</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={hardwareV.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>Software Version</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={softwareV.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>Firmware Version</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={firmwareV.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>UI Version</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={uiV.get()} /></Item>
        </Grid>
      </Grid>
      <Divider textAlign="center" sx={{ mt: "30px" }}><b>Hardware</b></Divider>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={3} sx={{ textAlign: "left" }}>
          <Item>Model</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={model.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={3} sx={{ textAlign: "left" }}>
          <Item>MAC</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={mac.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={3} sx={{ textAlign: "left" }}>
          <Item>IMEI</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={IMEI.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={3} sx={{ textAlign: "left" }}>
          <Item>IMSI</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={IMSI.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>Serial Number</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={sn.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>Model</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={model.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>MAC</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={mac.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>IMEI</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={IMEI.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>IMSI</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={IMSI.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5} />
        <Grid xs={8} md={3} sx={{ textAlign: "left" }}>
          <Item>Serial Number</Item>
        </Grid>
        <Grid xs={12} md={8} sx={{ textAlign: "center" }}>
          <Item><AboutTextField value={sn.get()} /></Item>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5}></Grid>
        <Grid xs={3} sx={{ textAlign: "left" }}><Item>Storage</Item></Grid>
        <Grid xs={8} md={3} sx={{ textAlign: "right" }}><Item>{romFree.get()} / {rom.get()}</Item></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5}></Grid>
        <Grid xs={12} md={7}><Item><BorderLinearProgress variant="determinate" value={storage.get()} /></Item></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={0.5}></Grid>
        <Grid><Button variant="outlined">Click to free space</Button></Grid>
      </Grid>
    </Stack>
  ))
}
