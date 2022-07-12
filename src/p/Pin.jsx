import { useObserver, createEffect } from 'react-solid-state'
import { Stack, AppBar, Typography, Toolbar, IconButton, Divider, TextField, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetching, Define } from './utils';

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

import LockOpenIcon from '@mui/icons-material/LockOpen';
import NoEncryptionIcon from '@mui/icons-material/NoEncryptionOutlined';


export default _ => {
  /*********constants**********/
  const get_pin_setting = Define()
  const pinCode = Define()
  const pinStatus = Define()
  const pinEnabled = Define()
  const pinRemain = Define()

  /*********createEffect**********/
  createEffect(async () => {
    get_pin_setting.set(await fetching(`get_pin_setting=1&`))
    pinStatus.set(get_pin_setting.get().pinStatus)
    pinEnabled.set(get_pin_setting.get().pinStatus)
    pinRemain.set(get_pin_setting.get().pinStatus)
  })


  const onPinCodeChange = e => pinCode.set(e.target.value)

  const onSubmit = async () => {
    const form = {
      'pinStatus': pinStatus.get(),
      'pinEnabled': pinEnabled.get(),
      'pinCode': pinCode.get(),
    }
    return console.log(form)
    const result = await fetching('save_dhcp=' + JSON.stringify(form) + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }
  /*********functions**********/

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div>

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          PIN Setting Page
        </Typography>
      </Toolbar>
    </AppBar>


    <List sx={{ width: '100%', bgcolor: 'background.paper' }}
    // subheader={<ListSubheader>Settings</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <LockOpenIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Current Login PIN Lock Status (ReadOnly)" />
        <Switch edge="end" onChange={() => pinStatus.set(v => v === 1 ? 0 : 1)}
          checked={pinStatus.get() === 1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemIcon>
          <NoEncryptionIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="PIN Lock Function Enable" />
        <Switch edge="end" onChange={() => pinEnabled.set(v => v === 1 ? 0 : 1)}
          checked={pinEnabled.get() === 1} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <TextField type="number" value={pinCode.get()} onChange={onPinCodeChange} fullWidth label="PIN CODE" variant="standard" />
      </ListItem>
    </List>
    <br />
    <Button onClick={onSubmit} size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>


  </div>))
}