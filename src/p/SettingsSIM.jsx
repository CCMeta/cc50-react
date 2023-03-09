import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import { CheckCircle } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { boolToInt, Define, webcmd } from './utils';
import HelpPopover from './c/HelpPopover';
import { DATA_MODES } from './constants'
import { LoadingButton } from '@mui/lab';

function BpCheckbox(props) {
  return (
    <FormControlLabel label={props.label} control={<Checkbox sx={{ '&:hover': { bgcolor: 'transparent' }, }} size="small" {...props} />} />
  );
}

function Item(props) {
  const { children, ...other } = props;
  return (
    <Stack justifyContent={`center`} {...other}
      sx={{ height: "60px", lineHeight: "60px", fontSize: { xs: "15px", md: "1rem" }, marginBottom: "0" }}>
      {children}
    </Stack>
  );
}

function TextFieldSelf(props) {
  return (
    <TextField label="" variant="outlined" size="small" {...props} />
  );
}

export default function SetSIM() {
  /*********constants**********/
  const pdpTypes = [
    { value: 0, name: "IPV4" },
    { value: 1, name: "IPV6" },
    { value: 2, name: "IPv4v6" }
  ]
  //定义动态变量
  const enable = Define(false), roaming = Define(false), dataMode = Define(0);
  const apnMode = Define("auto"), pdpType = Define(2), apnName = Define("");
  const authType = Define("0"), username = Define(""), password = Define(""), current = Define("undefined");
  const pinState = Define(`disable`), pinAction = Define(`disable`), pinCurrentCode = Define(``), pinNewCode = Define(``), pinRemain = Define(0)
  const HandleChangeBoolean = (dom, event) => {
    dom.set(event.target.checked); //滑动按钮、勾选框等
  };
  const HandleChangeValue = (dom, event) => {
    dom.set(event.target.value); //输入框、选择框等
  };
  const helpTextRoaming = `If Disable this option, Mobile Network will not support Roaming.`
  const helpTextDataMode = `Check well you SIM card, select the same data mode or let him auto.`
  const helpTextNetwork = `Disable or Enable the Mobile Network`
  const helpTextPINAction = `The PIN code can only be changed when the PIN code state is enabled.`
  const helpTextPINState = `After the PIN code is enabled, you need to enter the PIN code when you start the device next time.
  After you disable the PIN code, you do not need to enter the PIN code when you start the device next time.`
  const helpTextPdpMode = `Mode: Select Manual APN if your service provider provided you with a fixed APN.
  If not provided, select "Auto" and the device will get the parameters automatically.`
  const helpTextApnAuthentication = `Authentication: Provided by your Internet Service Provider (ISP).
  Password Authentication Protocol (PAP) uses two handshakes to establish a peer's identity without encryption.
  The Challenge Handshake Authentication Protocol (CHAP) periodically verifies the identity of the peer through a three-way handshake.`
  const onSubmitNetworkLoading = Define(false)
  const onSubmitAPNLoading = Define(false)
  const onSubmitPINLoading = Define(false)

  /*********createEffect**********/
  createEffect(async () => {
    await webcmd(`internet.setting.sim.get`).then(v => {
      const res = v.data
      enable.set(boolToInt(res["enable"]))
      roaming.set(boolToInt(res["roaming"]))
      dataMode.set(res["dataMode"])
    })

    await webcmd(`sim.setting.pin.get`).then(v => {
      const res = v.data
      console.warn(res);
      pinState.set(res.pinState)
      pinRemain.set(res.pinRemain)
    })

    await webcmd(`sim.setting.apn.get`).then(v => {
      const res = v.data
      current.set(res.current)
      apnMode.set(res.selectMode)
      pdpType.set(res.pdp)
      apnName.set(res.apnName)
      authType.set(res.authType)
      username.set(res.username)
      password.set(res.password)
    })


  })

  /*********functions**********/
  const onSubmitNetwork = async e => {
    onSubmitNetworkLoading.set(true)
    const form = {
      enable: boolToInt(enable.get()),
      roaming: boolToInt(roaming.get()),
      dataMode: dataMode.get(),
    }
    // return console.log(form)
    const result = await webcmd(`internet.setting.sim.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    } else {
      alert(`result.code = ${result.code}; result.msg = ${result.msg}`)
    }
    onSubmitNetworkLoading.set(false)
  }
  const onSubmitPIN = async e => {
    onSubmitPINLoading.set(true)
    const form = {
      pinAction: pinAction.get(),
      pinCurrentCode: pinCurrentCode.get(),
      pinNewCode: pinNewCode.get(),
    }
    // return console.log(form)
    const result = await webcmd(`sim.setting.pin.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    } else {
      alert(`result.code = ${result.code}; result.msg = ${result.msg}`)
    }
    onSubmitPINLoading.set(false)
  }
  const onSubmitAPN = async e => {
    onSubmitAPNLoading.set(true)
    const form = {
      selectMode: apnMode.get(),
      pdp: pdpType.get(),
      apnName: apnName.get(),
      authType: authType.get(),
      username: username.get(),
      password: password.get(),
    }
    // return console.log(form)
    const result = await webcmd(`sim.setting.apn.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    } else {
      alert(`result.code = ${result.code}; result.msg = ${result.msg}`)
    }
    onSubmitAPNLoading.set(false)
  }
  /*********styles**********/

  /*********component**********/
  return useObserver(() => (<Stack>

    {/* Mobile SIM Settings */}
    <Box display={{ md: "none" }}>

      {/* network */}
      <Paper variant="outlined" elevation={0} sx={{ my: '1rem', borderRadius: "10px", border: "2px solid rgb(151 128 229 / 50%)", }}>
        <List>
          <ListSubheader>
            <Typography align="left" variant="caption" component="div">
              {"SIM Network Configuration"}
            </Typography>
          </ListSubheader>
          <ListItem>
            <ListItemText>
              <Divider />
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              {`Network`}
              <HelpPopover>
                {helpTextNetwork}
              </HelpPopover>
            </ListItemText>
            <BpCheckbox label="Enable" checked={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} />
          </ListItem>
          <ListItem>
            <ListItemText>
              {`Roaming`}
              <HelpPopover>
                {helpTextRoaming}
              </HelpPopover>
            </ListItemText>
            <BpCheckbox label="Enable" checked={roaming.get()} onChange={(e) => HandleChangeBoolean(roaming, e)} />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id="select-label-Wireless-DataMode">
                Data Mode
                <HelpPopover>
                  {helpTextDataMode}
                </HelpPopover>
              </InputLabel>
              <Select sx={{ '& fieldset > legend': { pr: `1rem` } }} labelId="select-label-Wireless-DataMode" label={`Data Mode`} variant="outlined" size="small" value={dataMode.get()} onChange={(e) => HandleChangeValue(dataMode, e)}>
                {DATA_MODES.map((mode) => (
                  <MenuItem value={mode.value}>{mode.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <LoadingButton loading={onSubmitNetworkLoading.get()} onClick={onSubmitNetwork} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
          </ListItem>
        </List>
      </Paper>
      {/* PIN */}
      <Paper variant="outlined" elevation={0} sx={{ my: '1rem', borderRadius: "10px", border: "2px solid rgb(128 222 234 / 50%)", }}>
        <List>
          <ListSubheader>
            <Typography align="left" variant="caption" component="div">
              {"PIN Configuration"}
            </Typography>
          </ListSubheader>
          <ListItem>
            <ListItemText>
              <Divider />
            </ListItemText>
          </ListItem>
          <ListItem secondaryAction={pinState.get()}>
            <ListItemText>
              {`Current State`}
              <HelpPopover>
                {helpTextPINState}
              </HelpPopover>
            </ListItemText>
          </ListItem>
          <ListItem secondaryAction={pinRemain.get()}>
            <ListItemText>
              {`Remain Time`}
            </ListItemText>
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id="select-label-PIN-Action">
                {`Action`}
                <HelpPopover>
                  {helpTextPINAction}
                </HelpPopover>
              </InputLabel>
              <Select sx={{ '& fieldset > legend': { pr: `1rem` } }} labelId="select-label-PIN-Action" label={`Action`} variant="outlined" size="small" value={pinAction.get()} onChange={(e) => HandleChangeValue(pinAction, e)}>
                <MenuItem value={`verify`}>{`Verify`}</MenuItem>
                <MenuItem value={`enable`}>{`Enable`}</MenuItem>
                <MenuItem value={`disable`}>{`Disable`}</MenuItem>
                <MenuItem value={`change`}>{`Change`}</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <TextField fullWidth label="Current PIN Code" variant="outlined" size="small" value={pinCurrentCode.get()} onChange={(e) => HandleChangeValue(pinCurrentCode, e)} />
          </ListItem>
          <ListItem>
            <TextField disabled={pinAction.get() !== `change`} fullWidth label="New PIN Code" variant="outlined" size="small" value={pinNewCode.get()} onChange={(e) => HandleChangeValue(pinNewCode, e)} />
          </ListItem>
          <ListItem>
            <LoadingButton loading={onSubmitPINLoading.get()} onClick={onSubmitPIN} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
          </ListItem>
        </List>
      </Paper>
      {/* APN */}
      <Paper variant="outlined" elevation={0} sx={{ my: '1rem', borderRadius: "10px", border: "2px solid rgb(255 171 145 / 50%)", }}>
        <List>
          <ListSubheader>
            <Typography align="left" variant="caption" component="div">
              {"APN Configuration"}
            </Typography>
          </ListSubheader>
          <ListItem>
            <ListItemText>
              <Divider />
            </ListItemText>
          </ListItem>
          <ListItem secondaryAction={current.get()}>
            <ListItemText>
              {`Current APN`}
            </ListItemText>
          </ListItem>
          <ListItem secondaryAction={<FormControl md={{ paddingLeft: "9px" }} xs={{ paddingLeft: "0px" }}>
            <RadioGroup row value={apnMode.get()} onChange={(e) => HandleChangeValue(apnMode, e)}>
              <FormControlLabel value="auto" control={<Radio />} label="Auto" />
              <FormControlLabel value="maunal" control={<Radio />} label="Maunal" />
            </RadioGroup>
          </FormControl>}>
            <ListItemText>
              {`APN Mode`}
              <HelpPopover>
                {helpTextPdpMode}
              </HelpPopover>
            </ListItemText>
          </ListItem>
          <ListItem>
            <FormControl disabled={apnMode.get() === `auto`} fullWidth>
              <InputLabel disabled={apnMode.get() === `auto`} id="select-label-PIN-PdpType">
                {`PDP Type`}
              </InputLabel>
              <Select labelId="select-label-PIN-PdpType" label={`PDP Type`} variant="outlined" size="small" value={pdpType.get()} onChange={(e) => HandleChangeValue(pdpType, e)}>
                {pdpTypes.map((pdpp) => (
                  <MenuItem value={pdpp.value}>{pdpp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <TextField disabled={apnMode.get() === `auto`} fullWidth label="APN Name" variant="outlined" size="small" value={apnName.get()} onChange={(e) => HandleChangeValue(apnName, e)} />
          </ListItem>
          <ListItem>
            <FormControl disabled={apnMode.get() === `auto`} fullWidth>
              <InputLabel id="select-label-PIN-AuthType">
                {`Auth Type`}
                <HelpPopover>
                  {helpTextApnAuthentication}
                </HelpPopover>
              </InputLabel>
              <Select sx={{ '& fieldset > legend': { pr: `1rem` } }} labelId="select-label-PIN-AuthType" label={`Auth Type`} variant="outlined" size="small" value={authType.get()} onChange={(e) => HandleChangeValue(authType, e)}>
                <MenuItem value={`0`}>{`PAP`}</MenuItem>
                <MenuItem value={`1`}>{`CHAP`}</MenuItem>
                <MenuItem value={`2`}>{`PAP/CHAP`}</MenuItem>
                <MenuItem value={`3`}>{`NONE`}</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <TextField disabled={apnMode.get() === `auto`} fullWidth label="Username" variant="outlined" size="small" value={username.get()} onChange={(e) => HandleChangeValue(username, e)} />
          </ListItem>
          <ListItem>
            <TextField disabled={apnMode.get() === `auto`} fullWidth label="Password" variant="outlined" size="small" value={password.get()} onChange={(e) => HandleChangeValue(password, e)} />
          </ListItem>
          <ListItem>
            <LoadingButton loading={onSubmitAPNLoading.get()} onClick={onSubmitAPN} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
          </ListItem>
        </List>
      </Paper>

    </Box>

    {/* PC SIM Settings */}
    <Box display={{ xs: "none", md: "block" }}>
      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6" color="text.secondary">
          <b>Network Configuration</b>
        </Typography>
      </Divider>
      <Box px={{ md: '4rem' }}>

        <Grid container spacing={2}>
          <Grid xs={0} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Network`}
                <HelpPopover>
                  {helpTextNetwork}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <BpCheckbox label="Enable" checked={enable.get()} onChange={(e) => HandleChangeBoolean(enable, e)} />
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={0} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Roaming`}
                <HelpPopover>
                  {helpTextRoaming}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <BpCheckbox label="Enable" checked={roaming.get()} onChange={(e) => HandleChangeBoolean(roaming, e)} />
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={0} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`DataMode`}
                <HelpPopover>
                  {helpTextDataMode}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <Select size="small" value={dataMode.get()} onChange={(e) => HandleChangeValue(dataMode, e)} >
                {DATA_MODES.map((mode) => (
                  <MenuItem value={mode.value}>{mode.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>
        <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
          <LoadingButton loading={onSubmitNetworkLoading.get()} onClick={onSubmitNetwork} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
        </Box>
      </Box>
    </Box>

    {/* PC PIN Settings */}
    <Box display={{ xs: "none", md: "block" }}>
      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6" color="text.secondary">
          <b>PIN Configuration</b>
        </Typography>
      </Divider>
      <Box px={{ md: '4rem' }}>

        <Grid container spacing={2}>
          <Grid xs={0} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Current State`}
                <HelpPopover>
                  {helpTextPINState}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <Typography variant="subtitle1" >
                {pinState.get()}
              </Typography>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={0} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Remain Time`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <Typography variant="subtitle1" >
                {pinRemain.get()}
              </Typography>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={0} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Action`}
                <HelpPopover>
                  {helpTextPINAction}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <Select size="small" value={pinAction.get()} onChange={(e) => HandleChangeValue(pinAction, e)} >
                <MenuItem value={`verify`}>{`Verify`}</MenuItem>
                <MenuItem value={`enable`}>{`Enable`}</MenuItem>
                <MenuItem value={`disable`}>{`Disable`}</MenuItem>
                <MenuItem value={`change`}>{`Change`}</MenuItem>
              </Select>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Current PIN Code`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <TextFieldSelf label={`Enter the Current pin code`} value={pinCurrentCode.get()} onChange={(e) => HandleChangeValue(pinCurrentCode, e)} />
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`New PIN Code`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <TextFieldSelf disabled={pinAction.get() !== `change`} label={pinAction.get() !== `change` ? "disabled" : `Enter the new pin code`} value={pinNewCode.get()} onChange={(e) => HandleChangeValue(pinNewCode, e)} />
            </Item>
          </Grid>
        </Grid>
        <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
          <LoadingButton loading={onSubmitPINLoading.get()} onClick={onSubmitPIN} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
        </Box>
      </Box>
    </Box>

    {/* PC APN Settings */}
    <Box display={{ xs: "none", md: "block" }}>
      <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
        <Typography variant="h6" color='text.secondary'>
          <b>APN Configuration</b>
        </Typography>
      </Divider>

      <Box px={{ md: '4rem' }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Current APN`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}><Item>
            <TextFieldSelf value={current.get()} onChange={(e) => HandleChangeValue(current, e)} /></Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`APN Select Mode`}
                <HelpPopover>
                  {helpTextPdpMode}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <FormControl md={{ paddingLeft: "9px" }} xs={{ paddingLeft: "0px" }}>
                <RadioGroup row value={apnMode.get()} onChange={(e) => HandleChangeValue(apnMode, e)}>
                  <FormControlLabel value="auto" control={<Radio />} label="Auto" />
                  <FormControlLabel value="maunal" control={<Radio />} label="Maunal" />
                </RadioGroup>
              </FormControl>
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`PDP Type`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6} sx={{ textAlign: "left" }}>
            <Item>
              <Select disabled={apnMode.get() === `auto`} size="small" value={pdpType.get()} onChange={(e) => HandleChangeValue(pdpType, e)} >
                {pdpTypes.map((pdpp) => (
                  <MenuItem value={pdpp.value}>{pdpp.name}</MenuItem>
                ))}
              </Select>
            </Item>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`APN Name`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <TextFieldSelf disabled={apnMode.get() === `auto`} value={apnName.get()} onChange={(e) => HandleChangeValue(apnName, e)} />
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left", }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Auth Type`}
                <HelpPopover>
                  {helpTextApnAuthentication}
                </HelpPopover>
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <FormControl disabled={apnMode.get() === `auto`} sx={{ paddingLeft: "9px", flexDirection: "row", }}>
                <RadioGroup row value={authType.get()} onChange={(e) => HandleChangeValue(authType, e)}>
                  <FormControlLabel value="0" control={<Radio />} label="PAP" />
                  <FormControlLabel value="1" control={<Radio />} label="CHAP" />
                  <FormControlLabel value="2" control={<Radio />} label="PAP/CHAP" />
                  <FormControlLabel value="3" control={<Radio />} label="NONE" />
                </RadioGroup>
              </FormControl>
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Username`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <TextFieldSelf disabled={apnMode.get() === `auto`} value={username.get()} onChange={(e) => HandleChangeValue(username, e)} maxLength="30" />
            </Item>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12} md={3} sx={{ textAlign: "left" }}>
            <Item>
              <Typography variant="subtitle1" color='text.secondary'>
                {`Password`}
              </Typography>
            </Item>
          </Grid>
          <Grid xs={12} md={6}>
            <Item>
              <TextFieldSelf disabled={apnMode.get() === `auto`} value={password.get()} onChange={(e) => HandleChangeValue(password, e)} maxLength="30" />
            </Item>
          </Grid>
        </Grid>

        <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
          <LoadingButton loading={onSubmitAPNLoading.get()} onClick={onSubmitAPN} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</LoadingButton>
        </Box>
      </Box>
    </Box>

  </Stack>))
}
