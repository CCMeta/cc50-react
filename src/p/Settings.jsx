import { AppBar, Divider, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'animate.css';


export default () => {
  /*********constants**********/
  
  /*********createEffect**********/
  createEffect(async () => {

    // setInterval api below 
    const interval_apis = async () => {

      return interval_apis
    }
    setInterval(await interval_apis(), 2000);

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
          {`Setting`}
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      <Stack sx={{ flexBasis: 0, flexGrow: 1 }}></Stack>
      <Stack className='styled-scrollbars' height={`calc(100vh - 64px)`} sx={{ flexBasis: 0, flexGrow: 4 }}>
      </Stack>

    </Stack>


  </div >))
}