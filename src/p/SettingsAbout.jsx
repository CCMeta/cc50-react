import { Box, Button, Divider, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { createEffect, useObserver } from 'react-solid-state';

import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { Define, fetching, FormBuilder, webcmd } from './utils';

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
  const data_system_info = Define()

  /*********createEffect**********/
  createEffect(async () => {

    data_system_info.set((await webcmd(`system.info.get`))?.data)

  })

  /*********functions**********/


  /*********styles**********/


  /*********component**********/
  return useObserver(() => (
    <Stack>

      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6">
          <b>About Information</b>
        </Typography>
      </Divider>

      <Stack direction={{ md: "row", xs: "column" }} spacing={`2.5rem`}>

        <Paper sx={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={'2.5rem'}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>Model Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.model}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>IMEI Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.imei}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Serial Number</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.imei}</Typography>
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

        <Paper sx={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={'2.5rem'}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Operator</TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{IMSI.get()}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IMSI Version</TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.model}</Typography>
                  </TableCell>
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

      </Stack>

      <Stack direction="row" spacing={'2.5rem'} py={'2.5rem'}>

        <Paper sx={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={'2.5rem'} sx={{ lineBreak: "anywhere" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>Hardware Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.firmwareVersion}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Software Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.softwareVersion}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Firmware Version</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{data_system_info.get()?.firmwareVersion}</Typography>
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

      </Stack>

      <Stack direction="row" spacing={'2.5rem'} >
        <Paper sx={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
          <Box p={'2.5rem'}>
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
            <Button fullWidth color="error" variant="contained">Click to free space</Button>
          </Box>
        </Paper>
      </Stack>

    </Stack>
  ))
}
