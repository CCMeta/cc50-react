import TranslateIcon from '@mui/icons-material/Translate';
import { AppBar, Avatar, Box, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { useObserver } from 'react-solid-state';


export default function HeaderBar() {
  return useObserver(() => (<AppBar position="sticky">
    <Toolbar variant="dense" sx={{ minHeight: 0, height: "5vh" }}>
      
      <Tooltip title="Index Page">
        <IconButton onClick={_ => window.location.href = ''} sx={{ p: 0 }}>
          <Avatar alt="logo" variant="square" sx={{ width: `auto`, height: `4vh`, "& img": { objectFit: `contain` } }} src="https://ccmeta.com/sagereal.png"></Avatar>
        </IconButton>
      </Tooltip>

      <Stack direction="row" alignItems="center" sx={{ flexBasis: 0, flexGrow: 4, }}>
        {/* <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton> */}
        <Typography color="text.secondary" variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Settings */}
        </Typography>

      </Stack>

      <Box sx={{ flexGrow: 0, px: `1rem` }}>
        <Tooltip title="Language">
          <IconButton>
            <TranslateIcon />
          </IconButton>
        </Tooltip>
      </Box>

    </Toolbar>
  </AppBar>))
}
