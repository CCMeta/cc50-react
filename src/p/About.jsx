import { useObserver, createEffect, } from 'react-solid-state'
import { Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Link } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../s/Index.css'
import { fetching, Define } from '../utils'


export default _ => {
  /*********constants**********/
  const testData = Define({})
  createEffect(async () => {
    testData.set(await fetching(`connected_devices=1&`))
    console.log(testData.get())
  })
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
          AboutPage
        </Typography>
      </Toolbar>
    </AppBar>
    <CssBaseline />
    <Stack sx={{ pb: 7 }} spacing={2}>
      <Link href="/">Index</Link>
      <Link href="/about">About</Link>
      {testData.get().devices?.map((item, index) => (<div key={index}>
        {item.hostName}{item.mac_addr}
      </div>))}
    </Stack>

  </div>))
}