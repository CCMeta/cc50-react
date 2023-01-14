import { Alert, Box, Button, Divider, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Popover, Select, Stack, TextField, Typography } from '@mui/material';

import { createEffect, useObserver } from 'react-solid-state';

import { CheckCircle, HelpOutlineRounded as HelpIcon } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';
import 'animate.css';
import * as React from 'react';
import { Define, webcmd } from './utils';
import HelpPopover from './c/HelpPopover';


function Item(props) {
  const { children, ...other } = props;
  return (
    <Stack justifyContent={`center`}
      sx={{ height: "60px", lineHeight: "60px", fontSize: { xs: "15px", md: "1rem" }, marginBottom: "0" }}
      {...other} >
      {children}
    </Stack>
  );
}

function TextFieldProto(props) {
  return (
    <TextField label="" variant="outlined" size="small" {...props} />
  );
}


export default function SetNetwork() {
  /*********constants**********/
  const leaseTimeOptions = [
    { value: `1h`, name: "1 Hour" },
    { value: `6h`, name: "6 Hours" },
    { value: `12h`, name: "12 Hours" },
    { value: `24h`, name: "24 Hours" }
  ]
  //定义动态变量
  const enable = Define(true), mode = Define("auto"), gateway = Define("192.168.10.1"), deviceName = Define("Unnamed");
  const start1 = Define(""), end1 = Define(""), start2 = Define(""), end2 = Define("");
  const start = Define(100), limit = Define(150), expire = Define(`12h`)
  const HelperLeaseTime = Define(null)

  const HandleChangeBoolean = (element, event) => {
    element.set(event.target.checked); //滑动按钮、勾选框等
  };

  const HandleChangeValue = (element, event) => {
    element.set(event.target.value); //输入框、选择框等
  };

  const HandleJudgeValue = (element, event) => {
    if (event.target.value > 255) {
      element.set(255);
    } else if (event.target.value < 0) {
      element.set(0);
    } else {
      element.set(parseInt(event.target.value)); //输入框、选择框等
    }
  };

  /*********createEffect**********/
  createEffect(async () => {

    await webcmd(`network.dhcp.get`).then(v => {
      const res = v.data
      start.set(res.start);
      limit.set(res.limit);
      expire.set(res.expire);
    })

  })

  /*********functions**********/
  const onSubmit = async () => {
    const form = {
      start: parseInt(start.get()),
      limit: parseInt(limit.get()),
      expire: expire.get(),
    }
    // return console.log(form)
    const result = await webcmd(`network.dhcp.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    }
  }

  /*********styles**********/
  //   sx={{height: "30px", padding: "5px","& input":{fontSize: {xs:"12px", md:"1rem"}}}}

  return useObserver(() => (
    <Stack>

      {/* Mobile DHCP Configuration Settings */}
      <Box display={{ md: "none" }}>

        <Paper variant="outlined" elevation={0} sx={{ my: '1rem' }}>
          <List>
            <ListSubheader>
              <Typography align="left" variant="caption" component="div">
                {"DHCP Configuration"}
              </Typography>
            </ListSubheader>
            <ListItem>
              <ListItemText>
                <Divider />
              </ListItemText>
            </ListItem>

            <ListItem secondaryAction={<Typography variant="caption" color="text.secondary">{gateway.get()}</Typography>}>
              <ListItemText primary={`DHCP Gateway`} />
            </ListItem>

            <ListItem>
              <TextFieldProto fullWidth label="DHCP Start Address" variant="outlined" size="small" value={start.get()} onChange={(e) => HandleJudgeValue(start, e)} />
            </ListItem>

            <ListItem>
              <TextFieldProto fullWidth label="Maximum number of Clients" variant="outlined" size="small" value={limit.get()} onChange={(e) => HandleJudgeValue(limit, e)} />
            </ListItem>

            <ListItem>
              <FormControl fullWidth>
                <InputLabel id="select-label-Wireless-DHCP-Lease-Time">DHCP Lease Time</InputLabel>
                <Select labelId="select-label-Wireless-DHCP-Lease-Time" label="DHCP Lease Time" variant="outlined" size="small" value={expire.get()} onChange={(e) => HandleChangeValue(expire, e)}>
                  {leaseTimeOptions.map((i) => (
                    <MenuItem value={i.value}>{i.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>

          </List>
        </Paper>
      </Box>

      {/* PC DHCP Configuration Settings */}
      <Box display={{ xs: "none", md: "block" }}>
        <Divider textAlign="left" sx={{ my: { xs: '1.5rem', md: '3rem' } }}>
          <Typography variant="h6">
            <b>DHCP Configuration</b>
          </Typography>
        </Divider>

        <Box px={{ md: '4rem' }}>

          <Grid container spacing={2}>
            <Grid xs={0} md={3} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Gateway`}
                  <HelpPopover>
                    {`The default DHCP gateway is readonly in this version`}
                  </HelpPopover>
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={6} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <Typography variant="subtitle1">
                  {gateway.get()}
                </Typography>
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={0} md={3} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Start address`}
                  <HelpPopover>
                    {`Only number, Range 2-254. 
                    The DHCP range min address, DHCP will start with this sub-address`}
                  </HelpPopover>
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={6} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <TextFieldProto value={start.get()} onChange={(e) => HandleJudgeValue(start, e)} />
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={0} md={3} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`Maximum Number of Clients`}
                  <HelpPopover>
                    {`Only number, Range 1-128.
                    The device could connect clients by this number as limit`}
                  </HelpPopover>
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={6} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <TextFieldProto value={limit.get()} onChange={(e) => HandleJudgeValue(limit, e)} />
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid xs={8} md={3} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <Typography variant="subtitle1" color='text.secondary'>
                  {`DHCP Lease Time`}
                  <HelpPopover>
                    {`Only number, Range 1-256, Unit: Hour`}
                  </HelpPopover>
                </Typography>
              </Item>
            </Grid>
            <Grid xs={12} md={6} sx={{ textAlign: "left", marginTop: "10px" }}>
              <Item>
                <Select size="small" value={expire.get()} onChange={(e) => HandleChangeValue(expire, e)}>
                  {leaseTimeOptions.map((i) => (
                    <MenuItem value={i.value}>{i.name}</MenuItem>
                  ))}
                </Select>
              </Item>
            </Grid>
          </Grid>

        </Box>
      </Box>

      <Box px={{ md: `10rem` }} py={{ xs: '3rem', md: '3rem' }}>
        <Button onClick={onSubmit} fullWidth color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Save</Button>
      </Box>

    </Stack>
  ))
}
