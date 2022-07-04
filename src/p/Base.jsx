import { useObserver } from 'react-solid-state'
import { Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline, Link } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../s/Index.css'

export default _ => {
  /*********constants**********/

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
          BasePage
        </Typography>
      </Toolbar>
    </AppBar>
    <CssBaseline />
    <Stack sx={{ pb: 7 }} spacing={2}>
      <Link href="/">Index</Link>
      <Link href="/about">About</Link>
    </Stack>

  </div>))
}