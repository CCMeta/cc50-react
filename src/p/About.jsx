import { useObserver, createEffect, } from 'react-solid-state'
import { Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline } from '@mui/material'
import { Link } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import css from '../s/About.module.css'
import 'animate.css';
import { fetching, Define } from './utils'


export default () => {
  /*********constants**********/
  const testData = Define({})
  createEffect(async () => {
    testData.set(await fetching(`connected_devices=1&`))
    console.log(testData.get())
  })
  /*********functions**********/

  /*********styles**********/
  console.log(css)
  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          AboutPage
        </Typography>
      </Toolbar>
    </AppBar>
    <CssBaseline />

    <Stack sx={{ pb: 7 }} spacing={2}>
      <Link to="/">Index</Link>
      <Link to="about">About</Link>
      {testData.get().devices?.map((item, index) => (<div key={index}>
        {item.hostName}{item.mac_addr}
      </div>))}
    </Stack>

  </div>))
}