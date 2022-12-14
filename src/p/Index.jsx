import {
  Badge, Box, Button, Divider, FormControl, IconButton, InputLabel, LinearProgress, List,
  ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Popover, Select, Stack, styled, Switch, TextField, Typography
} from '@mui/material';
import cookie from 'cookie';
import { createEffect, useObserver } from 'react-solid-state';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadIcon from '@mui/icons-material/Download';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import UploadIcon from '@mui/icons-material/Upload';

import 'animate.css';
import { MyResponsiveBar } from "./c/ChartBar";
import { MyResponsiveLine } from "./c/ChartLineArea";
import { MyResponsivePie } from "./c/ChartPie";
import HeaderBar from './c/HeaderBar';
import { bytesToHuman, CmdResultParser, dBmToQuality, Define, fetching, FormBuilder, intToColor, MAP_WirelessMode, rpc as $rpc, secondsToWatch, webcmd } from './utils';



const chart_theme = {
  "textColor": "#888888",
  "tooltip": {
    "container": {
      "background": "#0a0a0a",
      "color": "#ffffff",
      "fontSize": 12
    }
  }
}
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
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
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.info.dark : '#001e3c',
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
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));
const normalise = (value, MAX = 100, MIN = 0) => ((value - MIN) * 100) / (MAX - MIN);
const current_time = () => `${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`
const bytesToMbit = (bytes) => Math.round(100 * bytes / 125000) / 100
const bytesToMiB = (bytes) => Math.round(100 * bytes / Math.pow(1024, 2)) / 100
// const bytesToGiB = (bytes) => (bytes / Math.pow(1024, 3)).toFixed(2)

const getRemainDaysOfMonthUsage = start => {
  const now = (new Date()).getTime()
  var setDateDone = (new Date()).setDate(start)
  if (setDateDone <= now) {
    let nextMonth = new Date(setDateDone).setMonth((new Date(setDateDone)).getMonth() + 1)
    var fullMonth = (nextMonth - setDateDone) / 86400000
    setDateDone = nextMonth
  } else {
    let prevMonth = new Date(setDateDone).setMonth((new Date(setDateDone)).getMonth() - 1)
    var fullMonth = (setDateDone - prevMonth) / 86400000
  }
  const spaceTime = (setDateDone - now)
  const spaceDays = spaceTime / 86400000
  return [spaceDays, fullMonth]
}


