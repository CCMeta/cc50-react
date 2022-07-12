import { useObserver, createEffect } from 'react-solid-state'
import { Button, AppBar, Typography, Toolbar, IconButton, FormControl, TextField, InputLabel, Divider } from '@mui/material'
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
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default () => {
  /*********constants**********/
  const get_protection_setting = Define()
  const firewall = Define()
  const IPFilterSwitch = Define()
  const pingDeactivation = Define()

  /*********functions**********/
  // const handleToggle = key => checked.set(key)

  const onSubmit = async () => {
    const form = {
      "firewall": firewall.get(),
      "IPFilterSwitch": IPFilterSwitch.get(),
      "pingDeactivation": pingDeactivation.get(),
    }
    return console.log(form)
    const result = await fetching('save_dhcp=' + JSON.stringify(form) + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }
  /*********createEffect**********/
  createEffect(async () => {
    get_protection_setting.set(await fetching(`get_protection_setting=1&`))
    firewall.set(get_protection_setting.get().firewall)
    IPFilterSwitch.set(get_protection_setting.get().IPFilterSwitch)
    pingDeactivation.set(get_protection_setting.get().pingDeactivation)
  })

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Protection Page
        </Typography>
      </Toolbar>
    </AppBar>


    <List sx={{ width: '100%', bgcolor: 'background.paper' }}
    // subheader={<ListSubheader>Settings</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <WifiIcon />
        </ListItemIcon>
        <ListItemText primary="Firewall" />
        <Switch edge="end" onChange={() => firewall.set(v => v === 1 ? 0 : 1)}
          checked={firewall.get() === 1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <BluetoothIcon />
        </ListItemIcon>
        <ListItemText primary="Ping Allow" />
        <Switch edge="end" onChange={() => pingDeactivation.set(v => v === 1 ? 0 : 1)}
          checked={pingDeactivation.get() === 1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <BluetoothIcon />
        </ListItemIcon>
        <ListItemText primary="IP Filter" />
        <Switch edge="end" onChange={() => IPFilterSwitch.set(v => v === 1 ? 0 : 1)}
          checked={IPFilterSwitch.get() === 1} />
      </ListItem>
    </List>
    <br />
    <Button onClick={onSubmit} size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}