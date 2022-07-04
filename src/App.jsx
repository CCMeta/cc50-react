import logo from './logo.svg';
import './App.css';
import React from 'react'
import { useObserver } from 'react-solid-state'

import { Define } from './utils'

import Button from '@mui/material/Button'
import { Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default _ => {
  const fuck = Define(0)
  const open = Define(false)
  const anchor = Define(null)

  const onClick = () => {
    fuck.set(fuck.get() + 2)
    console.log(fuck.get())
  }
  const onChangeBottomNav = (event, newValue) => {
    fuck.set(newValue)
    open.set(true)

    anchor.set(_ => event.currentTarget)

    console.log(fuck.get())
  }

  const onMenuItemClose = _ => open.set(false)

  return useObserver(() => (
    <div className="App">

      <Menu id="basic-menu" anchorEl={anchor.get()} open={open.get()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}  >
        <MenuItem onClick={onMenuItemClose}>Profile</MenuItem>
        <MenuItem onClick={onMenuItemClose}>My account</MenuItem>
        <MenuItem onClick={onMenuItemClose}>Logout</MenuItem>
      </Menu>


      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p> {fuck.get()} </p>
        <Button onClick={onClick} variant="contained">你好，世界</Button>
      </header>



      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels onChange={onChangeBottomNav}>
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />}>

          </BottomNavigationAction>
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Archive" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Paper>

    </div>)
  )
}

