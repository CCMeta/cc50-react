import { useNavigate } from "react-router-dom";
import { useObserver } from 'react-solid-state';

import { Define } from '../utils';

import CallIcon from '@mui/icons-material/Call';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import SpeedIcon from '@mui/icons-material/Speed';
import MouseIcon from '@mui/icons-material/Mouse';
import PinIcon from '@mui/icons-material/Pin';
import PolicyIcon from '@mui/icons-material/Policy';
import PolylineIcon from '@mui/icons-material/Polyline';
import MailIcon from '@mui/icons-material/Mail';
import RouteIcon from '@mui/icons-material/Route';
import SettingsIcon from '@mui/icons-material/Settings';
import SimCardIcon from '@mui/icons-material/SimCardOutlined';
import ClientsIcon from '@mui/icons-material/DevicesOther';
import { BottomNavigation, BottomNavigationAction, IconButton, Menu, MenuItem, Paper } from '@mui/material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';


const subMenu1 = [
  // { text: 'GPRS', value: "gprs", icon: "friends" },
  // { text: 'APN', value: "apn", icon: "friends" },
  { text: 'SIM', value: "sim", icon: <SimCardIcon color="primary" /> },
];
const subMenu2 = [
  { text: 'WIFI', value: "wifi", icon: <RouteIcon color="primary" /> },
  { text: 'DHCP', value: "dhcp", icon: <PolylineIcon color="primary" /> },
  // { text: 'Client', value: "client", icon: "friends" },
];
const subMenu3 = [
  { text: 'Protection', value: "protection", icon: <PolicyIcon color="primary" /> },
  { text: 'PIN', value: "pin", icon: <PinIcon color="primary" /> },
];
const subMenu4 = [
  // { text: 'Inbox', value: "inbox", icon: "friends" },
];
const subMenu5 = [
  // { text: 'NetworkInfo', value: "network_info", icon: <InfoIcon color="primary" /> },
  // { text: 'SIM_Info', value: "sim_info", icon: <InfoIcon color="primary" /> },
  { text: 'DeviceInfo', value: "device_info", icon: <InfoIcon color="primary" /> },
  { text: 'Operation', value: "operation", icon: <MouseIcon color="primary" /> },
  // { text: 'Update', value: "update", icon: "friends" },
  { text: 'Password', value: "password", icon: <KeyIcon color="primary" /> },
];
const subMenusMap = [subMenu1, subMenu2, subMenu3, subMenu4, subMenu5]

export default () => {
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
    { title: 'SMS', value: `about`, icon: <MailIcon color="info" /> },
    { title: 'Call', value: `about`, icon: <CallIcon color="info" /> },
    { title: 'Settings', value: `settings`, icon: <SettingsIcon color="info" /> },
  ]
  /*********functions**********/
  const trick = (e, uri) => uri && navigate(uri)

  const onChangeBottomNav = (event, activeIndex) => {

    subMenuList.set(subMenusMap[activeIndex])

    menuActiveIndex.set(activeIndex)
    menuAnchor.set(_ => event.currentTarget)
    menuOpenState.set(true)
  }

  const onMenuItemClose = (e, uri) => {
    uri && navigate(uri)
    menuOpenState.set(false)
  }

  /*********styles**********/
  const sx_bottom = {
    display: { md: "none" },
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
    display: { xs: "none", md: "flex" },
    width: '4vw',
    flexShrink: 0,
    overflowX: 'hidden',
    transition: 'width 225ms ease-in-out 0ms',
    '& .MuiDrawer-paper': {
      overflowX: 'hidden',
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
  return useObserver(() => <div>

    <Drawer sx={sx_drawer} variant='permanent' anchor="left" open={mainMenuOpen.get()}>
      <Toolbar variant="dense" sx={{ minHeight: 0, height: "5vh", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <IconButton onClick={() => { mainMenuOpen.set(!mainMenuOpen.get()) }}>
          {mainMenuOpen.get() ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuMetaData.map((itemMenu, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={e => trick(e, itemMenu.value)}>
              <ListItemIcon>
                {itemMenu.icon}
              </ListItemIcon>
              <ListItemText primary={itemMenu.title} sx={{ opacity: mainMenuOpen.get() ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>

    <Paper className="cc-BottomNavigation" sx={sx_bottom} elevation={3}>
      <BottomNavigation value={menuActiveIndex.get()} showLabels onChange={onChangeBottomNav}>
        <BottomNavigationAction label="WAN" icon={<SpeedIcon />} />
        <BottomNavigationAction label="LAN" icon={<ClientsIcon />} />
        <BottomNavigationAction label="Security" icon={<MailIcon />} />
        <BottomNavigationAction label="SMS" icon={<CallIcon />} />
        <BottomNavigationAction label="System" icon={<SettingsIcon />} />
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

  </div>)
}