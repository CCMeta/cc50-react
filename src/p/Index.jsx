import {
  Badge, Box, Button, Divider, FormControl, FormControlLabel, IconButton, InputLabel, LinearProgress, List,
  ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Popover, Select, Stack, styled, Switch, TextField, Typography
} from '@mui/material';
import cookie from 'cookie';
import { createEffect, onCleanup, useObserver } from 'react-solid-state';

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
import { boolToInt, bytesToHuman, CmdResultParser, dBmToQuality, Define, fetching, FormBuilder, intToColor, MAP_WirelessMode, rpc as $rpc, secondsToWatch, webcmd } from './utils';
import { DATA_MODES } from './constants';
import { LoadingButton } from '@mui/lab';
import { AccessAlarmRounded, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


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
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 1024 1024"><path fill="${encodeURIComponent('#EEE',)}" d="M954.88 323.437714q0 22.820571-16.018286 38.838857l-491.446857 491.446857q-16.018286 16.018286-38.838857 16.018286t-38.838857-16.018286l-284.598857-284.598857q-16.018286-16.018286-16.018286-38.838857t16.018286-38.838857l77.677714-77.677714q16.018286-16.018286 38.838857-16.018286t38.838857 16.018286l168.009143 168.594286 374.857143-375.442286q16.018286-16.018286 38.838857-16.018286t38.838857 16.018286l77.677714 77.677714q16.018286 16.018286 16.018286 38.838857z"/></svg>')`,
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
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 1024 1024" version="1.1"><path fill="${encodeURIComponent('#EEE',)}" d="M851.428571 755.428571q0 22.857143-16 38.857143l-77.714286 77.714286q-16 16-38.857143 16t-38.857143-16l-168-168-168 168q-16 16-38.857143 16t-38.857143-16l-77.714286-77.714286q-16-16-16-38.857143t16-38.857143l168-168-168-168q-16-16-16-38.857143t16-38.857143l77.714286-77.714286q16-16 38.857143-16t38.857143 16l168 168 168-168q16-16 38.857143-16t38.857143 16l77.714286 77.714286q16 16 16 38.857143t-16 38.857143l-168 168 168 168q16 16 16 38.857143z"/></svg>')`,
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
  const data_plan_start = Define(1)
  const data_plan_limit = Define(150)
  const data_latency = Define(0)

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
  const data_system_cpu = Define(0)
  const data_system_ram = Define(0)
  const data_device_heat = Define(0)
  const data_luci_conntrack = Define([])
  const data_device_operation_info = Define({})
  const data_sim_network_info = Define({})
  const wifi24GPopoverOpen = Define(null)
  const wifi5GPopoverOpen = Define(null)
  const planPopoverOpen = Define(null)
  const data_clients_info_5G = Define([])
  const data_clients_info_24G = Define([])
  const isOutOfLimit = Define(false)
  const submitLoading = Define(false)

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
    let free = (data_plan_limit.get() * Math.pow(1024, 2)) - (tx + rx)
    if (free < 0) {
      // out of limit
      isOutOfLimit.set(true)
      free = 0 - free
    } else {
      // Into limit
      isOutOfLimit.set(false)
    }

    const chartData = [
      //data_data_Usage_count
      { "id": "FREE", "value": free },
      { "id": "DL", "value": tx },
      { "id": "UL", "value": rx },
    ]
    const textData = {
      free: bytesToHuman(free, `KiB`),
      ratio: isOutOfLimit.get()
        ? Math.round(100 * (tx + rx) / (tx + rx + (-free)))
        : Math.round(100 * free / (tx + rx + free))
    }
    return { chartData, textData }
  }

  /*********createEffect**********/
  var intervalFlag
  createEffect(async () => {

    // to be continued
    // var bodyZoom = (((window.innerWidth / 1500) - 1) / 2) + 1
    // document.body.style.setProperty(`--a`, bodyZoom)
    if (window.innerWidth > 900 && false)
      document.getElementsByTagName(`html`)[0].style.fontSize = `${window.innerWidth / 15}%`
    // console.log(bodyZoom)

    // Once api without interval
    data_device_operation_info.set((await webcmd(`system.info.get`))?.data)

    // data_iwinfo_5G.set(await fetching_iwinfo_5G())
    data_iwinfo_5G.set((await webcmd(`wifi.status.5g.get`))?.data)
    // data_iwinfo_24G.set(await fetching_iwinfo_24G())
    data_iwinfo_24G.set((await webcmd(`wifi.status.24g.get`))?.data)

    // thw wifi devices of wifi info per devices , such as PhyMode HE=AX VHT=AC
    // https://192.168.1.1/cgi-bin/luci/admin/mtk/wifi/sta_info/rai0/MT7915D.1.2?1659322511882
    // data_clients_info_5G.set(await fetching(null, 'wifi', `/sta_info/rai0`))
    data_clients_info_5G.set((await webcmd(`wifi.stat.5g.get`))?.data || [])
    // data_clients_info_24G.set(await fetching(null, 'wifi', `/sta_info/ra0`))
    data_clients_info_24G.set((await webcmd(`wifi.stat.24g.get`))?.data || [])

    // set traffic plan data
    await webcmd(`traffic.project.get`).then(res => {
      const data = res.data
      data_plan_limit.set(data?.limit)
      data_plan_start.set(data?.start)
    })

    // SetInterval api below 
    const intervalDuration = 3000
    const interval_apis = async () => {
      // data_latency
      const StartTimeStamp = Date.now()
      await webcmd(`hello`).then(_ => data_latency.set(Date.now() - StartTimeStamp - 80))

      await webcmd(`system.info.cpu.get`).then(res => {
        const used = 100 - parseInt(res?.data?.["cpuIdle"])
        data_system_cpu.set(used)
      })

      await webcmd(`system.info.ram.get`).then(res => {
        const used = parseInt(100 * (res?.data?.["memoryTotal"] - res?.data?.["memoryFree"]) / res?.data?.["memoryTotal"])
        data_system_ram.set(used)
      })

      await webcmd(`system.info.heat.get`).then(res => {
        data_device_heat.set(parseInt(res?.data?.["temp"]))
      })

      await webcmd(`internet.sim.info.get`).then(res => {
        data_sim_network_info.set(res.data)
      })

      data_luci_conntrack.set(await fetching_luci_conntrack())
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

    // await interval_apis() //first initial
    intervalFlag = setInterval(await interval_apis(), intervalDuration);
  })
  onCleanup(() => clearInterval(intervalFlag))

  /*********functions**********/

  const fetching_luci_conntrack = async () => {
    return await fetching(FormBuilder({
      "cmd": `ubus call luci getConntrackList`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => res?.result || [])
  }

  const fetching_traffic_5G = async () => {
    return await fetching(FormBuilder({
      "cmd": `vnstat -i rai0 -u && vnstat -i rai0 --json`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      if (typeof res.interfaces === undefined)
        return {}
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

  const onSubmitPlan = async () => {
    submitLoading.set(true)
    const form = {
      limit: data_plan_limit.get(),
      start: data_plan_start.get(),
    }
    // return console.log(form)
    const result = await webcmd(`traffic.project.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
    submitLoading.set(false)
  }

  const onModemSwitch = async (e) => {
    const form = {
      enable: boolToInt(e.target.checked)
    }
    // return console.log(form)
    const result = await webcmd(`internet.sim.enable.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
    data_device_operation_info.set((await webcmd(`system.info.get`))?.data)
  }

  const on24GSwitch = async (e) => {
    const form = {
      enable: boolToInt(e.target.checked)
    }
    // return console.log(form)
    const result = await webcmd(`wifi.enable.24g.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
    data_iwinfo_24G.set((await webcmd(`wifi.status.24g.get`))?.data)
  }

  const on5GSwitch = async (e) => {
    const form = {
      enable: boolToInt(e.target.checked)
    }
    // return console.log(form)
    const result = await webcmd(`wifi.enable.5g.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
    data_iwinfo_5G.set((await webcmd(`wifi.status.5g.get`))?.data)
  }

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Stack sx={{ flexGrow: 1, height: { md: "95vh" } }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start"
      divider={<Divider orientation="vertical" flexItem />}>


      <Stack sx={{ display: { xs: "none", md: "flex" }, flexBasis: 0, flexGrow: 1 }}>
        <List dense>
          <Divider>
            <Typography variant="subtitle1" color='text.secondary'>
              <b>System</b>
            </Typography>
          </Divider>

          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Uptime`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {`${secondsToWatch(data_device_operation_info.get()?.["uptime"])}`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`IMEI`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {data_device_operation_info.get()?.imei}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Model`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {data_device_operation_info.get()?.model}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`CPU Rate`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_system_cpu.get())} variant="determinate" value={data_system_cpu.get()} />
                <Typography textAlign="right" variant="body2" color={intToColor(data_system_cpu.get()) + `.main`} sx={{ width: "2rem" }}>
                  {`${data_system_cpu.get()}%`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Memory`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_system_ram.get())} variant="determinate" value={data_system_ram.get()} />
                <Typography textAlign="right" variant="body2" color={intToColor(data_system_ram.get()) + `.main`} sx={{ width: "2rem" }}>
                  {`${data_system_ram.get()}%`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Temperature`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_device_heat.get())} variant="determinate" value={data_device_heat.get()} />
                <Typography textAlign="right" variant="body2" color={intToColor(data_device_heat.get()) + `.main`} sx={{ width: "2rem" }}>
                  {`${data_device_heat.get()}℃`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Divider>
          <Typography variant="subtitle1" color='text.secondary'>
            <b>Internet</b>
          </Typography>
        </Divider>
        <List dense>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Network`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <MaterialUISwitch onChange={onModemSwitch} checked={boolToInt(data_sim_network_info.get()?.enable)} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Operator`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {`${data_sim_network_info.get()?.["operator"]?.["name"] || ``}`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Data Mode`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {DATA_MODES.find(v => v.value === data_sim_network_info.get()?.["dataMode"])?.name}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Roaming`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                <Switch disabled color="warning" checked={boolToInt(data_sim_network_info.get()?.["roaming"])} />
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`IP Address`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {data_sim_network_info.get()?.["wan_ip"]}/
                {data_sim_network_info.get()?.["mask"]}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Gateway`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Typography variant='body2'>
                {data_sim_network_info.get()?.["gateway"]}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant='body2' color='text.secondary'>
                {`Signal`}
              </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                {/* Why signal need to add 25?  this is the SIM RSRP counting algorithm */}
                {/* (x+125)*2 => 100+((x+75)*2) */}
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(parseInt(100 * data_sim_network_info.get()?.['signal'] / 4), `desc`)} variant="determinate" value={parseInt(100 * data_sim_network_info.get()?.['signal'] / 4)} />
                <Typography textAlign="right" variant="body2" sx={{ width: "2rem" }} color={intToColor(parseInt(100 * data_sim_network_info.get()?.['signal'] / 4), `desc`) + `.main`}>
                  {isNaN(data_sim_network_info.get()?.['signal']) ? `N/A` : `${parseInt(100 * data_sim_network_info.get()?.['signal'] / 4)}%`}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItemButton disabled>
            <ListItemText primary="PIN State" />
            <ListItemSecondaryAction>
              <Typography variant='body2' color='text.secondary'>
                {`N/A`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItemButton>
          <ListItemButton disabled>
            <ListItemText primary="Connection" />
            <ListItemSecondaryAction>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinearProgress sx={{ width: '6rem' }} color={intToColor(data_luci_conntrack.get().length)} variant="determinate" value={data_luci_conntrack.get().length} />
                <Typography textAlign="right" variant="body2" sx={{ width: "2rem" }} color='text.secondary'>
                  {data_luci_conntrack.get().length}
                </Typography>
              </Stack>
            </ListItemSecondaryAction>
          </ListItemButton>



        </List>
      </Stack>
      {/* end of left side content */}


      <Stack sx={{ flexBasis: 0, flexGrow: 4, height: { md: "100%" } }}>

        <Stack direction={{ xs: "column", md: "row" }} sx={{ flexBasis: 0, flexGrow: 1, height: { md: "30vh" } }} spacing={2} px={2} py={1}>
          <Paper variant='outlined' sx={{ flexBasis: 0, flexGrow: 1, p: 2, m: 0 }} elevation={0}>
            <Stack flexWrap={`wrap`} direction={`row`} alignItems={`center`} justifyContent={{ md: `space-between`, xs: `center` }}>
              <Typography pl={1} variant={`subtitle1`} color='text.secondary'>
                {`Traffic Overview`}
              </Typography>

              <Stack spacing={1} direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}>
                <Stack direction={'row'}>
                  <DownloadIcon color={'info'} fontSize={'small'} />
                  <Typography variant={'body2'}>
                    {bytesToHuman(data_traffic_5G.get()?.days?.[0].tx, `KiB`)}
                  </Typography>
                </Stack>
                <Stack direction={'row'}>
                  <UploadIcon color={'success'} fontSize={'small'} />
                  <Typography variant={'body2'}>
                    {bytesToHuman(data_traffic_5G.get()?.days?.[0].rx, `KiB`)}
                  </Typography>
                </Stack>
                <IconButton disabled variant="outlined" color='info' size="small">
                  <ChevronRightRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>
              <Stack sx={{ height: '20vh', flexGrow: 1, width: { md: "50%" } }}>
                <MyResponsiveBar theme={chart_theme} data={data_for_week_chart.get()} />
              </Stack>
              <Stack justifyContent={{ md: "space-evenly" }} sx={{ height: { md: "20vh" }, flexGrow: 1, whiteSpace: "nowrap" }}>
                <Stack justifyContent={'space-evenly'} direction={'row'}>
                  <Stack p={1} alignItems={'flex-start'}>
                    <Typography component={'div'} variant={'body2'} color='text.secondary'>
                      {`Week Data`}
                    </Typography>
                    <Typography component={'div'} variant={'subtitle1'}>
                      {`${bytesToHuman(
                        data_traffic_5G.get()?.weeks?.[0].tx +
                        data_traffic_5G.get()?.weeks?.[0].rx
                        , `KiB`)}`}
                    </Typography>
                  </Stack>
                  <Stack justifyContent={'space-evenly'} alignItems={'stretch'}>
                    <Stack direction={'row'}>
                      <DownloadIcon color={'info'} fontSize={'small'} />
                      <Typography textAlign="right" sx={{ flexGrow: 1 }} variant={'body2'}>
                        {bytesToHuman(data_traffic_5G.get()?.weeks?.[0].tx, `KiB`)}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <UploadIcon color={'success'} fontSize={'small'} />
                      <Typography textAlign="right" sx={{ flexGrow: 1 }} variant={'body2'}>
                        {bytesToHuman(data_traffic_5G.get()?.weeks?.[0].rx, `KiB`)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack justifyContent={'space-evenly'} direction={'row'}>
                  <Stack p={1} alignItems={'flex-start'}>
                    <Typography component={'div'} variant={'body2'} color='text.secondary'>
                      {`Month Data`}
                    </Typography>
                    <Typography component={'div'} variant={'subtitle1'}>
                      {`${bytesToHuman(data_traffic_5G.get()?.months?.[0].tx +
                        data_traffic_5G.get()?.months?.[0].rx, `KiB`)}`}
                    </Typography>
                  </Stack>
                  <Stack justifyContent={'space-evenly'} alignItems={'stretch'}>
                    <Stack direction={'row'}>
                      <DownloadIcon color={'info'} fontSize={'small'} />
                      <Typography textAlign="right" sx={{ flexGrow: 1 }} variant={'body2'}>
                        {bytesToHuman(data_traffic_5G.get()?.months?.[0].tx, `KiB`)}
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <UploadIcon color={'success'} fontSize={'small'} />
                      <Typography textAlign="right" sx={{ flexGrow: 1 }} variant={'body2'}>
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
              <Typography pl={1} variant={`subtitle1`} color='text.secondary'>
                {`Month Data Usage`}
              </Typography>
              <IconButton disabled variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>

              <Stack sx={{ height: '20vh', minWidth: '20vh', position: 'relative' }}>
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography color={isOutOfLimit.get() ? "#f5222d" : "text.secondary"} textAlign="center" variant={`subtitle2`} component="div">
                    <Typography variant={`caption`} component="div">
                      {`${isOutOfLimit.get() ? "Over" : "Free"} (${data_data_Usage_count().textData.ratio}%)`}
                    </Typography>
                    {`${data_data_Usage_count().textData.free}`}
                  </Typography>
                </Box>
                <MyResponsivePie scheme={isOutOfLimit.get() ? "red_grey" : null} theme={chart_theme} data={data_data_Usage_count().chartData} />
              </Stack>

              <List sx={{ flexBasis: 0, flexGrow: 1, ml: 2 }} dense>
                <ListItem>
                  <Badge color={'info'} variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`Data Limit`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Typography variant="body2">
                      {`${data_plan_limit.get()} GB`}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color={'info'} variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`Start Day`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Typography variant="body2">
                      {`Day ${data_plan_start.get()}`}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color={'info'} variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`Remains`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                      <LinearProgress sx={{ width: '6rem' }} color="info" variant="determinate"
                        value={normalise(
                          getRemainDaysOfMonthUsage(data_plan_start.get())[0],
                          getRemainDaysOfMonthUsage(data_plan_start.get())[1],
                        )} />
                      <Typography variant="body2">
                        {`${getRemainDaysOfMonthUsage(data_plan_start.get()).join(' / ')}`}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Button onClick={e => planPopoverOpen.set(e.currentTarget)} startIcon={<EventNoteIcon />} color='info' fullWidth size='small' variant="outlined">
                    Set Traffic Plan
                  </Button>

                  <Popover
                    onClose={e => planPopoverOpen.set(null)}
                    anchorEl={planPopoverOpen.get()}
                    open={planPopoverOpen.get() !== null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
                    <List sx={{ width: { xs: "80vw", md: "20vw" } }} dense>
                      <ListItem>
                        <TextField size='small' fullWidth label="Set Month data Limit of GB" value={data_plan_limit.get()} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          onChange={e => data_plan_limit.set(parseInt(e.target.value || 0))} />
                      </ListItem>
                      <ListItem>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Start Date</InputLabel>
                          <Select MenuProps={{ PaperProps: { style: { maxHeight: "25vh" } } }} label="Start Date" size="small" fullWidth value={data_plan_start.get()} onChange={e => data_plan_start.set(e.target.value)}>
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
                        <LoadingButton loading={submitLoading.get()} onClick={onSubmitPlan} color="Aqua_Blue" fullWidth startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
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
              <Typography pl={1} variant={`subtitle1`} color='text.secondary'>
                {`WiFi Overview 5G`}
              </Typography>
              <IconButton disabled variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>

              <Stack sx={{ height: '20vh', minWidth: "20vh", position: 'relative' }}>
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography textAlign="center" variant={`subtitle2`} component="div">
                    <Typography variant={`caption`} component="div" color='text.secondary'>
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
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`ON / OFF`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <MaterialUISwitch onChange={on5GSwitch} checked={boolToInt(parseInt(data_iwinfo_5G.get()?.enable))} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`WiFi Name`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Typography variant="body2">
                      {data_iwinfo_5G.get()?.name}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`Signal`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                      <LinearProgress sx={{ width: '6rem' }} color={intToColor(dBmToQuality(parseInt(data_iwinfo_5G.get()?.signal)), `desc`)} variant="determinate" value={dBmToQuality(parseInt(data_iwinfo_5G.get()?.signal))} />
                      <Typography variant="body2" sx={{ width: "2rem" }} color={intToColor(dBmToQuality(parseInt(data_iwinfo_5G.get()?.signal)), `desc`) + `.main`}>
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
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Auth`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {data_iwinfo_5G.get()?.authMode}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {/* <ListItem>
                          <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                          <ListItemText primary="Encryption" />
                          <ListItemSecondaryAction>
                            <Typography variant="body2" color='text.secondary'>
                              AES
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem> */}
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Password`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {data_iwinfo_5G.get()?.password}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle" />
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Bandwidth`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {`${data_iwinfo_5G.get()?.bandwidth} MHz`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Channel`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {`Ch.${data_iwinfo_5G.get()?.channel}`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Mode`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
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
              <Typography pl={1} variant={`subtitle1`} color='text.secondary'>
                {`WiFi Overview 2.4G`}
              </Typography>
              <IconButton disabled variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }}>

              <Stack sx={{ height: '20vh', minWidth: "20vh", position: 'relative' }}>
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography textAlign="center" variant={`subtitle2`} component="div">
                    <Typography variant={`caption`} component="div" color='text.secondary'>
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
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`ON / OFF`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <MaterialUISwitch onChange={on24GSwitch} checked={boolToInt(
                      parseInt(data_iwinfo_24G.get()?.enable))} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`WiFi Name`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Typography variant="body2">
                      {data_iwinfo_24G.get()?.name}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                  <ListItemText>
                    <Typography variant='body2' color='text.secondary'>
                      {`Signal`}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                      <LinearProgress sx={{ width: '6rem' }} color={intToColor(dBmToQuality(parseInt(data_iwinfo_24G.get()?.signal)), `desc`)} variant="determinate" value={dBmToQuality(parseInt(data_iwinfo_24G.get()?.signal))} />
                      <Typography variant="body2" sx={{ width: "2rem" }} color={intToColor(dBmToQuality(parseInt(data_iwinfo_24G.get()?.signal)), `desc`) + `.main`}>
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
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Auth`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {data_iwinfo_24G.get()?.authMode}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {/* <ListItem>
                          <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                          <ListItemText primary="Encryption" />
                          <ListItemSecondaryAction>
                            <Typography variant="body2" color='text.secondary'>
                              AES
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem> */}
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Password`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {data_iwinfo_24G.get()?.password}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="middle" />
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Bandwidth`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {`${data_iwinfo_24G.get()?.bandwidth} MHz`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Channel`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {`Ch.${data_iwinfo_24G.get()?.channel}`}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                        <ListItemText>
                          <Typography variant='body2' color='text.secondary'>
                            {`Mode`}
                          </Typography>
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
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
            <Typography pl={1} pr={1} variant={`subtitle1`} color='text.secondary'>
              {`Speed Flow`}
              <Typography variant={'caption'}>
                {`(1 minute window, 3 second interval)`}
              </Typography>
            </Typography>

            <Stack spacing={1} direction={'row'} alignSelf={`flex-end`} justifyContent={'space-evenly'} alignItems={'center'}>
              <Stack alignItems="center" direction={'row'}>
                <AccessAlarmRounded color="secondary" fontSize={'small'} sx={{ position: `relative`, top: `-1px`, }} />
                <Typography whiteSpace="pre" variant={'body2'} color="secondary.main">
                  {`${data_latency.get()} ms`}
                </Typography>
              </Stack>
              <Stack direction={'row'}>
                <DownloadIcon color={'info'} fontSize={'small'} />
                <Typography variant={'body2'} color={'info.main'}>
                  {`${bytesToMbit(data_lan_speed_now.get()?.tx)} Mbit/S`}
                </Typography>
              </Stack>
              <Stack direction={'row'}>
                <UploadIcon color={'success'} fontSize={'small'} />
                <Typography variant={'body2'} color={'success.main'}>
                  {`${bytesToMbit(data_lan_speed_now.get()?.rx)} Mbit/S`}
                </Typography>
              </Stack>
              <IconButton disabled variant="outlined" color='info' size="small">
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack sx={{ height: '25vh', mb: { xs: "10vh", md: "0" } }} justifyContent="center">
            {(() => useMediaQuery(useTheme().breakpoints.up('md'))
              ? <MyResponsiveLine theme={chart_theme} data={data_lan_speed_chart.get()} />
              : <MyResponsiveLine axisBottom={null} theme={chart_theme} data={data_lan_speed_chart.get()} />
            )()}
          </Stack>
        </Stack>
        {/* end of right side row 3; REALTIME TRAFFIC CHART */}

      </Stack>
      {/* end of right side content */}
    </Stack>

  </div>))
}