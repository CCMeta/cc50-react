
import {
  AppBar, Box, Checkbox, Divider, IconButton, Stack, Tab, Tabs, Toolbar, Typography
} from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CastIcon from '@mui/icons-material/Cast';
import CopyrightIcon from '@mui/icons-material/Copyright';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccountsOutlined';
import LanguageIcon from '@mui/icons-material/LanguageOutlined';
import SecurityIcon from '@mui/icons-material/ShieldOutlined';
import SettingsIcon from '@mui/icons-material/RouterOutlined';
import SimCardIcon from '@mui/icons-material/SimCardOutlined';
import WifiIcon from '@mui/icons-material/Wifi';

import 'animate.css';
import * as React from 'react';
import { Define } from './utils';

import SettingsAbout from './SettingsAbout';
import SettingsInternet from './SettingsInternet';
import SettingsNetwork from './SettingsNetwork';
import SettingsSIM from './SettingsSIM';
import SettingsSystem from './SettingsSystem';
import SettingsWiFi from './SettingsWiFi';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box hidden={value !== index} {...other} sx={{ height: `100vh` }}>
      {children}
    </Box>
  )
}

export default () => {
  /*********constants**********/
  //定义动态变量
  const tabValue = Define(`wifi`);

  /*********createEffect**********/
  createEffect(async () => {

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

    <AppBar position="sticky">
      <Toolbar variant="dense" sx={{ minHeight: 0, height: "5vh" }}>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Settings
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      <Stack sx={{ display: { xs: "none", md: "flex" }, flexBasis: 0, flexGrow: 1 }}>
        <Tabs orientation="vertical" variant="scrollable" value={tabValue.get()} onChange={(e, v) => tabValue.set(v)} sx={sx_nav_btn}>
          <Tab label="WiFi" icon={<WifiIcon />} iconPosition="start" value="wifi" />
          <Tab label="Network" icon={<CastIcon />} iconPosition="start" value="network" />
          <Tab disabled label="Internet" icon={<LanguageIcon />} iconPosition="start" value="internet" />
          <Tab label="SIM" icon={<SimCardIcon />} iconPosition="start" value="sim" />
          <Divider />
          <Tab disabled label="Security" icon={<SecurityIcon />} iconPosition="start" value="security" />
          <Divider />
          {/* <Tab label="Accounts" icon={<ManageAccountsIcon />} iconPosition="start" value="accounts" /> */}
          <Tab label="System" icon={<SettingsIcon />} iconPosition="start" value="system" />
          <Tab label="About" icon={<InfoIcon />} iconPosition="start" value="about" />
        </Tabs>
      </Stack>
      {/* Tabs */}

      <Stack sx={{ flexBasis: 0, flexGrow: 4, height: `95vh`, overflowY: `scroll` }}>
        <Box sx={{ py: 5, px: 15, }}>
          <TabPanel value={tabValue.get()} index="wifi">
            <SettingsWiFi />
          </TabPanel>
          <TabPanel value={tabValue.get()} index="network">
            <SettingsNetwork />
          </TabPanel>
          <TabPanel value={tabValue.get()} index="internet">
            <SettingsInternet />
          </TabPanel>
          <TabPanel value={tabValue.get()} index="sim">
            <SettingsSIM />
          </TabPanel>
          <TabPanel value={tabValue.get()} index="security">
            <SettingsSIM />
          </TabPanel>
          <TabPanel value={tabValue.get()} index="system">
            <SettingsSystem />
          </TabPanel>
          <TabPanel value={tabValue.get()} index="about">
            <SettingsAbout />
          </TabPanel>
        </Box>
      </Stack>
      {/* content */}

    </Stack>
  </div >))
}