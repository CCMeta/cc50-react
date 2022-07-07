import React, { Suspense } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom"
import { useObserver } from 'react-solid-state'

import { Define } from './p/utils'
import './App.css';
import IndexPage from './p/Index';
import AboutPage from './p/About';
import WiFiPage from './p/WiFi';
import SIMPage from './p/SIM';
import DHCPPage from './p/DHCP';
import ProtectionPage from './p/Protection';

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

const App = () => {
  /*********constants**********/
  let navigate = useNavigate()
  const menuActiveIndex = Define(-1)
  const menuOpenState = Define(false)
  const menuAnchor = Define(null)
  const popverList = Define([])

  /*********functions**********/
  const onChangeBottomNav = (event, activeIndex) => {

    const action1 = [
      // { text: 'GPRS', value: "gprs", icon: "friends" },
      // { text: 'APN', value: "apn", icon: "friends" },
      { text: 'SIM', value: "sim", icon: "friends" },
    ];
    const action2 = [
      { text: 'WIFI', value: "wifi", icon: "friends" },
      { text: 'DHCP', value: "dhcp", icon: "friends" },
      // { text: 'Client', value: "client", icon: "friends" },
    ];
    const action3 = [
      { text: 'Protection', value: "protect", icon: "friends" },
      { text: 'PIN', value: "pin", icon: "friends" },
    ];
    const action4 = [
      { text: 'Inbox', value: "inbox", icon: "friends" },
    ];
    const action5 = [
      { text: 'Device', value: "device", icon: "friends" },
      { text: 'Manage', value: "manage", icon: "friends" },
      // { text: 'Update', value: "update", icon: "friends" },
      { text: 'Password', value: "password", icon: "friends" },
    ];
    const actions = [action1, action2, action3, action4, action5]
    popverList.set(actions[activeIndex])



    menuActiveIndex.set(activeIndex)
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

    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="wifi" element={<WiFiPage />} />
      <Route path="sim" element={<SIMPage />} />
      <Route path="dhcp" element={<DHCPPage />} />
      <Route path="protection" element={<ProtectionPage />} />
    </Routes>

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
      transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}>
      {popverList.get()?.map((item, index) => (
        <MenuItem key={index} onClick={e => onMenuItemClose(e, item.value)}>
          <ListItemIcon>
            <CloudIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {item.text}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>

  </div>))
}
export default App
