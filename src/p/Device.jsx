import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, ListItemSecondaryAction,
} from '@mui/material'
import { createEffect, useObserver } from 'react-solid-state';
import { fetching, Define } from './utils';

export default _ => {
  /*********constants**********/
  const get_device_info = Define('')
  const serialNumber = Define('')
  const imei = Define('')
  const imsi = Define('')
  const softwarewVersion = Define('')
  const hardwareVersion = Define('')
  const firmwarewVersion = Define('')
  const webUIVersion = Define('')
  const mac = Define('')
  const wanIP = Define('')
  /*********createEffect**********/
  createEffect(async () => {
    get_device_info.set(await fetching(`get_device_info=1&`))
    serialNumber.set(get_device_info.get().serialNumber)
    imei.set(get_device_info.get().imei)
    imsi.set(get_device_info.get().imsi)
    softwarewVersion.set(get_device_info.get().softwarewVersion)
    hardwareVersion.set(get_device_info.get().hardwareVersion)
    firmwarewVersion.set(get_device_info.get().firmwarewVersion)
    webUIVersion.set(get_device_info.get().webUIVersion)
    mac.set(get_device_info.get().mac)
    wanIP.set(get_device_info.get().wanIP)
  })

  const onSubmit = async () => {
    const form = {
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
          Device Information Page
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ p: 2 }} spacing={2}>
      <Paper elevation={6}>
        <List>


          <ListItem divider>
            <ListItemText primary="serialNumber" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {serialNumber.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="imei" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {imei.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="imsi" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {imsi.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="hardwareVersion" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {hardwareVersion.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="softwarewVersion" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {softwarewVersion.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="firmwarewVersion" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {firmwarewVersion.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="webUIVersion" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {webUIVersion.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="mac" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {mac.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="wanIP" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {wanIP.get()}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>


        </List>
      </Paper>
    </Stack>

  </div>))
}