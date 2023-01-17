import { Box, Button, Divider, List, ListItem, ListItemText, ListSubheader, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
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
  const storage = Define(15);
  const rom = Define("100MB"), romFree = Define("15MB");
  const data_system_info = Define()
  const data_network_info = Define()

  /*********createEffect**********/
  createEffect(async () => {

    data_system_info.set((await webcmd(`system.info.get`))?.data)
    data_network_info.set((await webcmd(`internet.sim.info.get`))?.data)

  })

  /*********functions**********/


  /*********styles**********/


  /*********component**********/
  return useObserver(() => (
    <Stack>

      {/* Mobile About  */}
      <Box display={{ md: "none" }}>

        <Paper variant="outlined" elevation={0} sx={{ my: '1rem' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} subheader={
            <ListSubheader component="div">{`System Information`}</ListSubheader>}>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`Model Version`} secondary={data_system_info.get()?.model} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`IMEI Version`} secondary={data_system_info.get()?.imei} />
            </ListItem>
            {/* <Divider component="li" />
            <ListItem>
              <ListItemText primary={`Serial Number`} secondary={data_system_info.get()?.imei} />
            </ListItem> */}
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`MAC Address`} secondary={data_system_info.get()?.mac} />
            </ListItem>
          </List>
        </Paper>

        <Paper variant="outlined" elevation={0} sx={{ my: '1rem' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} subheader={
            <ListSubheader component="div">{`Network Information`}</ListSubheader>}>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`Operator`} secondary={data_network_info.get()?.operator?.name} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`IMSI`} secondary={data_system_info.get()?.imsi} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`WAN`} secondary={data_network_info.get()?.wan_ip} />
            </ListItem>
            {/* <Divider component="li" />
            <ListItem>
              <ListItemText primary={`PINLockState`} secondary={data_network_info.get()?.PINLockState} />
            </ListItem> */}
            {/* <Divider component="li" />
            <ListItem>
              <ListItemText primary={`PINCodeState`} secondary={data_network_info.get()?.PINCodeState} />
            </ListItem> */}
          </List>
        </Paper>


        <Paper variant="outlined" elevation={0} sx={{ my: '1rem' }}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} subheader={
            <ListSubheader component="div">{`Network Information`}</ListSubheader>}>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`Software Version`} secondary={data_system_info.get()?.softwareVersion} />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText primary={`Firmware Version`} secondary={data_system_info.get()?.firmwareVersion} />
            </ListItem>
          </List>
        </Paper>

      </Box>

      {/* PC About  */}
      <Box display={{ xs: "none", md: "block" }}>
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
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`Model`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" >{data_system_info.get()?.model}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`IMEI`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" >{data_system_info.get()?.imei}</Typography>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`Serial Number`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" >{data_system_info.get()?.imei}</Typography>
                    </TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`MAC Address`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" >{data_system_info.get()?.mac}</Typography>
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
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`Operator`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" >{data_network_info.get()?.operator?.name}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`IMSI`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" >{data_system_info.get()?.imsi}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`WAN`}
                      </Typography>
                    </TableCell>
                    <TableCell>{data_network_info.get()?.wan_ip}</TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`PINLockState`}
                      </Typography>
                    </TableCell>
                    <TableCell>{data_network_info.get()?.PINLockState}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`PINCodeState`}
                      </Typography>
                    </TableCell>
                    <TableCell>{data_network_info.get()?.PINCodeState}</TableCell>
                  </TableRow> */}
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
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`Software Version`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {data_system_info.get()?.softwareVersion}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`Firmware Version`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {data_system_info.get()?.firmwareVersion}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Paper>

        </Stack>

        {/* <Stack direction="row" spacing={'2.5rem'} >
          <Paper sx={{ flexBasis: 0, flexGrow: 1 }} elevation={0}>
            <Box p={'2.5rem'}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell width={200}>
                      <Typography variant="subtitle2" color='text.secondary'>
                        {`Storage`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <BorderLinearProgress variant="determinate" value={storage.get()} />
                    </TableCell>
                    <TableCell width={200}>
                      <Typography variant="subtitle2">{romFree.get()} / {rom.get()}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button fullWidth color="Aqua_Blue" variant="contained">Click to free space</Button>
            </Box>
          </Paper>
        </Stack> */}
      </Box>


    </Stack>
  ))
}
