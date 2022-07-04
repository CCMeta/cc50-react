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
import { styled } from "@mui/material/styles";


export default _ => {

  const menuActiveIndex = Define(0)
  const menuOpenState = Define(false)
  const menuAnchor = Define(null)

  const onClick = _ => _

  const onChangeBottomNav = (event, newValue) => {
    menuActiveIndex.set(newValue)
    menuAnchor.set(_ => event.currentTarget)
    menuOpenState.set(true)

    console.log(menuActiveIndex.get())
  }

  const onMenuItemClose = _ => menuOpenState.set(false)

  const sx = {
    "& .MuiBottomNavigationAction-root, svg": {
      color: "#000"
    },
    "& .MuiBottomNavigationAction-root .Mui-selected,.Mui-selected svg": {
      color: "#ba000d"
    }, position: 'fixed', bottom: 0, left: 0, right: 0,
  }

  return useObserver(() => (<div className="App">


    <Menu onBlur={onMenuItemClose} id="basic-menu" anchorEl={menuAnchor.get()} open={menuOpenState.get()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}  >
      <MenuItem onClick={onMenuItemClose}>Profile</MenuItem>
      <MenuItem onClick={onMenuItemClose}>My account</MenuItem>
      <MenuItem onClick={onMenuItemClose}>Logout</MenuItem>
    </Menu>


    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p> {menuActiveIndex.get()} </p>
      <Button onClick={onClick} variant="contained">你好，世界</Button>
    </header>

    <Paper sx={sx} elevation={3}>
      <BottomNavigation value={menuActiveIndex.get()} showLabels onChange={onChangeBottomNav}>
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Archive" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Paper>


  </div>))
}

