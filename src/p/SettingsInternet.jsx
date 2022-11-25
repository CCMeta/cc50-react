import { Stack, Box, FormControl, FormControlLabel, Radio, RadioGroup  } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';

import 'animate.css';
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { bytesToHuman, Define, fetching, rpc as $rpc, secondsToWatch, FormBuilder } from './utils';

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


export default function SetInternet() {
  /*********constants**********/
  //定义动态变量


  /*********createEffect**********/
  createEffect(async () => {
    // await fetching_get_wifi_setting();
  })

  /*********functions**********/
  const fetching_set_internet_setting = async () => {

  }
  /*********styles**********/

  return useObserver(()=>(
    <Stack>
        <Grid container spacing={2}>
            <Grid xs={0} md={0.5}/>
            <Grid md={4}  xs={8} sx={{textAlign: "left",}}>Connect Type</Grid>
            <Grid md={4} xs={12}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="auto"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="auto" control={<Radio />} label="Auto" />
                        <FormControlLabel value="PPPOE" control={<Radio />} label="PPPOE" />
                        <FormControlLabel value="autoIP" control={<Radio />} label="Automatic IP" />
                        <FormControlLabel value="staIP" control={<Radio />} label="Static IP" />
                        <FormControlLabel value="wire" control={<Radio />} label="Wireless broadband(SIM)" />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
    </Stack>
  ))
}
