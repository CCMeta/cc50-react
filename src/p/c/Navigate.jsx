import { useNavigate } from "react-router-dom";
import { useObserver } from 'react-solid-state';

import { Define } from '../utils';

import ShieldIcon from '@mui/icons-material/HealthAndSafety';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import LanguageIcon from '@mui/icons-material/Language';
import MouseIcon from '@mui/icons-material/Mouse';
import PinIcon from '@mui/icons-material/Pin';
import PolicyIcon from '@mui/icons-material/Policy';
import PolylineIcon from '@mui/icons-material/Polyline';
import RestoreIcon from '@mui/icons-material/Restore';
import RouteIcon from '@mui/icons-material/Route';
import SettingsIcon from '@mui/icons-material/Settings';
import SimCardIcon from '@mui/icons-material/SimCardOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import { BottomNavigation, BottomNavigationAction, Menu, MenuItem, Paper } from '@mui/material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import StarBorder from '@mui/icons-material/StarBorder';
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
  { text: 'Device', value: "device", icon: <InfoIcon color="primary" /> },
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

  const isOpen1 = Define(false)
  const isOpen2 = Define(false)
  const isOpen3 = Define(false)
  const isOpen4 = Define(false)
  const isOpen5 = Define(false)
  const subMenusOpenMap = [isOpen1, isOpen2, isOpen3, isOpen4, isOpen5]

  const menuMetaData = [
    { title: 'WAN', icon: <LanguageIcon color="primary" /> },
    { title: 'LAN', icon: <WifiIcon color="primary" /> },
    { title: 'SECURITY', icon: <ShieldIcon color="primary" /> },
    { title: 'SMS', icon: <RestoreIcon color="primary" /> },
    { title: 'SYSTEM', icon: <SettingsIcon color="primary" /> },
  ]
  /*********functions**********/
  const trick = () => eval("console.log(`shit`)")

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
      minWidth: "auto"
    },
    "& .MuiBottomNavigationAction-root, svg": {
      color: "#000"
    },
    "& .MuiBottomNavigationAction-root .Mui-selected,.Mui-selected svg": {
      color: "#1976d2"
    }, position: 'fixed', bottom: 0, left: 0, right: 0,
  }

  const sx_drawer = {
    display: { xs: "none", md: "flex" },
    width: 200,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      backgroundColor: "rgba(255,255,255,0.6)",
      width: 200,
      boxSizing: 'border-box',
    },
  }

  /*********component**********/
  return useObserver(() => <div>

    <Drawer
      sx={sx_drawer}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      {menuMetaData.map((itemMenu, index) => (
        <List key={index}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => subMenusOpenMap[index].set(v => !v)}>
              <ListItemIcon>
                {itemMenu.icon}
              </ListItemIcon>
              <ListItemText primary={itemMenu.title} />
              {subMenusOpenMap[index].get() ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={subMenusOpenMap[index].get()} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {subMenusMap[index].map((item, item_index) => (
                <ListItemButton onClick={e => onMenuItemClose(e, item.value)} key={item_index} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

        </List>
      ))}

    </Drawer>

    <Paper className="cc-BottomNavigation" sx={sx_bottom} elevation={3}>
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