export default () => {
  /*********constants**********/
  const data_for_month_usage = Define({
    start: 1,
    limit: 150,
  })

  const data_for_week_chart = Define((() => {
    let arr = []
    for (let id = 6; id >= 0; id--)
      arr.push({ id: `N${id}`, rx: 1, tx: 1 })
    return arr
  })())

  const data_traffic_24G = Define()
  const data_traffic_5G = Define()
  const data_iwinfo_24G = Define()
  const data_iwinfo_5G = Define()
  const data_lan_speed_chart = Define([{
    "id": "rx", data: [
      { x: current_time(), y: 0.00 }
    ]
  }, {
    "id": "tx", data: [
      { x: current_time(), y: 0.00 }
    ]
  }])
  const data_lan_speed_now = Define({ rx: 0, tx: 0 })
  const data_device_performance = Define({ cpu: 0, mem: 0 })
  const data_device_heat = Define(0)
  const data_luci_conntrack = Define([])
  const data_device_operation_info = Define({})
  const data_sim_network_info = Define({})
  const wifi24GPopoverOpen = Define(null)
  const wifi5GPopoverOpen = Define(null)
  const planPopoverOpen = Define(null)
  const data_wan_network_interface_dump = Define()
  const data_system_info = Define({ "uptime": 0 })
  const data_clients_info_5G = Define([])
  const data_clients_info_24G = Define([])
  const data_wifi_clients_5G = () => {
    const result = []
    var wifi_mode_counter = {}
    data_clients_info_5G.get().map((v, i) => {
      wifi_mode_counter[`5G-${v.PhyMode}`] = wifi_mode_counter[`5G-${v.PhyMode}`] ?? 0
      wifi_mode_counter[`5G-${v.PhyMode}`]++
    })
    for (const key in wifi_mode_counter) {
      result.push({
        id: key,
        value: wifi_mode_counter[key],
      })
    }
    return result
  }
  const data_wifi_clients_24G = () => {
    const result = []
    var wifi_mode_counter = {}
    data_clients_info_24G.get().map((v, i) => {
      wifi_mode_counter[`24G-${v.PhyMode}`] = wifi_mode_counter[`24G-${v.PhyMode}`] ?? 0
      wifi_mode_counter[`24G-${v.PhyMode}`]++
    })
    for (const key in wifi_mode_counter) {
      result.push({
        id: key,
        value: wifi_mode_counter[key],
      })
    }
    return result
  }
  const data_data_Usage_count = () => {
    let tx = data_traffic_5G.get()?.months?.[0].tx
    let rx = data_traffic_5G.get()?.months?.[0].rx
    let free = (data_for_month_usage.get().limit * Math.pow(1024, 2)) - (tx + rx)
    const chartData = [
      //data_data_Usage_count
      { "id": "FREE", "value": free },
      { "id": "DL", "value": tx },
      { "id": "UL", "value": rx },
    ]
    const textData = {
      free: bytesToHuman(free, `KiB`),
      ratio: Math.round(100 * free / (tx + rx + free))
    }
    return { chartData, textData }
  }

  /*********createEffect**********/
  createEffect(async () => {

    // to be continued
    var bodyZoom = (((window.innerWidth / 1500) - 1) / 2) + 1
    document.body.style.setProperty(`--a`, bodyZoom)
    if (window.innerWidth > 900)
      document.getElementsByTagName(`html`)[0].style.fontSize = `${window.innerWidth / 15}%`
    // console.log(bodyZoom)

    //login process
    await fetching(FormBuilder({
      "luci_username": "root", "luci_password": "123456",
    }), 'login'
    ).then(_ => sessionStorage.setItem('sid', cookie.parse(document.cookie).sysauth))

    // Once api without interval
    // data_device_operation_info.set(await fetching_device_operation_info())
    data_device_operation_info.set((await webcmd(`system.info.get`))?.data)
    // await webcmd(`wifi.test`, {
    //   "enable": `motherfucker[]\\'"`
    // })

    // data_iwinfo_5G.set(await fetching_iwinfo_5G())
    data_iwinfo_5G.set((await webcmd(`wifi.status.5g.get`))?.data)
    // data_iwinfo_24G.set(await fetching_iwinfo_24G())
    data_iwinfo_24G.set((await webcmd(`wifi.status.24g.get`))?.data)

    // thw wifi devices of wifi info per devices , such as PhyMode HE=AX VHT=AC
    // https://192.168.1.1/cgi-bin/luci/admin/mtk/wifi/sta_info/rai0/MT7915D.1.2?1659322511882
    // data_clients_info_5G.set(await fetching(null, 'wifi', `/sta_info/rai0`))
    data_clients_info_5G.set((await webcmd(`wifi.stat.5g.get`))?.data)
    // data_clients_info_24G.set(await fetching(null, 'wifi', `/sta_info/ra0`))
    data_clients_info_24G.set((await webcmd(`wifi.stat.24g.get`))?.data)

    data_wan_network_interface_dump.set(
      (await $rpc.post("network.interface", "dump"))?.[1]?.interface.find(i => i.interface === `wan`)
    )

    // setInterval api below 
    const interval_apis = async () => {
      data_device_performance.set(await fetching_device_performance())
      data_device_heat.set(await fetching_device_heat())
      data_system_info.set((await $rpc.post("system", "info"))?.[1])

      data_sim_network_info.set(await fetching_sim_network_info())

      data_luci_conntrack.set((await $rpc.post(`luci`, "getConntrackList"))?.[1].result)
      data_traffic_5G.set(await fetching_traffic_5G())

      //concat speed
      data_lan_speed_now.set(await fetching_realtime_traffic())
      data_lan_speed_chart.set([{
        id: "rx",
        data: [
          ...(data_lan_speed_chart.get()[0]?.data.slice(-20)),
          { x: current_time(), y: bytesToMbit(data_lan_speed_now.get()?.rx) }
        ]
      }, {
        id: "tx",
        data: [
          ...(data_lan_speed_chart.get()[1]?.data.slice(-20)),
          { x: current_time(), y: bytesToMbit(data_lan_speed_now.get()?.tx) }
        ]
      }])

      return interval_apis
    }
    setInterval(await interval_apis(), 3000);
  })

  /*********functions**********/
  const fetching_iwinfo_5G = async () => {
    return await fetching(FormBuilder({
      "cmd": `ubus call iwinfo info '{"device":"rai0"}'`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    )
  }

  const fetching_iwinfo_24G = async () => {
    return await fetching(FormBuilder({
      "cmd": `ubus call iwinfo info '{"device":"ra0"}'`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    )
  }

  const fetching_device_heat = async () => {
    return await fetching(FormBuilder({
      "cmd": `/root/list_heat.sh`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return Math.round(res.split('\n')[0] / 1000)
    })
  }

  const fetching_sim_network_info = async () => {
    return await fetching(FormBuilder({
      "cmd": `( echo "0" && echo "4" && echo "5" && echo "7" && echo "8" && echo "-1") | sample_nw`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return {
        pref_roaming: CmdResultParser(res, 'pref_roaming => '),
        long_eons: CmdResultParser(res, 'long_eons = '),
        short_eons: CmdResultParser(res, 'short_eons = '),
        radio_tech: CmdResultParser(res, 'radio_tech ='),
        signal: CmdResultParser(res, 'rsrp=', ','),
      }
    })
  }

  const fetching_device_operation_info = async () => {
    return await fetching(FormBuilder({
      "cmd": `( echo "0" && echo "3" && echo "7" && echo "-1") | sample_dm`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return {
        modem: CmdResultParser(res, 'modem state is '),
        imei: CmdResultParser(res, ' imei:'),
      }
    })
  }

  const fetching_traffic_5G = async () => {
    return await fetching(FormBuilder({
      "cmd": `vnstat -i rai0 -u && vnstat -i rai0 --json`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      const last7Days = res.interfaces[0].traffic.days.slice(0, 7).reverse()
      data_for_week_chart.set(
        data_for_week_chart.get().slice(0, data_for_week_chart.get().length - last7Days.length)
          .concat(last7Days.map(v => {
            return {
              ...v,
              tx: bytesToMiB(v.tx * 1024),
              rx: bytesToMiB(v.rx * 1024),
            }
          }))
      )

      let weeks = [{ rx: 0, tx: 0 }]
      last7Days.map((v, i) => {
        weeks[0].rx += v.rx
        weeks[0].tx += v.tx
      })
      res.interfaces[0].traffic.weeks = weeks
      return res.interfaces[0].traffic
    })
  }

  const fetching_realtime_traffic = async () => {
    return await fetching(FormBuilder({
      "cmd": `vnstat -i rai0 -tr 3 --json`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => ({
      rx: res?.rx?.bytespersecond,
      tx: res?.tx?.bytespersecond,
    }))
  }

  const fetching_device_performance = async () => {
    return await fetching(FormBuilder({
      "cmd": `top -n 1 -b | head -2`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      const localCmdResultParser = (res) => {
        let cpu_idle = Math.round(CmdResultParser(res, `nic `, `% idle`))
        let mem_used = parseInt(CmdResultParser(res, `Mem:`, `used, `))
        let mem_free = parseInt(CmdResultParser(res, `used, `, `free, `))
        let cpu = Math.round(100 - cpu_idle)
        let mem = Math.round(100 * mem_used / (mem_free + mem_used))
        return { cpu, mem, }
      }
      return localCmdResultParser(res)
    })
  }


  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Stack sx={{ flexGrow: 1, height: { md: "95vh" } }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start"
      divider={<Divider orientation="vertical" flexItem />}>


      <Stack sx={{ display: { xs: "none", md: "flex" }, flexBasis: 0, flexGrow: 1 }}>
        <List dense>
          <Divider>Device</Divider>

          <ListItem>
            <ListItemText primary="Uptime" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {`${secondsToWatch(data_system_info.get().uptime)}`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="IMEI" />
            <ListItemSecondaryAction>
              <Typography variant="caption" color='text.secondary'>
                {data_device_operation_info.get()?.imei}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Model" />
            <ListItemSecondaryAction>
              <Typography variant="caption" color='text.secondary'>
                {data_device_operation_info.get()?.model}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="CPU Rate" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_device_performance.get()?.cpu)} variant="determinate"
                  value={data_device_performance.get()?.cpu} />
                <Typography variant="caption" color='text.secondary' sx={{ width: "2rem" }}>
                  {`${data_device_performance.get()?.cpu}%`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Memory" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_device_performance.get()?.mem)} variant="determinate"
                  value={data_device_performance.get()?.mem} />
                <Typography variant="caption" color='text.secondary' sx={{ width: "2rem" }}>
                  {`${data_device_performance.get()?.mem}%`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Temperature" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_device_heat.get())} variant="determinate" value={data_device_heat.get()} />
                <Typography variant="caption" color='text.secondary' sx={{ width: "2rem" }}>
                  {`${data_device_heat.get()}℃`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>

        </List>
        <Divider>Internet</Divider>
        <List dense>
          <ListItem>
            <ListItemText primary="Internet" />
            <ListItemSecondaryAction>
              <MaterialUISwitch checked={data_device_operation_info.get()?.modem === `ONLINE`} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Operator" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {`${data_sim_network_info.get()?.long_eons} (${data_sim_network_info.get()?.short_eons})`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Net Mode" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {data_sim_network_info.get()?.radio_tech}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Roaming" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {data_sim_network_info.get()?.pref_roaming}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="WAN IP" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {data_wan_network_interface_dump?.get()?.["ipv4-address"]?.[0]?.address}
                {`/`}
                {data_wan_network_interface_dump?.get()?.["ipv4-address"]?.[0]?.mask}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Gateway" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {data_wan_network_interface_dump?.get()?.["route"]?.[1]?.nexthop}
                {`/`}
                {data_wan_network_interface_dump?.get()?.["route"]?.[1]?.mask}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="PIN State" />
            <ListItemSecondaryAction>
              <Typography variant='caption' color='text.secondary'>
                {`N/A`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Signal" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                {/* Why signal need to add 25?  this is the SIM RSRP counting algorithm */}
                {/* (x+125)*2 => 100+((x+75)*2) */}
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(dBmToQuality(parseInt(data_sim_network_info.get()?.signal) + 25), `desc`)} variant="determinate" value={dBmToQuality(parseInt(data_sim_network_info.get()?.signal) + 25)} />
                <Typography variant="caption" sx={{ width: "2rem" }} color='text.secondary'>
                  {`${dBmToQuality(parseInt(data_sim_network_info.get()?.signal) + 25)}%`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Connection" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_luci_conntrack.get().length)} variant="determinate" value={data_luci_conntrack.get().length} />
                <Typography variant="caption" sx={{ width: "2rem" }} color='text.secondary'>
                  {data_luci_conntrack.get().length}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>



        </List>
      </Stack>
      {/* end of left side content */}


      <Stack sx={{ flexBasis: 0, flexGrow: 4, height: { md: "100%" } }}>

        <Stack direction={{ xs: "column", md: "row" }} sx={{ flexBasis: 0, flexGrow: 1, height: { md: "30vh" } }} spacing={2} px={2} py={1}>
          <Paper variant='outlined' sx={{ flexBasis: 0, flexGrow: 1, p: 2, m: 0 }} elevation={0}>
            <Stack flexWrap={`wrap`} direction={`row`} alignItems={`center`} justifyContent={{ md: `space-between`, xs: `center` }}>
              <Typography pl={1} variant={`subtitle1`}>{`Traffic Overview`}</Typography>

              <Stack spacing={1} direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}>
                <Stack direction={'row'} >
                  <DownloadIcon color={'info'} fontSize={'small'} />
                  <Typography variant={'caption'} color='text.secondary'>
                    {bytesToHuman(data_traffic_5G.get()?.days?.[0].tx, `KiB`)}
                  </Typography>
                </Stack>
                <Stack direction={'row'} >
                  <UploadIcon color={'success'} fontSize={'small'} />
                  <Typography variant={'caption'} color='text.secondary'>
                    {bytesToHuman(data_traffic_5G.get()?.days?.[0].rx, `KiB`)}
                  </Typography>
                </Stack>
                <IconButton variant="outlined" color='info' size="small">
                  <ChevronRightRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }}>
              <Stack sx={{ height: '20vh', flexGrow: 6 }}>
                <MyResponsiveBar theme={chart_theme} data={data_for_week_chart.get()} />
              </Stack>
              <Stack justifyContent={'space-evenly'} sx={{ flexGrow: 4 }}>
                <Stack justifyContent={'space-evenly'} direction={'row'}>
                  <Stack p={1} alignItems={'flex-start'}>
                    <Typography component={'div'} variant={'caption'}>
                      Week Data
                    </Typography>
                    <Typography component={'div'} variant={'subtitle1'} color='text.secondary'>
                      {`${bytesToHuman(
                        data_traffic_5G.get()?.weeks?.[0].tx +
                        data_traffic_5G.get()?.weeks?.[0].rx
                        , `KiB`)}`}
                    </Typography>
                  </Stack>
                  <Stack justifyContent={'space-evenly'} alignItems={'stretch'}>
                    <Stack direction={'row'} >
                      <DownloadIcon color={'info'} fontSize={'small'} />
                      <Typography sx={{ flexGrow: 1 }} variant={'caption'} color='text.secondary'>
                        {bytesToHuman(data_traffic_5G.get()?.weeks?.[0].tx, `KiB`)}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} >
                      <UploadIcon color={'success'} fontSize={'small'} />
                      <Typography sx={{ flexGrow: 1 }} variant={'caption'} color='text.secondary'>
                        {bytesToHuman(data_traffic_5G.get()?.weeks?.[0].rx, `KiB`)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack justifyContent={'space-evenly'} direction={'row'}>
                  <Stack p={1} alignItems={'flex-start'}>
                    <Typography component={'div'} variant={'caption'}>
                      {`Month Data`}
                    </Typography>
                    <Typography component={'div'} variant={'subtitle1'} color='text.secondary'>
                      {`${bytesToHuman(data_traffic_5G.get()?.months?.[0].tx +
                        data_traffic_5G.get()?.months?.[0].rx, `KiB`)}`}
                    </Typography>
                  </Stack>
                  <Stack justifyContent={'space-evenly'} alignItems={'stretch'}>
                    <Stack direction={'row'} >
                      <DownloadIcon color={'info'} fontSize={'small'} />
                      <Typography sx={{ flexGrow: 1 }} variant={'caption'} color='text.secondary'>
                        {bytesToHuman(data_traffic_5G.get()?.months?.[0].tx, `KiB`)}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'} >
                      <UploadIcon color={'success'} fontSize={'small'} />
                      <Typography sx={{ flexGrow: 1 }} variant={'caption'} color='text.secondary'>
                        {bytesToHuman(data_traffic_5G.get()?.months?.[0].rx, `KiB`)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
          <Paper variant='outlined' sx={{ flexBasis: 0, flexGrow: 1, p: 2, m: 0 }} elevation={0}>
            <Stack direction={`row`} alignItems={`center`} justifyContent={`space-between`}>
              <Typography pl={1} variant={`subtitle1`}>
                {`Month Data Usage`}
              </Typography>
              <IconButton variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>

              <Stack sx={{ height: '20vh', minWidth: '20vh', position: 'relative' }}>
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography variant={`subtitle2`} component="div">
                    <Typography variant={`caption`} component="div">
                      {`Free (${data_data_Usage_count().textData.ratio}%)`}
                    </Typography>
                    {`${data_data_Usage_count().textData.free}`}
                  </Typography>
                </Box>
                <MyResponsivePie theme={chart_theme} data={data_data_Usage_count().chartData} />
              </Stack>

              <List sx={{ flexBasis: 0, flexGrow: 1, ml: 2 }} dense>
                <ListItem>
                  <Badge color={'info'} variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="Data Limit" />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color='text.secondary'>
                      {`${data_for_month_usage.get().limit} GB`}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color={'info'} variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="Start Day" />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color='text.secondary'>
                      {`Day ${data_for_month_usage.get().start}`}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color={'info'} variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="Remains" />
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                      <LinearProgress sx={{ width: '6rem' }} color="info" variant="determinate"
                        value={normalise(
                          getRemainDaysOfMonthUsage(data_for_month_usage.get().start)[0],
                          getRemainDaysOfMonthUsage(data_for_month_usage.get().start)[1],
                        )} />
                      <Typography variant="caption">
                        {`${getRemainDaysOfMonthUsage(data_for_month_usage.get().start).join(' / ')}`}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Button onClick={e => planPopoverOpen.set(e.currentTarget)} startIcon={<EventNoteIcon />} color='info' fullWidth size='small' variant={'contained'}>
                    Set Usage Plan
                  </Button>

                  <Popover
                    onClose={e => planPopoverOpen.set(null)}
                    anchorEl={planPopoverOpen.get()}
                    open={planPopoverOpen.get() !== null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                    <List sx={{ width: { xs: "80vw", md: "20vw" } }} dense>
                      <ListItem>
                        <TextField size='small' fullWidth label="Set Limit of GB" type="number" />
                      </ListItem>
                      <ListItem>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Start Date</InputLabel>
                          <Select MenuProps={{ PaperProps: { style: { maxHeight: "25vh" } } }} label="Start Date" size="small" fullWidth>
                            {(() => {
                              let items = []
                              for (let index = 1; index < 32; index++) {
                                items.push(
                                  <MenuItem value={index}>{index}</MenuItem>
                                )
                              }
                              return items
                            })()}
                          </Select>
                        </FormControl>
                      </ListItem>
                      <ListItem>
                        <Button color="info" fullWidth variant="contained">Confirm</Button>
                      </ListItem>
                    </List>
                  </Popover>
                </ListItem>
              </List>


            </Stack>
            {/* content */}
          </Paper>
        </Stack>
        {/* end of right side row 1; TRAFFIC && PLAN */}

        <Stack direction={{ xs: "column", md: "row" }} sx={{ flexBasis: 0, flexGrow: 1, height: { md: "30vh" } }} spacing={2} px={2} py={1}>

          <Paper variant='outlined' sx={{ flexBasis: 0, flexGrow: 1, p: 2, m: 0 }} elevation={0}>
            <Stack direction={`row`} alignItems={`center`} justifyContent={`space-between`}>
              <Typography pl={1} variant={`subtitle1`}>
                {`WiFi Overview 5G`}
              </Typography>
              <IconButton variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>

              <Stack sx={{ height: '20vh', minWidth: "20vh", position: 'relative' }}>
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography variant={`subtitle2`} component="div">
                    <Typography variant={`caption`} component="div">
                      {`5G Clients`}
                    </Typography>
                    {`${Math.round(data_clients_info_5G.get().length * 100 / (data_clients_info_24G.get().length + data_clients_info_5G.get().length))}% (${data_clients_info_5G.get().length})`}<br />
                    {`Total ${data_clients_info_24G.get().length + data_clients_info_5G.get().length}`}
                  </Typography>
                </Box>
                <MyResponsivePie theme={chart_theme} data={data_wifi_clients_5G()} />
              </Stack>

              <List sx={{ flexBasis: 0, flexGrow: 1, ml: 2 }} dense>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="ON / OFF" />
                  <ListItemSecondaryAction>
                    <MaterialUISwitch checked={data_iwinfo_5G.get()?.enable === `1`} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="WiFi Name" />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color='text.secondary'>
                      {data_iwinfo_5G.get()?.name}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="Signal" />
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                      <LinearProgress sx={{ width: '6rem' }} color={intToColor(dBmToQuality(parseInt(data_iwinfo_5G.get()?.signal)), `desc`)} variant="determinate" value={dBmToQuality(parseInt(data_iwinfo_5G.get()?.signal))} />
                      <Typography variant="caption" sx={{ width: "2rem" }} color='text.secondary'>
                        {`${dBmToQuality(parseInt(data_iwinfo_5G.get()?.signal))}%`}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Button onClick={e => wifi5GPopoverOpen.set(e.currentTarget)} startIcon={<ReadMoreIcon />} color='info' fullWidth size='small' variant={'outlined'}>
                    More 5G Detail
                  </Button>

                  <Popover
                    onClose={e => wifi5GPopoverOpen.set(null)}
                    anchorEl={wifi5GPopoverOpen.get()}
                    open={wifi5GPopoverOpen.get() !== null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                    <List sx={{ width: { xs: "80vw", md: "20vw" } }} dense>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Auth" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {data_iwinfo_5G.get()?.authMode}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {/* <ListItem>
                          <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                          <ListItemText primary="Encryption" />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" color='text.secondary'>
                              AES
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem> */}
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Password" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {data_iwinfo_5G.get()?.password}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle" />
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Bandwidth" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {`${data_iwinfo_5G.get()?.bandwidth} MHz`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Channel" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {`Ch.${data_iwinfo_5G.get()?.channel}`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Mode" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {MAP_WirelessMode[data_iwinfo_5G.get()?.wirelessMode]}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>

                    </List>

                  </Popover>
                </ListItem>
              </List>


            </Stack>
            {/* content */}
          </Paper>

          <Paper variant='outlined' sx={{ flexBasis: 0, flexGrow: 1, p: 2, m: 0 }} elevation={0}>
            <Stack direction={`row`} alignItems={`center`} justifyContent={`space-between`}>
              <Typography pl={1} variant={`subtitle1`}>
                {`WiFi Overview 2.4G`}
              </Typography>
              <IconButton variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>

              <Stack sx={{ height: '20vh', minWidth: "20vh", position: 'relative' }}>
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography variant={`subtitle2`} component="div">
                    <Typography variant={`caption`} component="div">
                      {`2.4G Clients`}
                    </Typography>
                    {`${Math.round(data_clients_info_24G.get().length * 100 / (data_clients_info_24G.get().length + data_clients_info_5G.get().length))}% (${data_clients_info_24G.get().length})`}<br />
                    {`Total ${data_clients_info_24G.get().length + data_clients_info_5G.get().length}`}
                  </Typography>
                </Box>
                <MyResponsivePie theme={chart_theme} data={data_wifi_clients_24G()} />
              </Stack>

              <List sx={{ flexBasis: 0, flexGrow: 1, ml: 2 }} dense>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="ON / OFF" />
                  <ListItemSecondaryAction>
                    <MaterialUISwitch checked={data_iwinfo_24G.get()?.enable === `1`} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="WiFi Name" />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color='text.secondary'>
                      {data_iwinfo_24G.get()?.name}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText primary="Signal" />
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                      <LinearProgress sx={{ width: '6rem' }} color={intToColor(dBmToQuality(parseInt(data_iwinfo_24G.get()?.signal)), `desc`)} variant="determinate" value={dBmToQuality(parseInt(data_iwinfo_24G.get()?.signal))} />
                      <Typography variant="caption" sx={{ width: "2rem" }} color='text.secondary'>
                        {`${dBmToQuality(parseInt(data_iwinfo_24G.get()?.signal))}%`}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Button onClick={e => wifi24GPopoverOpen.set(e.currentTarget)} startIcon={<ReadMoreIcon />} color='info' fullWidth size='small' variant={'outlined'}>
                    More 2.4G Detail
                  </Button>

                  <Popover
                    onClose={e => wifi24GPopoverOpen.set(null)}
                    anchorEl={wifi24GPopoverOpen.get()}
                    open={wifi24GPopoverOpen.get() !== null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                    <List sx={{ width: { xs: "80vw", md: "20vw" } }} dense>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Auth" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {data_iwinfo_24G.get()?.authMode}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {/* <ListItem>
                          <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                          <ListItemText primary="Encryption" />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" color='text.secondary'>
                              AES
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem> */}
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Password" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {data_iwinfo_24G.get()?.password}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle" />
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Bandwidth" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {`${data_iwinfo_24G.get()?.bandwidth} MHz`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Channel" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {`Ch.${data_iwinfo_24G.get()?.channel}`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText primary="Mode" />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" color='text.secondary'>
                            {MAP_WirelessMode[data_iwinfo_24G.get()?.wirelessMode]}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>

                    </List>

                  </Popover>
                </ListItem>
              </List>


            </Stack>
            {/* content */}
          </Paper>

        </Stack>
        {/* end of right side row 2; WIFI5 && WIFI24 */}

        <Stack sx={{ flexBasis: 0, flexGrow: 1, px: 2, height: { md: "30vh" } }}>
          <Stack flexWrap={`wrap`} direction={`row`} alignItems={`center`} justifyContent={{ md: `space-between`, xs: `center` }}>
            <Typography pl={1} variant={`subtitle1`}>
              {`Speed Flow  `}
              <Typography variant={'caption'} color='text.secondary'>
                {`(1 minute window, 3 second interval)`}
              </Typography>
            </Typography>

            <Stack spacing={1} direction={'row'} alignSelf={`flex-end`} justifyContent={'space-evenly'} alignItems={'center'}>
              <Stack direction={'row'} >
                <HourglassEmptyIcon color='info' fontSize={'small'} sx={{ zoom: 0.9 }} />
                <Typography variant={'caption'}>
                  {`26 ms`}
                </Typography>
              </Stack>
              <Stack direction={'row'} >
                <DownloadIcon color={'info'} fontSize={'small'} />
                <Typography variant={'caption'} color={'info.main'}>
                  {`${bytesToMbit(data_lan_speed_now.get()?.tx)} Mbit/S`}
                </Typography>
              </Stack>
              <Stack direction={'row'} >
                <UploadIcon color={'success'} fontSize={'small'} />
                <Typography variant={'caption'} color={'success.main'}>
                  {`${bytesToMbit(data_lan_speed_now.get()?.rx)} Mbit/S`}
                </Typography>
              </Stack>
              <IconButton variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack sx={{ height: '25vh', mb: { xs: "10vh", md: "0" } }} justifyContent="center">
            <MyResponsiveLine theme={chart_theme} data={data_lan_speed_chart.get()} />
          </Stack>
        </Stack>
        {/* end of right side row 3; REALTIME TRAFFIC CHART */}

      </Stack>
      {/* end of right side content */}
    </Stack>

  </div >))
}