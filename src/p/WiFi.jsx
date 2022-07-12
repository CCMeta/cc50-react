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
import WifiFindIcon from '@mui/icons-material/WifiFind';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default () => {
  /*********constants**********/
  const get_wifi_settings = Define()
  const wifiChecked = Define("")
  const ssidChecked = Define("")
  const ssid = Define("")
  const password = Define("")
  const channel = Define("")

  /*********createEffect**********/
  createEffect(async () => {
    get_wifi_settings.set(await fetching(`get_wifi_settings=1&`))
    wifiChecked.set(get_wifi_settings.get().status)
    ssidChecked.set(get_wifi_settings.get().hideSSID)
    ssid.set(get_wifi_settings.get().SSIDName)
    password.set(get_wifi_settings.get().password)
    channel.set(get_wifi_settings.get().channel)
  })

  /*********functions**********/
  const onChannelChange = e => channel.set(e.target.value)
  const onSsidChange = e => ssid.set(e.target.value)
  const onPasswordChange = e => password.set(e.target.value)

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Wi-Fi Page
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
        <ListItemText primary="Wi-Fi Status" />
        <Switch edge="end" onChange={() => wifiChecked.set(v => v === 1 ? 0 : 1)}
          checked={wifiChecked.get() === 1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <WifiFindIcon />
        </ListItemIcon>
        <ListItemText primary="SSID Hidden" />
        <Switch edge="end" onChange={() => ssidChecked.set(v => v === 1 ? 0 : 1)}
          checked={ssidChecked.get() === 1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <TextField value={ssid.get()} onChange={onSsidChange} fullWidth label="SSID" variant="standard" />
      </ListItem>
      <ListItem>
        <TextField value={password.get()} onChange={onPasswordChange} fullWidth label="Password" variant="standard" />
      </ListItem>
      <ListItem>
        <ListItemText sx={{ width: "50%" }} primary="Channel" />
        <FormControl sx={{ width: "50%" }}>
          <InputLabel>Channel</InputLabel>
          <Select value={channel.get()} variant="standard" label="Channel" onChange={onChannelChange} MenuProps={{ style: { height: "30%" } }} >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((v, i) => (
              <MenuItem key={i} value={i} dense>{v === 0 ? "Auto" : v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>
    </List>
    <br />
    <Button size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}