import {
  Divider, Stack, Box, Button, styled, Typography, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Grid, Alert
} from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import LoadingButton from '@mui/lab/LoadingButton';

import 'animate.css';
import * as React from 'react';
import { bytesToHuman, Define, fetching, rpc as $rpc, webcmd, FormBuilder } from './utils';

function BackColorTypography(props) {
  return (
    <Typography sx={{ width: "80%", textAlign: "justify", backgroundColor: "#ffffff1a", borderRadius: "10px", padding: "10px" }}
      variant="subtitle2" gutterBottom {...props}></Typography>
  );
}

function StackButton(props) {
  return (
    <Stack sx={{ mt: "3rem", mb: "1rem", width: { md: "40%", xs: "100%" } }}>
      <Button variant="outlined" {...props}></Button>
    </Stack>
  );
}


export default function SetSystem() {
  /*********constants**********/
  //定义动态变量
  const openDialog = Define(false), type = Define("");
  const dialogReboot = Define(false), dialogReset = Define(false);
  const currentVersion = Define(""), newVersion = Define(""), fotaLoading = Define(false);
  const openFotaDialog = Define(false);
  const tips = Define("");
  const OpenDialogReboot = (types) => {
    if (types == "reboot") {
      tips.set("")
    } else if (types == "reset") {
      tips.set("")
    }
    type.set(types);
    openDialog.set(true);
  }

  const OpenDialogReset = (types) => {
    if (types == "reboot") {
      tips.set("When you reboot your CPE, it will lost some information of connected devices, and all devices connected to this CPE will also be disconnected.")
    } else if (types == "reset") {
      tips.set("When the reset your CPE completes, the CPE will need to be set up again and then all devices will have to reconnect the new settings.")
    }
    type.set(types);
    openDialog.set(true);
  }

  const CloseDialog = () => {
    if (type.get() == "reboot") {
      //调用重启函数
    } else if (type.get() == "reset") {
      //调用格式化函数
    }
    openDialog.set(false);
  }
  const checkNewV = () => {
    fotaLoading.set(true);
    //调用查询FOTA函数
    fotaLoading.set(false);
  }
  const updateSystem = () => {
    //调用升级函数
  }

  /*********createEffect**********/
  createEffect(async () => {



  })

  /*********functions**********/
  const fetching_get_wifi_setting = async () => {
    return await fetching(FormBuilder({
      "cmd": `internet.setting.sim.get`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {

    })
  }
  const onReboot = async () => {
    const form = {
      reboot: 1
    }
    return console.log(form)
    const result = await webcmd(`system.reboot`, form)
    if (result.code === 200) {
      alert(result.msg)
      dialogReboot.set(false)
    }
  }
  const onReset = async () => {
    const form = {
      reset: 1
    }
    return console.log(form)
    const result = await webcmd(`system.reset`, form)
    if (result.code === 200) {
      alert(result.msg)
      dialogReset.set(false)
    }
  }

  /*********styles**********/

  return useObserver(() => (
    <Box>

      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6">
          <b>System Operation</b>
        </Typography>
      </Divider>

      <Stack alignItems={`center`}>

        <StackButton onClick={() => dialogReboot.set(true)}>Reboot</StackButton>
        <Stack>
          <Alert variant="filled" severity="error">
            {`Tips: Some data will be lost after restart !!!`}
          </Alert>
        </Stack>
        <Divider orientation="horizontal" />

        <StackButton onClick={() => dialogReset.set(true)}>RESET</StackButton>
        <Stack>
          <Alert variant="filled" severity="error">
            {`Tips: All content and set items will be lost after RESET.`}
          </Alert>
        </Stack>

        <Stack sx={{ mt: "3rem", mb: "1rem", width: { md: "40%", xs: "100%" } }}>
          <LoadingButton onClick={(e) => checkNewV()} loading={fotaLoading.get()} loadingIndicator="Loading…" variant="outlined" disabled >
            Check FOTA
          </LoadingButton>
        </Stack>
        {/* <StackButton onClick={checkNewV}>FOTA</StackButton> */}

        <Stack>
          <Alert variant="filled" severity="error">
            Click the button to detect the new version, current version: &nbsp;
            <Typography sx={{ display: "inline-block", textDecoration: "underline", fontSize: "0.875rem" }}>{currentVersion.get()}</Typography>
          </Alert>
        </Stack>


        <Dialog open={dialogReboot.get()} onClose={() => dialogReboot.set(false)} >
          <DialogTitle>
            <Stack direction="row" alignItems="center">
              <ErrorOutlineIcon color='error' sx={{ mr: `0.5rem` }} />
              <Typography variant="subtitle1" >
                {`Reboot Warning`}
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              <Typography variant="body2" >
                {`When you restarting this device, some saved temporary information will be lost, and every connected client will be disconnected.`}<br /><br />Do you want to continue?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => dialogReboot.set(false)}>No</Button>
            <Button variant="outlined" onClick={onReboot}>Yes</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialogReset.get()} onClose={() => dialogReset.set(false)} >
          <DialogTitle>
            <Stack direction="row" alignItems="center">
              <ErrorOutlineIcon color='error' sx={{ mr: `0.5rem` }} />
              <Typography variant="subtitle1" >
                {`Reset Warning`}
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              <Typography variant="body2" >
                {`When the Reset this device, All the set content will be cleared and cannot be retrieved. Please record the set information in detail to prevent loss.`}<br /><br />Do you want to continue?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => dialogReset.set(false)}>No</Button>
            <Button variant="outlined" onClick={onReset}>Yes</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openFotaDialog.get()} onClose={() => { openFotaDialog.set(false) }}>
          <DialogTitle>
            <SystemUpdateIcon color='success' sx={{ position: "relative", top: "7px", fontSize: 40 }} /><Typography sx={{ display: "inline-block", fontSize: 28 }}>Update</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>There is a new version for your device.<br /><br />Do you want to update?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { openFotaDialog.set(false) }}>No</Button>
            <Button onClick={() => updateSystem}>Yes</Button>
          </DialogActions>
        </Dialog>

      </Stack>
    </Box>
  ))
}
