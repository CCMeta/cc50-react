import { useObserver, createEffect, createStore, onCleanup, } from 'react-solid-state'
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
} from '@mui/material'
import cookie from 'cookie'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Link } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'animate.css';
import css from '../s/About.module.css'
import { fetching, Define, CmdResultParser, FormBuilder, rpc as $rpc } from './utils'
import { Suspense } from 'react';


export default () => {
  /*********constants**********/
  const network_interface_dump = Define([])
  const luci_rpc_getHostHints = Define([])
  const luci_rpc_getDHCPLeases = Define([])

  /*********createEffect**********/
  createEffect(async () => {


    await fetching(FormBuilder({
      "luci_username": "root", "luci_password": "123456",
    }), 'login'
    ).then(_ => sessionStorage.setItem('sid', cookie.parse(document.cookie).sysauth))


    network_interface_dump.set(
      (await $rpc.post("network.interface", "dump"))?.[1]?.interface
    )

    luci_rpc_getHostHints.set(
      (await $rpc.post("luci-rpc", "getHostHints"))?.[1]?.interface
    )

    luci_rpc_getDHCPLeases.set(
      (await $rpc.post("luci-rpc", "getDHCPLeases"))?.[1]?.dhcp_leases
    )


  })

  /*********functions**********/

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>

        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          IndexPage
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ p: 2 }} spacing={2}>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <Card elevation={6} className={css.card}>
          <CardContent>
            <Stack direction="row" alignItems={"center"} justifyContent={"center"}>
              <Typography>00.00</Typography>
              <Stack>
                <Typography>up</Typography>
                <Typography>mb/s</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card elevation={6} className={css.card}>
          <CardContent>
            <Stack direction="row" alignItems={"center"} justifyContent={"center"}>
              <Typography>00.00</Typography>
              <Stack>
                <Typography>up</Typography>
                <Typography>mb/s</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Paper elevation={6}>
        <List>
          <ListItem divider={true}>
            <ListItemText primary="Session Flow" secondary="This Session Data" />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary="Month Flow" secondary="This Month Data" />
          </ListItem>
          <ListItem >
            <ListItemText primary="Total Flow" secondary="All Time Data" />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Host</TableCell>
                <TableCell>IPv4</TableCell>
                <TableCell>MAC</TableCell>
                <TableCell>Leasetime</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {luci_rpc_getDHCPLeases?.get()?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.hostname}</TableCell>
                  <TableCell>{row.ipaddr}</TableCell>
                  <TableCell>{row.macaddr}</TableCell>
                  <TableCell>{row.expires}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>l3_device</TableCell>
                <TableCell align="right">proto</TableCell>
                <TableCell align="right">interface</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {network_interface_dump?.get()?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.l3_device}</TableCell>
                  <TableCell padding="none" align="right">{row.proto}</TableCell>
                  <TableCell align="right">{row.interface}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


    </Stack>


  </div >))
}