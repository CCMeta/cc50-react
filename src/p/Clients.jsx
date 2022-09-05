import { AppBar, Divider, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { createEffect, useObserver } from 'react-solid-state';


import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'animate.css';
import { DataGrid } from '@mui/x-data-grid';


export default () => {
  /*********constants**********/
  const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
  ]
  const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
    { id: 4, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 5, col1: 'MUI', col2: 'is Amazing' },
    { id: 6, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 7, col1: 'MUI', col2: 'is Amazing' },
    { id: 8, col1: 'Hello', col2: 'World' },
    { id: 9, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 10, col1: 'MUI', col2: 'is Amazing' },
    { id: 11, col1: 'Hello', col2: 'World' },
    { id: 12, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 13, col1: 'MUI', col2: 'is Amazing' },
    { id: 14, col1: 'Hello', col2: 'World' },
    { id: 15, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 16, col1: 'MUI', col2: 'is Amazing' },
  ]

  /*********createEffect**********/
  createEffect(async () => {

  })
  /*********functions**********/


  /*********styles**********/


  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <AppBar position="sticky">
      <Toolbar>
        <IconButton onClick={_ => window.history.go(-1)} edge="start" color="inherit" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Clients
        </Typography>
      </Toolbar>
    </AppBar>

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      <Stack sx={{ flexBasis: 0, flexGrow: 1 }}></Stack>
      <Stack className='styled-scrollbars' height={`calc(100vh - 64px)`} sx={{ flexBasis: 0, flexGrow: 4 }}>
        <DataGrid className='styled-scrollbars' rows={rows} columns={columns} />
      </Stack>

    </Stack>


  </div >))
}