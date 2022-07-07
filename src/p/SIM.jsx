import { useObserver } from 'react-solid-state'
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
  const checked = Define("")
  /*********functions**********/
  const handleToggle = key => checked.set(key)
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
          <WifiIcon />
        </ListItemIcon>
        <ListItemText primary="Network ON" />
        <Switch edge="end" onChange={() => handleToggle('Network')}
          checked={checked.get().indexOf('Network') !== -1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <BluetoothIcon />
        </ListItemIcon>
        <ListItemText primary="Roaming" />
        <Switch edge="end" onChange={() => handleToggle('Roaming')}
          checked={checked.get().indexOf('Roaming') !== -1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <BluetoothIcon />
        </ListItemIcon>
        <ListItemText primary="Threshold" />
        <Switch edge="end" onChange={() => handleToggle('Threshold')}
          checked={checked.get().indexOf('Threshold') !== -1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemText sx={{ width: "50%" }} primary="Model" />
        <FormControl sx={{ width: "50%" }}>
          <InputLabel>Model</InputLabel>
          <Select label="Channel" onChange={_ => _} MenuProps={{ style: { height: "30%" } }} >
            {["Auto", "4G", "3G"].map((v, i) => (
              <MenuItem key={i} dense>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ListItem>
    </List>
    <br />
    <Button size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}