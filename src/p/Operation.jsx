import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppBar, Button, Card, CardActions, CardContent, Paper, IconButton, Link, Stack, Toolbar, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';
import { Define, fetching } from './utils';

export default _ => {
  /*********constants**********/

  /*********createEffect**********/
  createEffect(async () => {
  })

  const onRestoreSubmit = async () => {
    const form = {
      reset_factory: 1,
    }
    return console.log(form)
    const result = await fetching('reset_factory=' + form.reset_factory + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }
  const onRestartSubmit = async () => {
    const form = {
      restart: 1,
    }
    return console.log(form)
    const result = await fetching('restart=' + form.restart + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }
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
          Operation Page
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ p: 2 }} spacing={2}>

      <Paper elevation={6}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="body1" color="error">
              Click the button below to restore device to its factory setting
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={onRestoreSubmit} color="warning" variant="contained" fullWidth>Restore Now</Button>
          </CardActions>
        </Card>
      </Paper>

      <Paper elevation={6}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="body1" color="error">
              Click the button below to restart the device
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={onRestartSubmit} color="warning" variant="contained" fullWidth>Restart Now</Button>
          </CardActions>
        </Card>
      </Paper>

    </Stack>

  </div>))
}