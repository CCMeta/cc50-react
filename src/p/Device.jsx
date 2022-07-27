import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, ListItemSecondaryAction,
} from '@mui/material'
import { createEffect, useObserver } from 'react-solid-state';
import { fetching, Define, rpc as $rpc } from './utils'

export default _ => {
  /*********constants**********/
  const data_system_board = Define()

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

    data_system_board.set((await $rpc.post(`system`, 'board'))?.[1])

  })

  /*********functions**********/

  const onSubmit = async () => {
    const form = {
    }
    return console.log(form)
    const result = await fetching('save_dhcp=' + JSON.stringify(form) + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }
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
            <ListItemText primary="board_name" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.board_name}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="hostname" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.hostname}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="model" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.model}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="kernel" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.kernel}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="system" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.system}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="version" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.release?.version}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="target" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.release?.target}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="description" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.release?.description}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="distribution" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_system_board.get()?.release?.distribution}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>


        </List>
      </Paper>
    </Stack>

  </div>))
}