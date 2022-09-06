import { AppBar, Divider, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import 'animate.css';
import { Define, rpc as $rpc, secondsToWatch } from './utils';


export default () => {
  /*********constants**********/
  const columns = [
    { field: 'id', headerName: 'ID', },
    { field: 'hostname', headerName: 'hostname', flex: 1, },
    { field: 'macaddr', headerName: 'MAC/OS', flex: 1, },
    { field: 'ipaddr', headerName: 'IPv4/IPv6', flex: 1, },
    { field: 'expires', headerName: 'expires', },
    { field: 'TYPE', headerName: 'TYPE/MODE', },
    { field: 'SIGNAL', headerName: 'SIGNAL', },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'ACTIONS',
      getActions: (params) => [
        <GridActionsCellItem icon={<LockIcon color="info" />} label="Lock" />,
      ]
    }
    // { field: 'SPEED', headerName: 'SPEED' },
    // { field: 'FLOW', headerName: 'FLOW' },
    // { field: 'CONNECT', headerName: 'CONNECT' },
  ]
  const luci_rpc_getDHCPLeases = Define([])

  /*********createEffect**********/
  createEffect(async () => {

    luci_rpc_getDHCPLeases.set(
      (await $rpc.post("luci-rpc", "getDHCPLeases"))?.[1]?.dhcp_leases?.map((v, i) => ({
        ...v,
        id: i,
        expires: secondsToWatch(v.expires),
      }))
    )

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
          Clients
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      <Stack sx={{ flexBasis: 0, flexGrow: 1 }}></Stack>
      <Stack className='styled-scrollbars' height={`calc(100vh - 64px)`} sx={{ flexBasis: 0, flexGrow: 4 }}>
        <DataGrid rows={luci_rpc_getDHCPLeases.get()} columns={columns} />
      </Stack>

    </Stack>


  </div >))
}