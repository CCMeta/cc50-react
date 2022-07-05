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
  const testData = Store(null)
  createEffect(async () => {
    testData.set(await fetching(`connected_devices=1&`))
  })
  /*********functions**********/

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          AboutPage
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ pb: 7 }} spacing={2} padding={2}>
      <Link to="/">Index</Link>
      <Link to="/about">About</Link>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <Card className={css.card}>
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
        <Card className={css.card}>
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

      <Paper>
        <List>
          <ListItem disablePadding divider={true}>
            <ListItemButton>
              <ListItemText primary="Session Flow" secondary="This Session Data" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding divider={true}>
            <ListItemButton>
              <ListItemText primary="Month Flow" secondary="This Month Data" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Total Flow" secondary="All Time Data" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

    </Stack>

    <Stack padding={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Host</TableCell>
              <TableCell align="right">MAC</TableCell>
              <TableCell align="right">IP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {testData?.get?.devices?.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{row.hostName}</TableCell>
                <TableCell padding="none" align="right">{row.mac_addr}</TableCell>
                <TableCell align="right">{row.ip_addr}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>

  </div >))
}