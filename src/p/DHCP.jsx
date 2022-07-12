import { useObserver, createEffect } from 'react-solid-state'
import { Button, AppBar, Typography, Toolbar, IconButton, FormControl, TextField, Slider, Divider } from '@mui/material'
import { Link } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import '../s/Index.module.css'
import { fetching, Define, Store } from './utils'
import 'animate.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import WifiIcon from '@mui/icons-material/Wifi';
import SchemaIcon from '@mui/icons-material/SchemaOutlined';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default () => {
  /*********constants**********/
  const dhcpStatus = Define("")
  const startIP = Define("")
  const endIP = Define("")
  const leaseTime = Define("")
  const get_dhcp_setting = Define("")

  /*********createEffect**********/
  createEffect(async () => {
    get_dhcp_setting.set(await fetching(`get_dhcp_setting=1&`))
    dhcpStatus.set(get_dhcp_setting.get().dhcpStatus)
    startIP.set(IPChecker(get_dhcp_setting.get().startIP))
    endIP.set(IPChecker(get_dhcp_setting.get().endIP))
    leaseTime.set(get_dhcp_setting.get().leaseTime)
  })

  /*********functions**********/
  const onLeaseTimeChange = e => leaseTime.set(e.target.value)
  const onStartIPChange = e => leaseTime.set(e.target.value)
  const onEndIPChange = e => leaseTime.set(e.target.value)


  const onSubmit = async () => {
    const form = {
      "startIP": IPChecker(startIP.get()),
      "endIP": IPChecker(endIP.get()),
      "leaseTime": leaseTime.get().toString(),
      "dhcpStatus": dhcpStatus.get(),
    }
    return console.log(form)
    const result = await fetching('save_dhcp=' + JSON.stringify(form) + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }

  function IPChecker(ip) {
    if (ip.indexOf("192.168.") > -1)
      return ip.replace("192.168.1.", "")
    else
      return "192.168.1." + ip
  }

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          DHCP Page
        </Typography>
      </Toolbar>
    </AppBar>


    <List sx={{ width: '100%', bgcolor: 'background.paper' }} >
      <ListItem>
        <ListItemIcon>
          <SchemaIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="DHCP ON" />
        <Switch edge="end" onChange={() => dhcpStatus.set(v => v === "1" ? "0" : "1")}
          checked={dhcpStatus.get() === "1"} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <TextField value={startIP.get()} onChange={onStartIPChange} fullWidth label="192.168.1." placeholder='DHCP Begin Address' variant="standard" />
      </ListItem>
      <ListItem>
        <TextField value={endIP.get()} onChange={onEndIPChange} fullWidth label="192.168.1." placeholder='DHCP End Address' variant="standard" />
      </ListItem>
      <ListItem>

        <ListItemText sx={{ width: "40%" }} primary="Lease Hour" />
        <FormControl sx={{ width: "60%" }}>
          <Slider onChange={onLeaseTimeChange} defaultValue={1} min={1} max={24} valueLabelDisplay="on" />
        </FormControl>
      </ListItem>
    </List>
    <br />
    <Button onClick={onSubmit} size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}