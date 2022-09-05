import { AppBar, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';


import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'animate.css';


export default () => {
  /*********constants**********/

  /*********createEffect**********/
  createEffect(async () => {
  })

  /*********functions**********/

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Clients
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ p: 2 }} spacing={2}>
    </Stack>


  </div >))
}