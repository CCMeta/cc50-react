import React, { Suspense } from 'react'
import { Routes, Route } from "react-router-dom"
import { useObserver } from 'react-solid-state'

import { Define } from './p/utils'
import './App.css';
import IndexPage from './p/Index';
// import AboutPage from './p/About';

import Button from '@mui/material/Button'
import { Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Link } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AboutPage = React.lazy(() => import('./p/About'));

const App = () => {
  /*********constants**********/

  const menuActiveIndex = Define(-1)
  const menuOpenState = Define(false)
  const menuAnchor = Define(null)

  /*********functions**********/
  const onChangeBottomNav = (event, newValue) => {
    menuActiveIndex.set(newValue)
    menuAnchor.set(_ => event.currentTarget)
    menuOpenState.set(true)

    console.log(menuActiveIndex.get())

  }

  const onMenuItemClose = _ => menuOpenState.set(false)

  /*********styles**********/
  const sx = {
    "& .MuiBottomNavigationAction-root, svg": {
      color: "#000"
    },
    "& .MuiBottomNavigationAction-root .Mui-selected,.Mui-selected svg": {
      color: "#ba000d"
    }, position: 'fixed', bottom: 0, left: 0, right: 0,
  }

  /*********component**********/
  return useObserver(() => (<div className="App">

    <Suspense>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="about" element={<AboutPage />} />
      </Routes>
    </Suspense>

    <Paper sx={sx} elevation={3}>
      <BottomNavigation value={menuActiveIndex.get()} showLabels onChange={onChangeBottomNav}>
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Archive" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Paper>
    <Menu onBlur={onMenuItemClose} id="basic-menu" anchorEl={menuAnchor.get()} open={menuOpenState.get()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}  >
      <MenuItem onClick={onMenuItemClose}>Profile</MenuItem>
      <MenuItem onClick={onMenuItemClose}>My account</MenuItem>
      <MenuItem onClick={onMenuItemClose}>Logout</MenuItem>
    </Menu>

  </div>))
}
export default App
