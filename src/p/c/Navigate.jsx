import { useNavigate } from "react-router-dom";
import { useObserver } from 'react-solid-state';

import { Define } from '../utils';

import CloudIcon from '@mui/icons-material/CloudOutlined';
import ShieldIcon from '@mui/icons-material/HealthAndSafety';
import LanguageIcon from '@mui/icons-material/Language';
import RestoreIcon from '@mui/icons-material/Restore';
import SettingsIcon from '@mui/icons-material/Settings';
import WifiIcon from '@mui/icons-material/Wifi';
import { BottomNavigation, BottomNavigationAction, ListItemIcon, ListItemText, Menu, MenuItem, Paper } from '@mui/material';

const subMenu1 = [
  // { text: 'GPRS', value: "gprs", icon: "friends" },
  // { text: 'APN', value: "apn", icon: "friends" },
  { text: 'SIM', value: "sim", icon: "friends" },
];
const subMenu2 = [
  { text: 'WIFI', value: "wifi", icon: "friends" },
  { text: 'DHCP', value: "dhcp", icon: "friends" },
  // { text: 'Client', value: "client", icon: "friends" },
];
const subMenu3 = [
  { text: 'Protection', value: "protection", icon: "friends" },
  { text: 'PIN', value: "pin", icon: "friends" },
];
const subMenu4 = [
  { text: 'Inbox', value: "inbox", icon: "friends" },
];
const subMenu5 = [
  { text: 'Device', value: "device", icon: "friends" },
  { text: 'Manage', value: "manage", icon: "friends" },
  // { text: 'Update', value: "update", icon: "friends" },
  { text: 'Password', value: "password", icon: "friends" },
];
const subMenusMap = [subMenu1, subMenu2, subMenu3, subMenu4, subMenu5]

export default () => {
  /*********constants**********/
  const navigate = useNavigate()
  const menuActiveIndex = Define(-1)
  const menuOpenState = Define(false)
  const menuAnchor = Define(null)
  const subMenuList = Define([])

  /*********functions**********/
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
  const sx = {
    "& .MuiBottomNavigationAction-root, svg": {
      color: "#000"
    },
    "& .MuiBottomNavigationAction-root .Mui-selected,.Mui-selected svg": {
      color: "#1976d2"
    }, position: 'fixed', bottom: 0, left: 0, right: 0,
  }

  /*********component**********/
  return useObserver(() => <div>

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
      {subMenuList.get()?.map((item, index) => (
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

  </div>)
}