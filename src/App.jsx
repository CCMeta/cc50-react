import React, { Suspense } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom"
import { useObserver } from 'react-solid-state'

import { Define } from './p/utils'
import './App.css';
import IndexPage from './p/Index';
// import AboutPage from './p/About';

import Button from '@mui/material/Button'
import { Paper, BottomNavigation, BottomNavigationAction, Menu, MenuItem, Link, CssBaseline, ListItemText, ListItemIcon } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import WifiIcon from '@mui/icons-material/Wifi'
import ShieldIcon from '@mui/icons-material/HealthAndSafety'
import SettingsIcon from '@mui/icons-material/Settings'
import CloudIcon from '@mui/icons-material/CloudOutlined'

const AboutPage = React.lazy(() => import('./p/About'));

const App = () => {
  /*********constants**********/
  let navigate = useNavigate()
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

  const onMenuItemClose = (e, uri) => {
    e && console.log(e.currentTarget)
    uri && navigate(uri)
    menuOpenState.set(false)
  }

  /*********styles**********/
  const sx = {
    "& .MuiBottomNavigationAction-root, svg": {
      color: "#000"
    },
    "& .MuiBottomNavigationAction-root .Mui-selected,.Mui-selected svg": {
      color: "#1976d2"
    }, position: 'fixed', bottom: 0, left: 0, right: 0,
  }

  /*********component**********/
  return useObserver(() => (<div className="App">
    <CssBaseline />
    <Suspense>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="about" element={<AboutPage />} />
      </Routes>
    </Suspense>

    <Paper sx={sx} elevation={3}>
      <BottomNavigation value={menuActiveIndex.get()} showLabels onChange={onChangeBottomNav}>
        <BottomNavigationAction label="WAN" icon={<LanguageIcon />} />
        <BottomNavigationAction label="LAN" icon={<WifiIcon />} />
        <BottomNavigationAction label="Security" icon={<RestoreIcon />} />
        <BottomNavigationAction label="SMS" icon={<ShieldIcon />} />
        <BottomNavigationAction label="System" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>

    <Menu onBlur={() => onMenuItemClose()} id="basic-menu" anchorEl={menuAnchor.get()} open={menuOpenState.get()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}  >
      <MenuItem onClick={e => onMenuItemClose(e, `dhcp`)}>
        <ListItemIcon>
          <CloudIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          DHCP
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={e => onMenuItemClose(e, `wifi`)}>
        <ListItemIcon>
          <CloudIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          WiFi
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={e => onMenuItemClose(e, `sim`)}>
        <ListItemIcon>
          <CloudIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          SIM
        </ListItemText>
      </MenuItem>
    </Menu>

  </div>))
}
export default App
