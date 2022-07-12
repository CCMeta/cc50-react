import { useObserver } from 'react-solid-state'
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
          DHCP Page
        </Typography>
      </Toolbar>
    </AppBar>


    <List sx={{ width: '100%', bgcolor: 'background.paper' }} >
      <ListItem>
        <ListItemIcon>
          <SchemaIcon />
        </ListItemIcon>
        <ListItemText primary="DHCP ON" />
        <Switch edge="end" onChange={() => handleToggle('DHCP')}
          checked={checked.get().indexOf('DHCP') !== -1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <TextField fullWidth label="192.168.1." placeholder='DHCP Begin Address' variant="standard" />
      </ListItem>
      <ListItem>
        <TextField fullWidth label="192.168.1." placeholder='DHCP End Address' variant="standard" />
      </ListItem>
      <ListItem>

        <ListItemText sx={{ width: "40%" }} primary="Lease Hour" />
        <FormControl sx={{ width: "60%" }}>
          <Slider defaultValue={1} min={1} max={24} valueLabelDisplay="on" />
        </FormControl>
      </ListItem>
    </List>
    <br />
    <Button size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}