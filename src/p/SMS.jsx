import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, InputAdornment, List,
  ListItem, Popover, Stack, TextField, Typography
} from '@mui/material';
import { createEffect, onCleanup, useObserver } from 'react-solid-state';

import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';

import { AppSettingsAltRounded, DeleteOutlineRounded as DeleteSMSIcon, NoteAddOutlined as NewSMSIcon, RefreshRounded as RefreshSMSIcon } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import 'animate.css';
import { Define } from './utils';


export default () => {
  /*********constants**********/
  const columns = [
    { field: 'id', type: 'number', headerName: 'ID', width: 60, },
    { field: 'date', headerName: 'Date', width: 200, },
    { field: 'number', headerName: 'Number', width: 150, },
    { field: 'total', type: 'number', headerName: 'Total', width: 80, },
    {
      field: 'content', headerName: 'Content', flex: 1, renderCell: p =>
        <Typography variant="body2" color="pink" sx={{ cursor: "pointer" }}>
          {p.value}
        </Typography>
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      getActions: (params) => [
        <GridActionsCellItem disabled icon={<LockIcon color="Aqua_Blue" />} label="Lock" />,
        <GridActionsCellItem onClick={e => QoS_PopoverOpen.set(e.currentTarget)} icon={<EditIcon color="Aqua_Blue" />} label="QoS" />,
      ]
    },
  ]
  const data_get_sms_list = Define([
    { id: "1", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, content: "谁是爸爸 我是爸爸" },
    { id: "2", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, content: "谁是爸爸 我是爸爸" },
    { id: "3", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, content: "谁是爸爸 我是爸爸" },
    { id: "4", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, content: "谁是爸爸 我是爸爸" },
    { id: "5", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, content: "谁是爸爸 我是爸爸" },
  ])
  const QoS_PopoverOpen = Define(null)
  const dialogCreateSMS = Define(false)
  const content = Define("")

  /*********createEffect**********/
  var timer
  createEffect(async () => {

    // setInterval api below 
    const interval_apis = async () => {

      // data_get_sms_list.set((await fetching_conntrack_list()) || [])

      return interval_apis
    }
    timer = setInterval(await interval_apis(), 2000);

  })
  onCleanup(() => clearInterval(timer))

  /*********functions**********/
  const onCreateSMS = () => {
    alert(content.get())
    dialogCreateSMS.set(false)
  }
  const onDeleteSMS = () => {
    alert(`onDeleteSMS`)
  }
  const onRefreshSMS = () => {
    alert(`onRefreshSMS`)
  }
  const onSettingSMS = () => {
    alert(`onSettingSMS`)
  }

  /*********styles**********/


  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      {/* <Stack sx={{ flexBasis: 0, flexGrow: 1 }}></Stack> */}
      <Stack className='styled-scrollbars' height={`95vh`} sx={{ flexBasis: 0, flexGrow: 4 }}>

        <Stack sx={{ m: 2 }}>
          <Stack direction="row" spacing={`1rem`}>
            <Button color="primary" onClick={() => dialogCreateSMS.set(true)} startIcon={<NewSMSIcon />} variant="outlined">
              Create
            </Button>

            <Dialog fullWidth maxWidth="md" scroll="paper" open={dialogCreateSMS.get()} onClose={() => dialogCreateSMS.set(false)}>
              <DialogTitle>
                <Stack direction="row" alignItems="center">
                  <NewSMSIcon color="primary" sx={{ mr: `0.5rem` }} />
                  <Typography variant="subtitle1" >
                    {`New Message`}
                  </Typography>
                </Stack>
              </DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  <TextField value={content.get()} onChange={e => content.set(e.target.value)} label={content.get().length > 0 ? `${content.get().length} / 200` : `Please Enter Your Message Content in there`} multiline minRows={10} fullWidth autoFocus />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" color="info" onClick={() => dialogCreateSMS.set(false)}>Cancel</Button>
                <Button variant="contained" color="Aqua_Blue" onClick={onCreateSMS}>Send</Button>
              </DialogActions>
            </Dialog>

            <Button color="error" onClick={onDeleteSMS} startIcon={<DeleteSMSIcon />} variant="outlined">
              Delete
            </Button>
            <Button color="success" onClick={onRefreshSMS} startIcon={<RefreshSMSIcon />} variant="outlined">
              Refresh
            </Button>
            <Button color="info" onClick={onSettingSMS} startIcon={<AppSettingsAltRounded />} variant="outlined">
              Setting
            </Button>
          </Stack>

          <Popover
            onClose={e => QoS_PopoverOpen.set(null)}
            anchorEl={QoS_PopoverOpen.get()}
            open={QoS_PopoverOpen.get() !== null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
            transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
            <List sx={{ width: `20rem` }} dense>
              <ListItem>
                <TextField color="info" size='small' fullWidth label="Down Rate per Client" InputProps={{
                  endAdornment: <InputAdornment position="start">Mbit</InputAdornment>,
                }} />
              </ListItem>
              <ListItem>
                <TextField color="success" size='small' fullWidth label="Up Rate per Client" InputProps={{
                  endAdornment: <InputAdornment position="start">Mbit</InputAdornment>,
                }} />
              </ListItem>
              <ListItem>
                <Button disabled fullWidth variant="contained">Save</Button>
              </ListItem>
            </List>
          </Popover>
        </Stack>

        <DataGrid checkboxSelection rows={data_get_sms_list.get()} columns={columns} />
      </Stack>

    </Stack>

  </div >))
}