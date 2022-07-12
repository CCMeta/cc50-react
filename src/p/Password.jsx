import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, AppBar, Typography, Toolbar, IconButton, TextField } from '@mui/material'

import { createEffect, useObserver } from 'react-solid-state';
import { Define, fetching } from './utils';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default _ => {
  /*********constants**********/
  const login_password = Define('')
  const password = Define('')
  const newPassword = Define('')
  const newPasswordConfirm = Define('')

  /*********createEffect**********/
  createEffect(async () => {
  })

  const onSubmit = async () => {
    const form = {
      'password': password.get(),
      'newPassword': newPassword.get(),
    }
    return console.log(form)
    const result = await fetching('login_password=' + JSON.stringify(form) + '&')
    if (!result || result?.result != 'ok') {
      return
    }
  }
  /*********functions**********/
  const onPasswordChange = e => password.set(e.target.value)
  const onNewPasswordChange = e => newPassword.set(e.target.value)
  const onNewPasswordConfirmChange = e => newPasswordConfirm.set(e.target.value)

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div>

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Password Page
        </Typography>
      </Toolbar>
    </AppBar>

    <List sx={{ width: '100%', bgcolor: 'background.paper' }} >
      <ListItem>
        <TextField value={password.get()} onChange={onPasswordChange} fullWidth label="password" variant="standard" />
      </ListItem>
      <ListItem>
        <TextField value={newPassword.get()} onChange={onNewPasswordChange} fullWidth label="newPassword" variant="standard" />
      </ListItem>
      <ListItem>
        <TextField value={newPasswordConfirm.get()} onChange={onNewPasswordConfirmChange} fullWidth label="newPasswordConfirm" variant="standard" />
      </ListItem>
    </List>
    <br />
    <Button onClick={onSubmit} size='large' color="error" fullWidth variant="contained" disableElevation>Save</Button>

  </div>))
}