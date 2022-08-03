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
import { MyResponsiveBar } from "./c/ChartBar";
import { MyResponsiveStream } from "./c/ChartStream";


export default () => {
  /*********constants**********/
  const network_interface_dump = Define([])
  const luci_rpc_getHostHints = Define([])
  const luci_rpc_getDHCPLeases = Define([])
  const data_clients_info = Define([])
  const data_MyResponsiveStream = Define([
    {
      "Raoul": 159,
      "Josiane": 30,
      "Marcel": 13,
      "René": 16,
      "Paul": 167,
      "Jacques": 23
    },
    {
      "Raoul": 89,
      "Josiane": 153,
      "Marcel": 69,
      "René": 83,
      "Paul": 119,
      "Jacques": 114
    },
    {
      "Raoul": 116,
      "Josiane": 80,
      "Marcel": 105,
      "René": 177,
      "Paul": 147,
      "Jacques": 10
    },
    {
      "Raoul": 134,
      "Josiane": 28,
      "Marcel": 112,
      "René": 37,
      "Paul": 154,
      "Jacques": 28
    },
    {
      "Raoul": 169,
      "Josiane": 143,
      "Marcel": 116,
      "René": 142,
      "Paul": 58,
      "Jacques": 25
    },
    {
      "Raoul": 106,
      "Josiane": 197,
      "Marcel": 13,
      "René": 106,
      "Paul": 74,
      "Jacques": 169
    },
    {
      "Raoul": 155,
      "Josiane": 47,
      "Marcel": 79,
      "René": 197,
      "Paul": 121,
      "Jacques": 45
    },
    {
      "Raoul": 64,
      "Josiane": 102,
      "Marcel": 105,
      "René": 142,
      "Paul": 170,
      "Jacques": 121
    },
    {
      "Raoul": 126,
      "Josiane": 66,
      "Marcel": 27,
      "René": 153,
      "Paul": 137,
      "Jacques": 77
    }
  ])

  /*********createEffect**********/
  createEffect(async () => {
    setInterval(() => {
      data_MyResponsiveStream.set(data_MyResponsiveStream.get().concat([{
        "Raoul": 159,
        "Josiane": 30,
        "Marcel": 13,
        "René": 16,
        "Paul": 167,
        "Jacques": 23
      }]))
    }, 1000);


    await fetching(FormBuilder({
      "luci_username": "root", "luci_password": "123456",
    }), 'login'
    ).then(_ => sessionStorage.setItem('sid', cookie.parse(document.cookie).sysauth))

    // thw wifi devices of wifi info per devices , such as PhyMode HE=AX VHT=AC
    // https://192.168.1.1/cgi-bin/luci/admin/mtk/wifi/sta_info/rai0/MT7915D.1.2?1659322511882


    network_interface_dump.set(
      (await $rpc.post("network.interface", "dump"))?.[1]?.interface
    )

    luci_rpc_getHostHints.set(
      (await $rpc.post("luci-rpc", "getHostHints"))?.[1]?.interface
    )

    luci_rpc_getDHCPLeases.set(
      (await $rpc.post("luci-rpc", "getDHCPLeases"))?.[1]?.dhcp_leases
    )

    data_clients_info.set(
      await fetching(``, 'wifi', `/sta_info/rai0`)
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

      <Stack style={{ height: '500px' }} direction="row" justifyContent="center" spacing={2}>
        <MyResponsiveStream data={data_MyResponsiveStream.get()} />
      </Stack>

      <Stack style={{ height: '500px' }} direction="row" justifyContent="center" spacing={2}>
        <MyResponsiveBar />
      </Stack>

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
                <TableCell>MacAddr</TableCell>
                <TableCell>PhyMode</TableCell>
                <TableCell>AvgRssi0</TableCell>
                <TableCell>StreamSnr1</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data_clients_info?.get()?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.MacAddr}</TableCell>
                  <TableCell>{row.PhyMode}</TableCell>
                  <TableCell>{row.AvgRssi0}</TableCell>
                  <TableCell>{row.StreamSnr1}</TableCell>
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