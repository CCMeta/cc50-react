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
import PodcastsIcon from '@mui/icons-material/Podcasts';
import MapIcon from '@mui/icons-material/MapOutlined';
import ThresholdIcon from '@mui/icons-material/DataThresholding';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default () => {
  /*********constants**********/
  const network_setting = Define({})
  const netWorkChecked = Define("")
  const roamingChecked = Define("")
  // const thresholdChecked = Define("")
  const modelChecked = Define("")


  /*********createEffect**********/
  createEffect(async () => {
    network_setting.set(await fetching(`network_setting=1&`))
    netWorkChecked.set(network_setting.get().gprsStatus)
    roamingChecked.set(network_setting.get().roamingStatus)
    // thresholdChecked.set(network_setting.get().networkMode)
    modelChecked.set(network_setting.get().networkMode)
  })

  /*********functions**********/
  const onModelChange = e => modelChecked.set(e.target.value)

  const onSubmit = async () => {
    const form = {
      "gprsStatus": netWorkChecked.get(),
      "roamingStatus": roamingChecked.get(),
      "networkMode": modelChecked.get(),
    }
    return console.log(form)
    const result = await fetching('save_dhcp=' + JSON.stringify(form) + '&')
    if (!result || result?.result != 'ok') {
      return
    }
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
          SIM Page
        </Typography>
      </Toolbar>
    </AppBar>


    <List sx={{ width: '100%', bgcolor: 'background.paper' }}
    // subheader={<ListSubheader>Settings</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <PodcastsIcon />
        </ListItemIcon>
        <ListItemText primary="Network ON" />
        <Switch edge="end" onChange={() => netWorkChecked.set(v => v === "1" ? "0" : "1")}
          checked={netWorkChecked.get() === "1"} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="Roaming" />
        <Switch edge="end" onChange={() => roamingChecked.set(v => v === "1" ? "0" : "1")}
          checked={roamingChecked.get() === "1"} />
      </ListItem>
      {/* <ListItem>
        <ListItemIcon>
          <ThresholdIcon />
        </ListItemIcon>
        <ListItemText primary="Threshold" />
        <Switch edge="end" onChange={() => thresholdChecked.set(v => v === "1" ? "0" : "1")}
          checked={thresholdChecked.get() === "1"} />
      </ListItem> */}
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemText sx={{ width: "50%" }} primary="Model" />
        <FormControl sx={{ width: "50%" }}>
          <InputLabel>Model</InputLabel>
          <Select value={modelChecked.get()} variant="standard" label="Channel" onChange={onModelChange} MenuProps={{ style: { height: "30%" } }} >
            {["4G", "3G"].map((v, i) => (
              <MenuItem key={i} value={i.toString()} dense>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>
    </List>
    <br />
    <Button onClick={onSubmit} size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}