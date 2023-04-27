import { createEffect, useObserver } from 'react-solid-state';

import { AccountCircleRounded, CheckCircle, CloseRounded, VpnKeyRounded } from '@mui/icons-material';
import { Box, Button, DialogActions, DialogContentText, FormControl, InputAdornment, InputLabel, List, ListItem, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import 'animate.css';
import cookie from 'cookie';
import { useNavigate } from 'react-router-dom';
import { Define, fetching, FormBuilder, webcmd } from './utils';


export default () => {
  /*********constants**********/
  const modalOpen = Define(false)
  const navigate = useNavigate()
  const username = Define(`root`)
  const password = Define("123456")

  /*********createEffect**********/
  createEffect(async () => {

    //this part is fucked   to be defined
    if (sessionStorage.getItem('sid') == null)
      sessionStorage.setItem('sid', cookie.parse(document.cookie).sysauth)

    //If no need login, close login modal
    await webcmd(`hello`).then(res => {
      if (res.code !== 200) {
        console.log(`login result msg = ${res.msg}`)
        modalOpen.set(true)
      }
    })

  })

  /*********functions**********/
  const onSubmit = async () => {
    const form = {
      "luci_username": username.get(), "luci_password": password.get(),
    }

    await fetching(FormBuilder(form), 'login')
      .then(_ => sessionStorage.setItem('sid', cookie.parse(document.cookie).sysauth))
      .then(_ => {
        // Access to command denied by ACL????????????????
        window.location.reload()
        // modalOpen.set(false)
        // navigate('/')
      })
  }

  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Dialog open={modalOpen.get()}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>

        <List>
          <ListItem>
            <TextField fullWidth label="Username" variant="outlined" size="small" value={username.get()} onChange={e => username.set(e.target.value)} InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <AccountCircleRounded />
                </InputAdornment>
            }} />
          </ListItem>
          <ListItem>
            <TextField fullWidth label="Password" variant="outlined" size="small" value={password.get()} onChange={e => password.set(e.target.value)} InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <VpnKeyRounded />
                </InputAdornment>
            }} />
          </ListItem>
        </List>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => modalOpen.set(false)} color="info" startIcon={<CloseRounded />} variant="outlined" size="small">Close</Button>
        <Button onClick={onSubmit} color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained" size="small">Enter</Button>
      </DialogActions>
    </Dialog>

  </div >))
}