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
import { bytesToHuman, Define, fetching, rpc as $rpc, secondsToWatch, FormBuilder } from './utils';

function BackColorTypography(props) {
  return (
    <Typography sx={{ width: "80%", textAlign: "justify", backgroundColor: "#ffffff1a", borderRadius: "10px", padding: "10px" }}
      variant="subtitle2" gutterBottom {...props}></Typography>
  );
}
function StackButton(props) {
  return (
    <Stack sx={{ mt: "40px", mb: "10px", width: "40%" }}>
      <Button variant="outlined" {...props}></Button>
    </Stack>
  );
}


export default function SetSystem() {
  /*********constants**********/
  //定义动态变量
  const openDialog = Define(false), type = Define("");
  const currentVersion = Define(""), newVersion = Define(""), fotaLoading = Define(false);
  const openFotaDialog = Define(false);
  const tips = Define("");
  const OpenDialog = (types) => {
    if (types == "reboot") {
      tips.set("When you reboot your CPE, it will lost some information of connected devices, and all devices connected to this CPE will also be disconnected. When the reboot completes, the CPE will need to be set up again and then all devices will have to reconnect the new settings.")
    } else if (types == "reset") {
      tips.set("When you reset your CPE, it will lost all of connected devices's information, and all devices connected to this CPE will also be disconnected. When the reset completes, the CPE will need to be set up again and then all devices will have to reconnect the new settings.")
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
    const fetching_reboot = async () => {
      return await fetching(FormBuilder({
        "cmd": `system.reboot`,
        "token": sessionStorage.getItem('sid'),
      }), 'webcmd'
      ).then(res => {
        // setTimeout()
      })
    }
    const fetching_reset = async () => {
      return await fetching(FormBuilder({
        "cmd": `system.reset`,
        "token": sessionStorage.getItem('sid'),
      }), 'webcmd'
      ).then(res => {
        // setTimeout()
      })
    }
    const fetching_get_fota = async () => {
      return await fetching(FormBuilder({
        "cmd": `system.firmware.get`,
        "token": sessionStorage.getItem('sid'),
      }), 'webcmd'
      ).then(res => {
        // setTimeout()
        currentVersion.set(res.current);
        newVersion.set(res.latest);
      })
    }
    const fetching_fota = async () => {
      return await fetching(FormBuilder({
        "cmd": `system.firmware.set` + { "update": 1 },
        "token": sessionStorage.getItem('sid'),
      }), 'webcmd'
      ).then(res => {
        // setTimeout()

      })
    }
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
  /*********styles**********/

  return useObserver(() => (
    <Box>

      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6">
          <b>System Operation</b>
        </Typography>
      </Divider>

      <Stack alignItems={`center`}>

        <StackButton onClick={(e) => OpenDialog("reboot")}>Reboot</StackButton>
        <Stack>
          <Alert variant="filled" severity="error">
            {`Tips: Some data will be lost after restart !!!`}
          </Alert>
        </Stack>
        <Divider orientation="horizontal" />

        <StackButton onClick={(e) => OpenDialog("reset")}>RESET</StackButton>
        <Stack>
          <Alert variant="filled" severity="error">
            {`Tips: Though your approach works fine in this sandbox.`}
          </Alert>
        </Stack>

        <Stack sx={{ mt: "40px", mb: "10px", width: "40%" }}>
          <LoadingButton onClick={(e) => checkNewV()} loading={fotaLoading.get()} loadingIndicator="Loading…" variant="outlined" >
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

        <Dialog
          open={openDialog.get()}
          onClose={CloseDialog}
        >
          <DialogTitle>
            <ErrorOutlineIcon color='error' sx={{ position: "relative", top: "7px", fontSize: 40 }} /><Typography sx={{ display: "inline-block", fontSize: 28 }}>Warning</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{tips.get()}<br /><br />Do you want to continue?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={CloseDialog}>No</Button>
            <Button onClick={CloseDialog}>Yes</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openFotaDialog.get()}
          onClose={() => { openFotaDialog.set(false) }}
        >
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
