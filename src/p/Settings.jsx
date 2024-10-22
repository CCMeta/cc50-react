import {
  Box, Divider, Stack, Tab, Tabs
} from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import LanIcon from '@mui/icons-material/LanOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/LanguageOutlined';
import SystemIcon from '@mui/icons-material/RouterOutlined';
import SecurityIcon from '@mui/icons-material/ShieldOutlined';
import SimCardIcon from '@mui/icons-material/CellTowerOutlined';
import WifiIcon from '@mui/icons-material/Wifi';

import 'animate.css';
import * as React from 'react';
import { Define, rpc } from './utils';

import HeaderBar from './c/HeaderBar';
import SettingsAbout from './SettingsAbout';
import SettingsInternet from './SettingsInternet';
import SettingsNetwork from './SettingsNetwork';
import SettingsSIM from './SettingsSIM';
import SettingsSystem from './SettingsSystem';
import SettingsWiFi from './SettingsWiFi';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box hidden={value !== index} {...other}>
      {children}
    </Box>
  )
}

export default props => {
  /*********constants**********/
  //定义动态变量
  const tabValue = Define(props.store[0].tabValue);

  /*********createEffect**********/
  createEffect(async () => {

    // const fuck = rpc.post(`file`, `exec`, { "command": "ls" }, `ubus`)
    // console.log(fuck)

  })

  /*********functions**********/

  /*********styles**********/
  const sx_nav_btn = {
    borderRight: 1,
    borderColor: 'divider',
    height: "calc(100vh - 5vh)",
    "& .MuiButtonBase-root.MuiTab-root": {
      margin: 1,
      borderRadius: 2,
      minHeight: 0,
      justifyContent: "left",
      textTransform: `none`,
    },
    "& .MuiButtonBase-root.MuiTab-root.Mui-selected": {
      color: "#fff",
      backgroundImage: "linear-gradient(to right, rgb(47, 128, 237), rgb(86, 204, 242))"
    }
  }

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      <Stack sx={{ display: { xs: "none", md: "flex" }, flexBasis: 0, flexGrow: 1 }}>
        <Tabs orientation="vertical" variant="scrollable" value={props.store[0].tabValue} onChange={(e, v) => props.store[1]({ ...props.store[0], tabValue: v })} sx={sx_nav_btn}>
          <Tab label="WiFi" icon={<WifiIcon />} iconPosition="start" value="wifi" />
          <Tab label="Network" icon={<LanIcon />} iconPosition="start" value="network" />
          {/* <Tab disabled label="Internet" icon={<LanguageIcon />} iconPosition="start" value="internet" /> */}
          <Tab label="SIM" icon={<SimCardIcon />} iconPosition="start" value="sim" />
          {/* <Divider /> */}
          {/* <Tab disabled label="Security" icon={<SecurityIcon />} iconPosition="start" value="security" /> */}
          <Divider />
          {/* <Tab label="Accounts" icon={<ManageAccountsIcon />} iconPosition="start" value="accounts" /> */}
          <Tab label="System" icon={<SystemIcon />} iconPosition="start" value="system" />
          <Tab label="About" icon={<InfoIcon />} iconPosition="start" value="about" />
        </Tabs>
      </Stack>
      {/* Tabs */}

      <Stack sx={{ flexBasis: 0, flexGrow: 4, height: `95vh`, overflowY: `scroll` }}>
        <Box sx={{ mb: { xs: "5rem", md: '5rem' }, px: { xs: "1rem", md: '7rem' }, maxWidth: "100vw" }}>
          <TabPanel value={props.store[0].tabValue} index="wifi">
            <SettingsWiFi />
          </TabPanel>
          <TabPanel value={props.store[0].tabValue} index="network">
            <SettingsNetwork />
          </TabPanel>
          <TabPanel value={props.store[0].tabValue} index="internet">
            <SettingsInternet />
          </TabPanel>
          <TabPanel value={props.store[0].tabValue} index="sim">
            <SettingsSIM />
          </TabPanel>
          <TabPanel value={props.store[0].tabValue} index="system">
            <SettingsSystem />
          </TabPanel>
          <TabPanel value={props.store[0].tabValue} index="about">
            <SettingsAbout />
          </TabPanel>
        </Box>
      </Stack>
      {/* content */}

    </Stack>
  </div >))
}


