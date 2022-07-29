import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Card, CardContent, Paper, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, ListItemSecondaryAction,
} from '@mui/material'
import { createEffect, useObserver } from 'react-solid-state';
import { fetching, Define, CmdResultParser, FormBuilder, rpc as $rpc } from './utils'

export default _ => {
  /*********constants**********/
  const api_result = Define({})

  /*********createEffect**********/
  createEffect(async () => {

    api_result.set(await fetching_sim_info())


  })//end of createEffect

  /*********functions**********/
  const fetching_sim_info = async () => {
    return await fetching(FormBuilder({
      "cmd": `( echo "0" && echo "4" && echo "5" && echo "4" && echo "-1") | sample_nw`,
      "token": sessionStorage.getItem('sid'),
    }), 'webcmd'
    ).then(res => {
      return {
        pref_roaming: CmdResultParser(res, 'pref_roaming => '),
        long_eons: CmdResultParser(res, 'long_eons = '),
        short_eons: CmdResultParser(res, 'short_eons = '),
        software: CmdResultParser(res, 'software version:\n'),
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
          Network Information Page
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ p: 2 }} spacing={2}>
      <Paper elevation={6}>
        <List>

          <ListItem divider>
            <ListItemText primary="software" />
            <ListItemSecondaryAction>
              <Typography variant="caption">
                {api_result.get()?.software}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>


        </List>
      </Paper>
    </Stack>

  </div>))
}