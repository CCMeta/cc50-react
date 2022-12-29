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

    <Stack>
    </Stack>

  </div >))
}