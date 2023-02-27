import { useNavigate } from "react-router-dom";
import { useObserver } from 'react-solid-state';

import { Define } from '../utils';

import LanIcon from '@mui/icons-material/LanOutlined';
import ClientsIcon from '@mui/icons-material/DevicesOther';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import MailIcon from '@mui/icons-material/MailRounded';
import MouseIcon from '@mui/icons-material/Mouse';
import PinIcon from '@mui/icons-material/Pin';
import PolicyIcon from '@mui/icons-material/Policy';
import PolylineIcon from '@mui/icons-material/Polyline';
import RouteIcon from '@mui/icons-material/Route';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import SystemIcon from '@mui/icons-material/RouterOutlined';
import SimCardIcon from '@mui/icons-material/CellTowerOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import WifiIcon from '@mui/icons-material/Wifi';
import { BottomNavigation, BottomNavigationAction, Box, IconButton, Menu, MenuItem, Paper } from '@mui/material';

import { MenuOpenOutlined } from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';

const subMenuSettings = [
  { text: 'WiFi', value: "wifi", icon: <WifiIcon color="primary" /> },
  { text: 'Network', value: "network", icon: <LanIcon color="primary" /> },
  { text: 'SIM', value: "sim", icon: <SimCardIcon color="primary" /> },
  { text: 'System', value: "system", icon: <SystemIcon color="primary" /> },
  { text: 'About', value: "about", icon: <InfoIcon color="primary" /> },
];

export default props => {
  /*********constants**********/
  const navigate = useNavigate()
  const menuActiveIndex = Define(-1)
  const menuOpenState = Define(false)
  const menuAnchor = Define(null)
  const subMenuList = Define([])
  const mainMenuOpen = Define(false)

  const menuMetaData = [
    { title: 'DashBoard', value: `/`, icon: <SpeedIcon color="info" /> },
    { title: 'Clients', value: `clients`, icon: <ClientsIcon color="info" /> },
    { title: 'SMS', value: `sms`, icon: <MailIcon color="info" /> },
    // { title: 'Call', value: `about`, icon: <CallIcon color="info" /> },
    { title: 'Settings', value: `settings`, icon: <SettingsIcon color="info" /> },
  ]
  /*********functions**********/
  const trick = (e, uri) => uri && navigate(uri)

  const onChangeBottomNav = (event, activeIndex) => {
    menuActiveIndex.set(activeIndex)

    if (menuMetaData[activeIndex].value === `settings`) {
      subMenuList.set(subMenuSettings)

      menuAnchor.set(_ => event.currentTarget)
      menuOpenState.set(true)
    } else {
      navigate(menuMetaData[activeIndex].value)
    }

  }

  const onMenuItemClose = (e, uri) => {
    uri && navigate(`settings`)
    uri && props.store[1]({ ...props.store[0], tabValue: uri })
    menuOpenState.set(false)
  }

  /*********styles**********/
  const sx_bottom = {
    display: { md: "none" },
    "& .MuiBottomNavigation-root": {
      height: "4rem",
    },
    "& .MuiBottomNavigationAction-root": {
      minWidth: "auto",
    },
    "& .MuiBottomNavigationAction-root, svg": {
      // color: "#000"
    },
    "& .MuiBottomNavigationAction-root .Mui-selected,.Mui-selected svg": {
      color: "#1976d2"
    }, position: 'fixed', bottom: 0, left: 0, right: 0,
  }

  const sx_drawer = {
    position: 'fixed',
    display: { xs: "none", md: "flex" },
    width: '4vw',
    flexShrink: 0,
    overflowX: 'hidden',
    transition: 'width 225ms ease-in-out 0ms',
    '& .MuiDrawer-paper': {
      overflowX: 'hidden',
      position: 'static',
      height: '95vh',
      // backgroundColor: "rgba(0,255,255,0.1)",
      // boxSizing: 'border-box',
      width: '4vw',
      transition: 'width 225ms ease-in-out 0ms',
      ...(mainMenuOpen.get() && {
        width: '12vw',
      }),
      ...(!mainMenuOpen.get() && {
        width: '4vw',
      })
    },
    ...(mainMenuOpen.get() && {
      width: '12vw',
    }),
    ...(!mainMenuOpen.get() && {
      width: '4vw',
    })
  }

  /*********component**********/
  return useObserver(() => <Box>

    <Drawer sx={sx_drawer} variant='permanent' anchor="left" open={mainMenuOpen.get()}>
      <Divider />
      <Toolbar variant="dense" sx={{ minHeight: 0, height: "5vh", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <IconButton onClick={() => { mainMenuOpen.set(!mainMenuOpen.get()) }}>
          {mainMenuOpen.get() ? <MenuOpenOutlined /> : <MenuOpenOutlined sx={{ transform: `rotateY(180deg)` }} />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
        {menuMetaData.map((itemMenu, index) => (
          <ListItem key={index} disablePadding sx={{ width: mainMenuOpen.get() ? '100%' : 'auto' }}>
            <ListItemButton onClick={e => trick(e, itemMenu.value)}>
              <ListItemIcon sx={{ my: 1, minWidth: 0, mr: mainMenuOpen.get() ? 2 : 1, ml: 1 }}>
                {itemMenu.icon}
              </ListItemIcon>
              <ListItemText primary={itemMenu.title} sx={{ display: mainMenuOpen.get() ? 'flex' : 'none' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>

    <Paper className="cc-BottomNavigation" sx={sx_bottom} elevation={3}>
      <BottomNavigation value={menuActiveIndex.get()} showLabels onChange={onChangeBottomNav}>
        {menuMetaData.map((itemMenu, index) => (
          <BottomNavigationAction label={itemMenu.title} icon={itemMenu.icon} />
        ))}
      </BottomNavigation>
    </Paper>

    <Menu onBlur={() => onMenuItemClose()} id="basic-menu" anchorEl={menuAnchor.get()} open={menuOpenState.get()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}>
      {subMenuList.get()?.map((item, index) => (
        <MenuItem key={index} onClick={e => onMenuItemClose(e, item.value)}>
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText>
            {item.text}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>

  </Box>)
}