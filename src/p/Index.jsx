import { useObserver, createEffect, createStore, onCleanup, } from 'react-solid-state'
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
} from '@mui/material'

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
import { fetching, Define, Store } from './utils'
import { Suspense } from 'react';


export default () => {
  /*********constants**********/
  const connected_devices = Store()

  /*********createEffect**********/
  createEffect(async () => {
    connected_devices.set(await fetching(`connected_devices=1&`))
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
                <TableCell align="right">MAC</TableCell>
                <TableCell align="right">IP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connected_devices?.get?.devices?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.hostName}</TableCell>
                  <TableCell padding="none" align="right">{row.mac_addr}</TableCell>
                  <TableCell align="right">{row.ip_addr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>


  </div >))
}