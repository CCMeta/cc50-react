import { Avatar, Button, Divider, FormControl, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuItem, Popover, Select, Stack, Typography } from '@mui/material';
import { createEffect, onCleanup, useObserver } from 'react-solid-state';

import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import 'animate.css';
import { QOS_OPTIONS } from './constants';
import { bytesToHuman, dBmToQuality, Define, fetching, FormBuilder, intToColor, secondsToWatch, webcmd } from './utils';
import { Laptop, LaptopRounded } from '@mui/icons-material';


export default () => {
  /*********constants**********/
  const columns = [
    { field: 'id', type: 'number', headerName: 'ID', width: 60, },
    { field: 'hostname', headerName: 'Host', flex: 1, },
    { field: 'macaddr', headerName: 'MAC/OS', width: 200, },
    { field: 'ipaddr', headerName: 'IPv4/IPv6', width: 150, },
    { field: 'expires', headerName: 'Expires', width: 100, },
    { field: 'PhyMode', headerName: 'PhyMode', width: 100, },
    { field: 'online', type: 'boolean', headerName: 'Online', width: 80, },
    {
      field: 'AvgRssi0', type: 'number', headerName: 'Signal', width: 150, renderCell: p =>
        <Typography variant="body2" color={intToColor(dBmToQuality(parseInt(p.value)), `desc`) + `.main`}>
          {isNaN(p.value) ? `N/A` : `${p.value}dBm (${dBmToQuality(parseInt(p.value))}%)`}
        </Typography>
    },
    {
      field: 'rx_s', type: 'number', headerName: 'DL Speed', width: 150, valueGetter: ({ value }) => value && bytesToHuman(value), renderCell: p =>
        <Typography variant="body2" color={p.value === 0 ? "text.secondary" : "#1677ff"}>{p.value}</Typography>
    },
    {
      field: 'rx', type: 'number', headerName: 'DL Total', width: 150, valueGetter: ({ value }) => value && bytesToHuman(value), renderCell: p =>
        <Typography variant="body2" color={p.value === 0 ? "text.secondary" : "#0958d9"}>{p.value}</Typography>
    },
    {
      field: 'tx_s', type: 'number', headerName: 'UL Speed', width: 150, valueGetter: ({ value }) => value && bytesToHuman(value), renderCell: p =>
        <Typography variant="body2" color={p.value === 0 ? "text.secondary" : "#52c41a"}>{p.value}</Typography>
    },
    {
      field: 'tx', type: 'number', headerName: 'UL Total', width: 150, valueGetter: ({ value }) => value && bytesToHuman(value), renderCell: p =>
        <Typography variant="body2" color={p.value === 0 ? "text.secondary" : "#389e0d"}>{p.value}</Typography>
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      getActions: (params) => [
        <GridActionsCellItem disabled icon={<LockIcon color="Aqua_Blue" />} label="Lock" />,
        <GridActionsCellItem onClick={e => {
          QoS_dataClientMAC.set(params.row.macaddr)
          QoS_dataClientHost.set(params.row.hostname)
          params.row?.rx_l && QoS_dataDL.set(params.row?.rx_l)
          params.row?.tx_l && QoS_dataUL.set(params.row?.tx_l)
          return QoS_PopoverOpen.set(e.currentTarget)
        }} icon={<EditIcon color="Aqua_Blue" />} label="QoS" />,
      ]
    },
    // { field: 'CONNECT', headerName: 'CONNECT' },
  ]
  const getDHCPLeases = Define([])
  const QoS_PopoverOpen = Define(null)
  const QoS_dataClientMAC = Define("")
  const QoS_dataClientHost = Define("")
  const QoS_dataUL = Define(48)
  const QoS_dataDL = Define(48)

  /*********functions**********/
  const onQoSSubmit = async () => {
    const form = {
      client: QoS_dataClientMAC.get(),
      tx: QoS_dataUL.get(),
      rx: QoS_dataDL.get()
    }
    // return console.warn(form)
    const result = await webcmd(`clients.qos.set`, form)
    if (result.code === 200) {
      alert(result.msg)
      QoS_dataUL.set(48)
      QoS_dataDL.set(48)
      QoS_PopoverOpen.set(null)
    } else {
      alert(`result.code = ${result.code}; result.msg = ${result.msg}`)
    }
  }
  const fetching_conntrack_list = async () => {
    return await fetching(FormBuilder({
      "command": `ubus call luci-rpc getDHCPLeases`,
      "sessionid": sessionStorage.getItem('sid'),
      "cmd": `ubus call luci-rpc getDHCPLeases`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return res.dhcp_leases
    })
  }

  /*********createEffect**********/
  const intervalDuration = 3 // seconds
  var intervalFlag
  createEffect(async () => {

    // setInterval api below 
    const interval_apis = async () => {
      getDHCPLeases.set(await (async () => {
        const rai0_clients = await fetching(null, 'wifi', `/sta_info/rai0`)
        const ra0_clients = await fetching(null, 'wifi', `/sta_info/ra0`)
        const clients = [...rai0_clients, ...ra0_clients]

        // const traffics_str = await fetching(null, 'usage')
        // const traffics = eval(
        //   traffics_str.match(/(var values = new Array[^;]*;)/)[0].replace(`var values = `, ``))
        // console.log(traffics)

        // const traffics_old = await webcmd(`clients.list.get`).then(v => v.data)
        const traffics = await webcmd(`> /dev/null && uci get hellapi.traffic_log.clients`).then(v => {
          const clients = []
          const clients_strs = v.split(` `)
          for (const clients_str of clients_strs) {
            const mac = clients_str.split(`_`)[0]
            const tx = parseInt(clients_str.split(`_`)[1])
            const rx = parseInt(clients_str.split(`_`)[2])
            const client_obj = {}
            client_obj[mac] = { tx, rx }
            clients.push(client_obj)
          }
          return clients
        })

        return (await fetching_conntrack_list())?.map((v, i) => {
          const recent = getDHCPLeases.get().find(client => client.macaddr === v.macaddr)
          let rx, tx, rx_s, tx_s = 0
          for (let client of traffics) {
            if (typeof client[v.macaddr.toLowerCase()] !== 'undefined') {
              rx = client[v.macaddr.toLowerCase()]?.rx ?? 0
              tx = client[v.macaddr.toLowerCase()]?.tx ?? 0
            }
          }
          tx_s = recent ? parseInt((tx - recent.tx) / (0.001 * ((new Date()).getTime() - recent.uptime))) : 0
          rx_s = recent ? parseInt((rx - recent.rx) / (0.001 * ((new Date()).getTime() - recent.uptime))) : 0

          // const rx = traffics.reduce((_t, _v) => _v.length === 8 && _v[1].toLowerCase() === v.macaddr.toLowerCase() ? _t + _v[3] : _t, 0)
          // const rx_s = recent ? parseInt((rx - recent.rx) / (0.001 * ((new Date()).getTime() - recent.uptime))) : 0

          // const tx = traffics.reduce((_t, _v) => _v.length === 8 && _v[1].toLowerCase() === v.macaddr.toLowerCase() ? _t + _v[4] : _t, 0)
          // const tx_s = recent ? parseInt((tx - recent.tx) / (0.001 * ((new Date()).getTime() - recent.uptime))) : 0

          return {
            ...v,
            PhyMode: `Wire`,
            ...clients.find(client => client.MacAddr === v.macaddr),
            rx: rx || 0,
            rx_s: rx_s || 0,
            tx: tx || 0,
            tx_s: tx_s || 0,
            id: i,
            online: !(rx_s + tx_s === 0),
            expires: secondsToWatch(v.expires),
            uptime: (new Date()).getTime(),
          }
        })
      })())

      return interval_apis
    }
    intervalFlag = setInterval(await interval_apis(), intervalDuration * 1000);

  })
  onCleanup(() => clearInterval(intervalFlag))



  /*********styles**********/


  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      {/* <Stack sx={{ flexBasis: 0, flexGrow: 1 }}></Stack> */}
      <Stack className='styled-scrollbars' height={{ xs: `calc(95dvh - 4rem)`, md: `95dvh` }} sx={{ flexBasis: 0, flexGrow: 4 }}>
        <Stack sx={{ m: 2 }}>
          <Button disabled color="info" onClick={e => QoS_PopoverOpen.set(e.currentTarget)} startIcon={<PublicIcon />} size='small' variant="outlined" sx={{ width: `20rem` }}>
            Set Global QoS
          </Button>

          <Popover
            onClose={e => QoS_PopoverOpen.set(null)}
            anchorEl={QoS_PopoverOpen.get()}
            open={QoS_PopoverOpen.get() !== null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
            transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
            <List sx={{ width: `20rem` }} dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LaptopRounded />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText secondary={QoS_dataClientHost.get()}>
                  {QoS_dataClientMAC.get()}
                </ListItemText>
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel size="small" id="select-label-Client-qos-download">Down Limit Rate</InputLabel>
                  <Select labelId="select-label-Client-qos-download" label="Down Limit Rate" variant="outlined" size="small" value={QoS_dataDL.get()} onChange={(e) => QoS_dataDL.set(e.target.value)}>
                    {QOS_OPTIONS.map((i) => (
                      <MenuItem value={i.value}>{i.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel size="small" id="select-label-Client-qos-upload">Up Limit Rate</InputLabel>
                  <Select labelId="select-label-Client-qos-upload" label="Up Limit Rate" variant="outlined" size="small" value={QoS_dataUL.get()} onChange={(e) => QoS_dataUL.set(e.target.value)}>
                    {QOS_OPTIONS.map((i) => (
                      <MenuItem value={i.value}>{i.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                <Button fullWidth variant="contained" onClick={onQoSSubmit}>Save</Button>
              </ListItem>
            </List>
          </Popover>
        </Stack>
        <DataGrid disableSelectionOnClick rows={getDHCPLeases.get()} columns={columns} />
      </Stack>

    </Stack>

  </div >))
}