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
import WifiFindIcon from '@mui/icons-material/WifiFind';
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
        <Switch edge="end" onChange={() => handleToggle('wifi')}
          checked={checked.get().indexOf('wifi') !== -1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <WifiFindIcon />
        </ListItemIcon>
        <ListItemText primary="SSID Hidden" />
        <Switch edge="end" onChange={() => handleToggle('bluetooth')}
          checked={checked.get().indexOf('bluetooth') !== -1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <TextField fullWidth label="SSID" variant="standard" />
      </ListItem>
      <ListItem>
        <TextField fullWidth label="Password" variant="standard" />
      </ListItem>
      <ListItem>
        <ListItemText sx={{ width: "50%" }} primary="Channel" />
        <FormControl sx={{ width: "50%" }}>
          <InputLabel>Channel</InputLabel>
          <Select variant="standard" label="Channel" onChange={_ => _} MenuProps={{ style: { height: "30%" } }} >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (
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