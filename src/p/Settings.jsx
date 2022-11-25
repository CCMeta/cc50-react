import { AppBar, Divider, IconButton, Stack, Toolbar, Typography, 
    Tabs, Tab, Box, FormGroup, FormControlLabel, Checkbox, TextField, Select, 
    MenuItem, Switch, Button  } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';
import WifiIcon from '@mui/icons-material/Wifi';
import CastIcon from '@mui/icons-material/Cast';
import WifiCalling3Icon from '@mui/icons-material/WifiCalling3';
import SmsIcon from '@mui/icons-material/Sms';
import SimCardIcon from '@mui/icons-material/SimCard';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';
import CopyrightIcon from '@mui/icons-material/Copyright';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PublicIcon from '@mui/icons-material/Public';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'animate.css';
import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import { bytesToHuman, Define, fetching, rpc as $rpc, secondsToWatch, FormBuilder } from './utils';

import SetWiFi from './SettingsWiFi'
import SetAbout from './SettingsAbout'
import SetSIM from './SettingsSIM'
import SetSystem from './SettingsSystem'
import SetInternet from './SettingsInternet'
import SetNetwork from './SettingsNetwork'

function BpCheckbox(props) {
    return (
      <Checkbox
        sx={{
          '&:hover': { bgcolor: 'transparent' },
        }}
        disableRipple
        inputProps={{ 'aria-label': 'Checkbox demo' }}
        {...props}
      />
    );
  }
  function Item(props) {
    const { children, ...other } = props;
    return (
      <Box
        sx={{height: "50px", lineHeight: "50px", mb: "5px", margin: "0 auto", fontSize: {xs:"15px", md:"1rem"}}}
        {...other}
      >
          <Box>
            <Stack>{children}</Stack>
          </Box>
      </Box>
    );
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3, width: {md: "70vw", xs:"100vw"} }}>
            <Stack>{children}</Stack>
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
      style: {width: "calc(20vw - 20px)"},
      value: index
    };
  }

export default () => {
  /*********constants**********/
  //定义动态变量
  const tabValue = Define(0);
  const TabChange = (event, newValue) => {
    tabValue.set(newValue)
  };

  /*********createEffect**********/
  createEffect(async () => {
    
  })
  /*********functions**********/

  /*********styles**********/
  const sx_nav_btn = {
    borderRight: 1, 
    borderColor: 'divider', 
    height: "calc(100vh - 80px)",
    "& .css-1h9z7r5-MuiButtonBase-root-MuiTab-root": {
      margin: "10px",
      borderRadius: "10px"
    },
    "& .css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected": {
        color: "#fff",
        // backgroundImage: "linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%)"
        backgroundImage: "linear-gradient(to right, rgb(86, 204, 242), rgb(47, 128, 237))"
    },
    "& .css-j7evbw-MuiButtonBase-root-MuiTab-root": {
      margin: "10px",
      borderRadius: "10px",
      minHeight: "48px",
      justifyContent: "left"
    },
    "& .css-j7evbw-MuiButtonBase-root-MuiTab-root.Mui-selected": {
        color: "#fff",
       // backgroundImage: "linear-gradient( 135deg, #72EDF2 10%, #5151E5 100%)"
        backgroundImage: "linear-gradient(to right, rgb(86, 204, 242), rgb(47, 128, 237))"
    }
  }

  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Settings
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      <Stack sx={{ flexBasis: 0, flexGrow: 1, width: "calc(100vw - 80px)" }} direction="row">
        <Stack direction="row" sx={{ pr: 2, pl: 2, height: "100%" ,display:{xs:"none",md:"block"}}}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue.get()}
                onChange={TabChange}
                aria-label="Vertical tabs example"
                sx={sx_nav_btn}
            >
                <Tab label="WiFi" icon={<WifiIcon />} iconPosition="start" {...a11yProps(0)} />
                <Tab label="Network" icon={<CastIcon />} iconPosition="start" {...a11yProps(1)} />
                <Tab label="Internet" icon={<PublicIcon />} iconPosition="start" {...a11yProps(2)} />
                <Tab label="SIM" icon={<SimCardIcon />} iconPosition="start" {...a11yProps(3)} />
                <Divider/>
                <Tab label="Security" icon={<SecurityIcon />} iconPosition="start"{...a11yProps(4)} />
                {/* <Tab label="VPN" icon={<WifiCalling3Icon />} iconPosition="start" {...a11yProps(5)} />
                <Tab label="SMS" icon={<SmsIcon />} iconPosition="start" {...a11yProps(6)} /> */}
                <Divider/>
                <Tab label="System" icon={<SettingsIcon />} iconPosition="start" {...a11yProps(7)} />
                <Tab label="About" icon={<InfoIcon />} iconPosition="start" {...a11yProps(8)} />
                <Tab label="Legals" icon={<CopyrightIcon />} iconPosition="start" {...a11yProps(9)} />
                <Tab label="Accounts" icon={<ManageAccountsIcon />} iconPosition="start" {...a11yProps(10)} />
            </Tabs>
        </Stack>
        <Stack direction="row">
            <TabPanel value={tabValue.get()} index={0}>
                <SetWiFi />
            </TabPanel>
            <TabPanel value={tabValue.get()} index={1}>
                <SetNetwork />
            </TabPanel>
            <TabPanel value={tabValue.get()} index={2}>
                <SetInternet/>
            </TabPanel>
            <TabPanel value={tabValue.get()} index={3}>
                <SetSIM/>
            </TabPanel>
            <TabPanel value={tabValue.get()} index={4}>
                Item Five
            </TabPanel>
            <TabPanel value={tabValue.get()} index={5}>
                Item Six
            </TabPanel>
            <TabPanel value={tabValue.get()} index={6}>

            </TabPanel>
            <TabPanel value={tabValue.get()} index={7}>
                <SetSystem/>
            </TabPanel>
            <TabPanel value={tabValue.get()} index={8}>
                <SetAbout/>
            </TabPanel>
            <TabPanel value={tabValue.get()} index={9}>
                Item Seven
            </TabPanel>
            <TabPanel value={tabValue.get()} index={10}>
                Item Seven
            </TabPanel>
        </Stack>
      </Stack>

    </Stack>
  </div >))
}