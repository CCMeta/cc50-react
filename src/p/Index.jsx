import { useObserver } from 'react-solid-state'
import { Stack, AppBar, Typography, Toolbar, IconButton, CssBaseline } from '@mui/material'
import { Link } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../s/Index.module.css'
import 'animate.css';

export default () => {
  /*********constants**********/

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
          IndexPage
        </Typography>
      </Toolbar>
    </AppBar>
    <Stack sx={{ pb: 7 }} spacing={2}>
      <Link to="/">Index</Link>
      <Link to="/about">About</Link>
      <h1>fuck</h1>
    </Stack>

  </div>))
}