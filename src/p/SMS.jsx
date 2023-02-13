import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, InputAdornment, List,
  ListItem, Popover, Stack, TextField, Typography
} from '@mui/material';
import { createEffect, onCleanup, useObserver } from 'react-solid-state';

import { LoadingButton } from '@mui/lab';

import { AppSettingsAltRounded, ChatBubbleOutlineRounded, CheckCircle, DeleteOutlineRounded as DeleteSMSIcon, NoteAddOutlined as NewSMSIcon, RefreshRounded as RefreshSMSIcon } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import 'animate.css';
import { Define } from './utils';


export default () => {
  /*********constants**********/
  const columns = [
    { field: 'id', type: 'number', headerName: 'ID', width: 60, },
    { field: 'date', headerName: 'Date', width: 200, },
    { field: 'number', headerName: 'Number', width: 150, },
    {
      field: 'unread', headerName: 'Unread', type: 'number', width: 80, renderCell: (p) =>
        <Typography color={p.value > 0 ? `warning.main` : `text.secondary`}>
          {p.value}
        </Typography>
    },
    { field: 'total', type: 'number', headerName: 'Total', width: 80, },
    {
      field: 'content', headerName: 'Content (Click content to read)', flex: 1, renderCell: (p) =>
        <Typography onClick={() => onReadSMS(p.row)} variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
          {p.value}
        </Typography>
    },
  ]
  const data_get_sms_list = Define([
    { id: "1", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    { id: "2", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    { id: "3", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    { id: "4", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    { id: "5", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
  ])
  const QoS_PopoverOpen = Define(null)
  const dialogCreateSMS = Define(false)
  const dialogReadSMS = Define(false)
  const createNumber = Define("")
  const createContent = Define("")
  const readNumber = Define("")
  const readContent = Define("")
  const onCreateSMSLoading = Define(false)
  const selectedSMS = Define([])

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
    onCreateSMSLoading.set(true)
    alert(createContent.get())
    onCreateSMSLoading.set(false)
    dialogCreateSMS.set(false)
  }
  const onDeleteSMS = () => {
    alert(`onDeleteSMS${selectedSMS.get()} length = ${selectedSMS.get().length}`)
  }
  const onRefreshSMS = () => {
    alert(`onRefreshSMS`)
  }
  const onSettingSMS = () => {
    alert(`onSettingSMS`)
  }
  const onReadSMS = (sms) => {
    console.log(sms)
    readNumber.set(sms.number)
    readContent.set(sms.content)
    dialogReadSMS.set(true)
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

            <Button color="error" onClick={onDeleteSMS} startIcon={<DeleteSMSIcon />} variant="outlined">
              Delete
            </Button>
            <Button color="success" onClick={onRefreshSMS} startIcon={<RefreshSMSIcon />} variant="outlined">
              Refresh
            </Button>
            <Button disabled color="info" onClick={onSettingSMS} startIcon={<AppSettingsAltRounded />} variant="outlined">
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

        <DataGrid checkboxSelection disableSelectionOnClick selectionModel={selectedSMS.get()} onSelectionModelChange={(newSelectionModel) => {
          selectedSMS.set(newSelectionModel)
          console.log(selectedSMS.get())
        }} rows={data_get_sms_list.get()} columns={columns} />
      </Stack>

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
            <TextField value={createNumber.get()} onChange={e => createNumber.set(e.target.value)} variant="standard" label="Cell Number" fullWidth autoFocus />
            <Divider sx={{ my: `1rem` }} />
            <TextField value={createContent.get()} onChange={e => createContent.set(e.target.value)} label={createContent.get().length > 0 ? `${createContent.get().length} / 200` : `Please Enter Your Message Content in there`} multiline minRows={10} fullWidth />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="info" onClick={() => dialogCreateSMS.set(false)}>Cancel</Button>
          <LoadingButton loading={onCreateSMSLoading.get()} onClick={onCreateSMS} color="Aqua_Blue" startIcon={<CheckCircle />} variant="contained">Send</LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="md" scroll="paper" open={dialogReadSMS.get()} onClose={() => dialogReadSMS.set(false)}>
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            <ChatBubbleOutlineRounded color="primary" sx={{ mr: `0.5rem` }} />
            <Typography variant="subtitle1" >
              {`Read Message`}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <TextField value={readNumber.get()} variant="standard" label="Cell Number" disabled />
            <Divider sx={{ my: `1rem` }} />
            <Typography color="text.primary">
              {readContent.get()}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="info" onClick={() => dialogReadSMS.set(false)}>Close</Button>
        </DialogActions>
      </Dialog>

    </Stack>

  </div >))
}