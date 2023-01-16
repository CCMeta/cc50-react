import TranslateIcon from '@mui/icons-material/Translate';
import { AppBar, Avatar, Box, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { useObserver } from 'react-solid-state';


export default props => {

  return useObserver(() => (<AppBar position="sticky" >
    <Toolbar variant="dense" sx={{ minHeight: 0, height: "5vh" }}>

      <Tooltip title="Language">
        <IconButton onClick={_ => window.location.href = ''} sx={{ p: 0 }}>
          <Avatar alt="Index Page" variant="square" sx={{ width: `auto`, "& img": { width: `auto`, height: `4vh`, objectFit: `contain` } }} src="/logo.png"></Avatar>
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

      <Tooltip title="Language">
        <IconButton>
          <TranslateIcon />
        </IconButton>
      </Tooltip>

    </Toolbar>
  </AppBar>))
}
