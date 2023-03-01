import {
  Button, ButtonGroup, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, IconButton, InputAdornment, List,
  ListItem, Paper, Popover, Stack, TextField, Typography
} from '@mui/material';
import { createEffect, onCleanup, useObserver } from 'react-solid-state';

import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import { LoadingButton } from '@mui/lab';

import { AppSettingsAltRounded, ChatBubbleOutlineRounded, ChatBubbleRounded, CheckCircle, DeleteOutlineRounded as DeleteSMSIcon, NoteAddOutlined as NewSMSIcon, RefreshRounded as RefreshSMSIcon } from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import 'animate.css';
import { Define, webcmd } from './utils';
import { display } from '@mui/system';
// import pdu from './c/pdu.js'
import { Buffer } from "buffer";
window.Buffer = Buffer;
const pdu = require('node-sms-pdu');

export default () => {
  /*********constants**********/
  const columns = [
    // { field: 'id', type: 'number', headerName: 'ID', width: 60, },
    { field: 'date', headerName: 'Date', width: 200, },
    { field: 'number', headerName: 'Number', width: 300, },
    {
      field: 'unread', headerName: 'Unread', type: 'number', width: 80, renderCell: (p) =>
        <Typography color={p.value > 0 ? `warning.main` : `text.secondary`}>
          {p.value}
        </Typography>
    },
    { field: 'total', type: 'number', headerName: 'Total', width: 80, },
    {
      field: 'content', headerName: 'Content (Click content to read)', minWidth: 300, flex: 1, renderCell: (p) =>
        <Typography onClick={() => onReadSMS(p.row)} variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>
          {p.value}
        </Typography>
    },
  ]
  const data_get_sms_list = Define([
    // { id: 1, date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    // { id: 2, date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    // { id: 3, date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    // { id: 4, date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
    // { id: 5, date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" },
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

  /*********functions**********/
  const onCreateSMS = async () => {
    onCreateSMSLoading.set(true)
    const content = []
    pdu.generateSubmit(createNumber.get(), createContent.get()).forEach(async element => {
      content.push(element.hex)
    });
    const form = { content }
    const result = await webcmd(`sms.create.set`, form)
    if (result.code === 200) {
      alert(result.msg)
    } else {
      alert(`result.code = ${result.code}; result.msg = ${result.msg}`)
    }
    onCreateSMSLoading.set(false)
    dialogCreateSMS.set(false)
    await getSMSList()
  }
  const onDeleteSMS = async () => {
    if (selectedSMS.get().length < 1)
      return false
    if (window.confirm(`If you continue to click OK, you will delete ${selectedSMS.get().length} text messages, click Cancel to cancel`)) {
      const form = { id: selectedSMS.get() }
      // return console.info(form)
      const result = await webcmd(`sms.del.set`, form)
      if (result.code === 200) {
        alert(result.msg)
      } else {
        alert(`result.code = ${result.code}; result.msg = ${result.msg}`)
      }
      await getSMSList()
    }
  }
  const onRefreshSMS = async () => {
    await getSMSList();
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

  const getSMSList = async () => {
    await webcmd(`sms.list.get`).then(v => {
      // console.info(v)
      const msgs = []
      for (const msg_pdu of v.data) {
        const msg = pdu.parse(msg_pdu.content);
        // console.warn(msg);
        msgs.push({
          id: msg_pdu.id,
          date: new Date(msg.timestamp).toLocaleString(),
          number: `${msg.origination}/${msg.smsc}`,
          total: 66,
          unread: 2,
          content: msg.text,
        })
      }
      data_get_sms_list.set(msgs)
    })
  }

  /*********createEffect**********/
  var intervalFlag
  createEffect(async () => {

    await getSMSList();

    // SetInterval api below 
    const intervalDuration = 3000
    const interval_apis = async () => {
      // data_latency
      // const fuck = data_get_sms_list.get().concat()
      // fuck.push({ id: "5", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" })
      // data_get_sms_list.set([])
      // data_get_sms_list.set(fuck)
      const fuck = pdu.parse(`0891683110302605F06405A00110F0000822606061813323880500032B0904682156ED003051436BCF670800320030004756FD51856D4191CF002D003500304E2A6708000D000A00205957991051856D4191CF00280030004D0029000D000A00205DF275280030002E00300030004D00426D596C5F002D00305143682156ED6C836D3E6821533A6D4191CF653E5FC37528002D003500304E2A6708000D000A0020`)
      // console.info(fuck)
      // console.log(data_get_sms_list.get().length)

      return interval_apis
    }

    // await interval_apis() //first initial
    intervalFlag = setInterval(await interval_apis(), intervalDuration);


  })
  onCleanup(() => clearInterval(intervalFlag))

  /*********styles**********/


  /*********component**********/
  return useObserver(() => (<div className="animate__animated animate__fadeIn">

    <Stack sx={{ flexGrow: 1 }} className="MainStack" direction="row" justifyContent="space-between" alignItems="flex-start" divider={<Divider orientation="vertical" flexItem />}>

      {/* <Stack sx={{ flexBasis: 0, flexGrow: 1 }}></Stack> */}
      <Stack className='styled-scrollbars' height={{ xs: `calc(95dvh - 4rem)`, md: `95dvh` }} sx={{ flexBasis: 0, flexGrow: 4 }}>

        {/* MOBILE BUTTONS */}
        <Paper elevation={0} variant="outlined" sx={{ width: 'fit-content', m: `1rem`, display: { xs: "flex", md: "none" } }}>
          <Stack direction={{ xs: "row" }} spacing={{ xs: `1rem`, md: `1rem` }} sx={{ m: `0.5rem`, width: "calc(90vw - 1rem)", justifyContent: "space-evenly" }}>
            <IconButton size="small" color="primary" onClick={() => dialogCreateSMS.set(true)}>
              <NewSMSIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton size="small" color="error" onClick={onDeleteSMS} >
              <DeleteSMSIcon />
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem />
            <IconButton size="small" color="success" onClick={onRefreshSMS}>
              <RefreshSMSIcon />
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem />
            <IconButton size="small" color="info" onClick={onSettingSMS}>
              <AppSettingsAltRounded />
            </IconButton>
          </Stack>
        </Paper>

        {/* PC BUTTONS */}
        <Stack display={{ xs: "none", md: "flex" }} direction={{ md: "row" }} spacing={{ xs: `1rem`, md: `1rem` }} sx={{ m: `1rem` }}>
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

        <DataGrid checkboxSelection disableSelectionOnClick selectionModel={selectedSMS.get()} onSelectionModelChange={(newSelectionModel) => {
          selectedSMS.set(newSelectionModel)
          console.log(selectedSMS.get())
        }} rows={data_get_sms_list.get()} columns={columns} />
      </Stack>

      {/* dialogCreateSMS */}
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

      {/* dialogReadSMS */}
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