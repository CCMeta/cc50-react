import { useObserver, createEffect, createStore, onCleanup, } from 'react-solid-state'
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, ListItemSecondaryAction, LinearProgress, Box, Switch, styled, CircularProgress
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
import { MyResponsivePie } from "./c/ChartPie";
import { MyResponsiveLine } from "./c/SpeedLineArea";

const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: 'pink',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg height="20" width="20" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path  fill="${encodeURIComponent(
        '#FFF',
      )}" d="M192.596 531.41C202.63 699.1 341.774 832 511.976 832c75.914 0 145.636-26.454 200.5-70.622C634.46 739.108 548 707.844 459.124 669.234 361.462 626.808 269.914 579.354 192.596 531.41zM214.762 393.258c79.822 54.22 184.14 110.26 295.358 158.574 87.182 37.876 174.226 69.11 251.718 90.328 12.992 3.558 25.668 6.812 37.976 9.766 3.37-6.924 6.498-13.988 9.376-21.182 14.682-36.716 22.772-76.786 22.772-118.744 0-6.52-0.218-12.986-0.602-19.41C821.322 324.9 682.18 192 511.976 192c-75.912 0-145.634 26.454-200.496 70.622-36.592 29.458-66.568 66.796-87.34 109.452C220.766 378.998 217.638 386.064 214.762 393.258zM859.334 569.062c-2.512 23.124-4.754 27.254-11.782 49.39 33.756 24.078 62.064 47.412 82.274 67.876 6.57 6.656 11.75 12.45 15.824 17.404-3.368 0.168-7.114 0.266-11.262 0.266-43.772 0-108.052-11-181.002-30.976-78.934-21.612-167.46-53.37-256.016-91.84-117.862-51.2-228.316-111.082-311.02-168.614-38.162-26.55-70.054-52.452-92.226-74.9-6.57-6.656-11.75-12.45-15.824-17.404 3.366-0.168 7.112-0.266 11.264-0.266 30.616 0 71.274 5.388 117.904 15.458 11.65-20.008 13.958-25.402 29.326-42.818C185.326 274 133.25 261.044 89.568 256c-48.806-5.636-80.68 11.042-87.968 34.28C-20.548 360.914 190 517.436 471.872 639.884 660.996 722.044 834.208 768 934.388 768c49.13 0 80.676-11.042 87.964-34.282C1035.032 693.286 973.93 640 859.334 569.062z"></path></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default () => {
  /*********constants**********/
  const network_interface_dump = Define([])
  const luci_rpc_getHostHints = Define([])
  const luci_rpc_getDHCPLeases = Define([])
  const data_clients_info = Define([])
  const data_MyResponsiveStream = Define([{ cpu: 0, mem: 0 }])

  /*********createEffect**********/
  createEffect(async () => {


    // setInterval(async () => {
    //   data_MyResponsiveStream.set(data_MyResponsiveStream.get().concat([
    //     await fetching_MyResponsiveStream()
    //   ]))
    // }, 5000);


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
  const fetching_MyResponsiveStream = async () => {
    return await fetching(FormBuilder({
      "cmd": `top -n 1 -b | head -2`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      const localCmdResultParser = (res) => {
        let cpu_idle = parseInt(CmdResultParser(res, `nic `, `% idle`))
        let mem_used = parseInt(CmdResultParser(res, `Mem:`, `used, `))
        let mem_free = parseInt(CmdResultParser(res, `used, `, `free, `))
        let cpu = 100 - cpu_idle
        let mem = 100 * mem_used / (mem_free + mem_used)
        return { cpu, mem, }
      }
      return localCmdResultParser(res)
    })
  }
  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar variant="dense">
        <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>

        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack direction="row" justifyContent="space-between" alignItems="flex-start"
      divider={<Divider orientation="vertical" flexItem />}>


      <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
        <List dense>
          <Divider>Device</Divider>

          <ListItem>
            <ListItemText primary="Uptime" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                1y 2m 1w 2d
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Firmware" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                NR15.R3.MD700.MP.V25.P11
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Software" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                RG500LEUACR02A04M8G
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="CPU Rate" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color="secondary" variant="determinate" value={39} />
                <Typography variant="caption" sx={{ color: "purple", width: "2rem" }}>39%</Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Memory" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color="success" variant="determinate" value={82} />
                <Typography variant="caption" sx={{ color: "green", width: "2rem" }}>82%</Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Temperature" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color="error" variant="determinate" value={65} />
                <Typography variant="caption" sx={{ color: "red", width: "2rem" }}>65℃</Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>

        </List>
        <Divider>SIM</Divider>
        <List dense>
          <ListItem>
            <ListItemText primary="Internet" />
            <ListItemSecondaryAction>
              <MaterialUISwitch />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Servicer" />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                Orange France
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Net Mode" />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                5G / LTE
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="PIN LOCK" />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                FUCKED
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Roaming" />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                OPEN
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Signal" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color="warning" variant="determinate" value={45} />
                <Typography variant="caption" sx={{ color: "orange", width: "2rem" }}>Weak</Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="WAN IP" />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                202.10.120.45
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Gateway" />
            <ListItemSecondaryAction>
              <Typography variant='caption'>
                111.231.120.45
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Connection" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color="info" variant="determinate" value={31} />
                <Typography variant="caption" sx={{ color: "blue", width: "2rem" }}>7729</Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>



        </List>
      </Stack>
      {/* end of left side content */}


      <Stack style={{ flexBasis: 0, flexGrow: 4 }}
        divider={<Divider orientation="horizontal" flexItem />}>

        <Stack direction="row" style={{ flexBasis: 0, flexGrow: 1 }} spacing={2}
          divider={<Divider orientation="vertical" flexItem />}>

          <Stack style={{ height: '30vh', flexBasis: 0, flexGrow: 1, }} p={2}>
          </Stack>

          <Stack style={{ height: '30vh', flexBasis: 0, flexGrow: 1, position: 'relative' }} p={2}>
            <MyResponsivePie />

            <Box sx={{
              top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: -1,
            }}>
              <Typography variant="caption" component="div" color="text.secondary">
                {`33%`}
              </Typography>
            </Box>

          </Stack>

        </Stack>
        {/* end of right side 1 */}

        <Stack direction="row" style={{ flexBasis: 0, flexGrow: 1 }} spacing={2}
          divider={<Divider orientation="vertical" flexItem />}>
          <Stack style={{ height: '30vh', flexBasis: 0, flexGrow: 1, }} p={2}>
            <MyResponsiveBar />
          </Stack>
          <Stack style={{ height: '30vh', flexBasis: 0, flexGrow: 1, }} p={2}>
            <MyResponsiveBar />
          </Stack>
        </Stack>
        {/* end of right side 2 */}

        <Stack style={{ flexBasis: 0, flexGrow: 1 }} p={2}>
          <Stack style={{ height: '25vh' }} direction="row" justifyContent="center" spacing={2}>
            {/* <MyResponsiveStream data={data_MyResponsiveStream.get()} /> */}
            <MyResponsiveLine />
          </Stack>
        </Stack>
        {/* end of right side 3 */}

        <Stack style={{ flexBasis: 0, flexGrow: 1 }} p={2}>

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
              <ListItem>
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
        {/* end of right side 4 */}

      </Stack>
      {/* end of right side content */}
    </Stack>

  </div >))
}