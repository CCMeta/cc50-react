import { AppBar, Divider, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import 'animate.css';
import { Define, rpc as $rpc, secondsToWatch, FormBuilder, bytesToHuman, fetching } from './utils';


export default () => {
  /*********constants**********/
  const columns = [
    { field: 'id', headerName: 'ID', },
    { field: 'hostname', headerName: 'HOST', flex: 1, },
    { field: 'macaddr', headerName: 'MAC/OS', flex: 1, },
    { field: 'ipaddr', headerName: 'IPv4/IPv6', flex: 1, },
    { field: 'expires', headerName: 'Expires', },
    { field: 'PhyMode', headerName: 'TYPE/MODE', flex: 1, },
    { field: 'AvgRssi0', headerName: 'SIGNAL', flex: 1, },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'ACTIONS',
      getActions: (params) => [
        <GridActionsCellItem icon={<LockIcon color="info" />} label="Lock" />,
      ]
    },
    { field: 'rx_s', headerName: 'RX_S', flex: 1, valueGetter: ({ value }) => value && bytesToHuman(value), },
    { field: 'rx', headerName: 'RX', flex: 1, valueGetter: ({ value }) => value && bytesToHuman(value), },
    // { field: 'CONNECT', headerName: 'CONNECT' },
  ]
  const luci_rpc_getDHCPLeases = Define([])

  /*********createEffect**********/
  createEffect(async () => {

    // setInterval api below 
    const interval_apis = async () => {
      luci_rpc_getDHCPLeases.set(await (async () => {
        const rai0_clients = await fetching(null, 'wifi', `/sta_info/rai0`)
        const ra0_clients = await fetching(null, 'wifi', `/sta_info/ra0`)
        const clients = [...rai0_clients, ...ra0_clients]
        const traffics_str = await fetching(null, 'usage')

        const traffics = eval(
          traffics_str.match(/(var values = new Array[^;]*;)/)[0].replace(`var values = `, ``))
        console.log(traffics)

        return (await $rpc.post("luci-rpc", "getDHCPLeases"))?.[1]?.dhcp_leases?.map((v, i) => {
          const recent = luci_rpc_getDHCPLeases.get().find(client => client.macaddr === v.macaddr)

          const rx = traffics.reduce(
            (_t, _v) => _v.length === 8 && _v[1].toLowerCase() === v.macaddr.toLowerCase() ?
              _t + _v[5] : _t, 0)
          const rx_s = recent ?
            parseInt((rx - recent.rx) / (0.001 * ((new Date()).getTime() - recent.uptime))) : 0

          // const tx = item_traffic ? item_traffic[4] : 0
          // const tx_s = recent_value?.tx && item_traffic ? (tx - recent_value.tx) / 2 : 0

          return {
            ...v,
            PhyMode: `Wire`,
            ...clients.find(client => client.MacAddr === v.macaddr),
            rx: rx || 0,
            rx_s: rx_s || 0,
            id: i,
            expires: secondsToWatch(v.expires),
            uptime: (new Date()).getTime(),
          }
        })
      })())

      return interval_apis
    }
    setInterval(await interval_apis(), 2000);

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