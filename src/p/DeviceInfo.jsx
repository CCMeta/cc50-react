import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, ListItemSecondaryAction,
} from '@mui/material'
import { createEffect, useObserver } from 'react-solid-state';
import { fetching, Define, CmdResultParser, FormBuilder, rpc as $rpc } from './utils'

export default _ => {
  /*********constants**********/
  const data_system_board = Define()
  const data_device_info = Define({})
  const data_network_info = Define({})

  /*********createEffect**********/
  createEffect(async () => {


    data_system_board.set((await $rpc.post(`system`, 'board'))?.[1])
    data_device_info.set(await fetching_device_info())
    data_network_info.set(await fetching_sim_info())


  })//end of createEffect

  /*********functions**********/
  const fetching_device_info = async () => {
    return await fetching(FormBuilder({
      "cmd": `( echo "0" && echo "2" && echo "3" && echo "4" && echo "-1") | sample_dm`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return {
        firmware: CmdResultParser(res, 'version:'),
        imei: CmdResultParser(res, 'imei:'),
        software: CmdResultParser(res, 'software version:\n'),
      }
    })
  }

  const fetching_sim_info = async () => {
    return await fetching(FormBuilder({
      "cmd": `( echo "0" && echo "4" && echo "5" && echo "-1") | sample_nw`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return {
        pref_roaming: CmdResultParser(res, 'pref_roaming => '),
        long_eons: CmdResultParser(res, 'long_eons = '),
        short_eons: CmdResultParser(res, 'short_eons = '),
      }
    })
  }

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

    <Stack sx={{ p: 2 }} spacing={2}>
      <Paper elevation={6}>
        <List>

          <ListItem divider>
            <ListItemText primary="firmware" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_device_info.get()?.firmware}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="imei" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_device_info.get()?.imei}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="software" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_device_info.get()?.software}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

        </List>
      </Paper>
    </Stack>

    <Stack sx={{ p: 2 }} spacing={2}>
      <Paper elevation={6}>
        <List>

          <ListItem divider>
            <ListItemText primary="pref_roaming" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_network_info.get()?.pref_roaming}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="long_eons" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_network_info.get()?.long_eons}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem divider>
            <ListItemText primary="short_eons" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {data_network_info.get()?.short_eons}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

        </List>
      </Paper>
    </Stack>

  </div>))
}