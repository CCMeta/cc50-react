import { Box, Button, Divider, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
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
    <Box {...other}>
      <Stack>{children}</Stack>
    </Box>
  );
}

function AboutTextFieldBak(props) {
  return (
    <TextField
      label="" InputProps={{ readOnly: true }} variant="filled"
      sx={{ padding: "5px", maxWidth: "410px", "& input": { textAlign: "center" } }} {...props}
    />
  );
}

function AboutTextField(props) {
  return (
    <Typography>
      {props.value}
    </Typography>
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

      <Divider textAlign="left" sx={{ my:6 }}>
        <Typography variant="h6">
          <b>About Information</b>
        </Typography>
      </Divider>

      <Stack direction="row" spacing={5}>

        <Paper style={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={5}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>Hardware Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{hardwareV.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Software Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{softwareV.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Firmware Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{firmwareV.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>UI Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{uiV.get()}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>

        <Paper style={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={5}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>Model Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{model.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>IMEI Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{IMEI.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Serial Number</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{sn.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>MAC Address</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{mac.get()}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>

      </Stack>

      <Stack direction="row" spacing={5} py={5}>
        <Paper style={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={5}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>operator</TableCell>
                  <TableCell><Typography color="text.secondary">{IMSI.get()}</Typography></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IMSI Version</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>WAN_IP Number</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>RSRP RSRQ RSSI SINR</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>

        <Paper style={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={5}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>IMSI Version</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IMSI Version</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IMSI Number</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IMSI Version</TableCell>
                  <TableCell>{IMSI.get()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Stack>

      <Stack direction="row" spacing={5} >
        <Paper style={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={5}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell width={200}>
                    <Typography>Storage</Typography>
                  </TableCell>
                  <TableCell>
                    <BorderLinearProgress variant="determinate" value={storage.get()} />
                  </TableCell>
                  <TableCell width={200}>
                    <Typography>{romFree.get()} / {rom.get()}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button fullWidth variant="outlined">Click to free space</Button>
          </Box>
        </Paper>
      </Stack>

    </Stack>
  ))
}
