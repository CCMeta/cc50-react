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

const test_msgs_pdu = [
  {
    "id": 1,
    "content": "09a164000349341802f0040ba13139665115f50008227002411251230454755475"
  },
  {
    "id": 2,
    "content": "09a164000349341802f0040ea10196226197113200082270025195942340301054d454e954d454e9301100360037003700320031003077ed4fe1767b5f559a8c8bc17801ff0c00355206949f518567096548ff0c8bf752ff6cc497323002"
  },
  {
    "id": 3,
    "content": "09a164000349341802f0040ea10196226197113200082270026130532340301054d454e954d454e9301100390032003100380038003177ed4fe1767b5f559a8c8bc17801ff0c00355206949f518567096548ff0c8bf752ff6cc497323002"
  },
  {
    "id": 4,
    "content": "09a164000349341802f0040ea10196226197113200082270026101812340301054d454e954d454e9301100340032003000310038003277ed4fe1767b5f559a8c8bc17801ff0c00355206949f518567096548ff0c8bf752ff6cc497323002"
  },
  {
    "id": 5,
    "content": "09a064000349341802f00405a00100f000082270027140352376003767080032003065e5662f7b2c003100366b21516856fd7279596565e5ff0c4eca5e744e3b9898662f201c727959658d4b80fdff0c4f606211540c884c201d300251735fc3517372316b8b75be4ebaff0c53d15c55727959658fd052a8300230106cb3535777016b8b75be4eba805454084f1a3011"
  },
  {
    "id": 6,
    "content": "09a164000349341802f00408a101000110000822705201946323645c0a656c768475286237ff0c60a876849a8c8bc17801662fff1a003400370030003900300034ff0c00355206949f518567096548ff0c8bf752ff6cc4973230025982975e672c4eba64cd4f5c65e09700590474063002000a301059297ffc8d2653f73011"
  },
  {
    "id": 7,
    "content": "09a064000349341802f04405a00100f0000822705271706323440500034a020273af588330024e0d5f974ee553d1653e94b1726966ff4ee363d04f9b96326691964d6e29996e6599300230106cb353577701536b751f50655eb759d43011"
  },
  {
    "id": 8,
    "content": "09a064000349341802f04405a00100f00008227052717063238c0500034a020175284eba53554f4d5e9457289ad86e294f5c4e1a573a6240589e6dfb5fc589817684901a98ce6216964d6e298bbe5907ff0c4e3a52b352a8800563d04f9b5fc5898176844e2a4f53963262a4752854c1548c96326691964d6e296240970076846e0551c9996e659953ca4fdd5065752854c1ff0c6539558452b352a867614ef6548c4f5c4e1a"
  },
  {
    "id": 9,
    "content": "09a164000349341802f04405a10100f000082270527151522388050003b903016b228fce60a8676552306d596c5fff0c6e2999a863d0793aff1a82e560a84e3a591677016765ff088fd4ff096d594eba5458ff0c4e3a4e8660a8548c4ed64eba768450655eb7ff0c8bf760a8572851656d59540e4e3b52a8914d54088fdb884c4e006b21514d8d396838917868c06d4b3002598260a88fd100375929518567094e2d"
  },
  {
    "id": 10,
    "content": "09a164000349341802f04005a10100f00008227052715162230c050003b9030363a7529e3011"
  },
  {
    "id": 11,
    "content": "09a164000349341802f04405a10100f000082270527151522388050003b903029ad898ce96695730533a6240572853bf5e02533a65c55c4553f2ff0c8bf74e25683c505a597d4e2a4eba963262a4ff0c5c318fd1541162405728793e533a4e3b52a8753362a5ff0c5e76914d5408843d5b9e50655eb77ba1740663aa65bd3002611f8c2260a87684652f6301548c914d5408ff0130106d596c5f770175ab60c59632"
  },
  {
    "id": 12,
    "content": "09a064000349341802f00405a00100f0000822706241507423506cb353576d88963263d0793aff1a4eca65e54e2d4f0f30024e0d898157285ba451854e3a753552a881ea884c8f6651457535ff0c66f44e0d898198de7ebf4e3a753552a881ea884c8f66514575353002"
  },
  {
    "id": 13,
    "content": "09a064000349341802f04405a00100f000082280035161242318050003d802028fd456de706b573a62ff53d68d2272693002"
  },
  {
    "id": 14,
    "content": "09a064000349341802f04405a00100f00008228003516124238c050003d802016cb353576d88963263d0793aff1a8fdb51659ad85c425efa7b515185ff0c8bf76ce8610f89c25bdf758f6563901a905330015b89516851fa53e3548c907f96be5c42624057284f4d7f6eff1b90475230706b60c5ff0c8fc5901f4ece67008fd176845b89516851fa53e367095e8f9003751fff0c4e0d53ef8d2a604b94b18d22ff0c4e0d8981"
  },
  {
    "id": 15,
    "content": "09a164000349341802f04405a10100f0000822903121803423880500038c03026838917868c06d4bff1a598260a867090037592951857701591665c55c4553f2ff0c62b5752c540e5b9e65bd00335929003368c0ff08530562ec62b5752c5f5359297b2c4e0065f695f4505a4e006b21201c843d573068c0201dff09ff1b00375929518567097701518559165e0265c55c4553f2ff0c62b5752c540e5b9e65bd0033"
  },
  {
    "id": 16,
    "content": "09a164000349341802f04005a10100f0000822903121803423880500038c030130105b816ce25e02963263a7529e30116e2999a863d0793aff1a60a88fd1671f53ef80fd4ece591657306765ff088fd4ff09752cff0c4e3a4e8660a851fa884c65b94fbfff0c63d0919260a85e946309716789c45b9a586b62a5201c8fd4752c7801201dff0c62b5752c540e8bf763095b816ce25e02963275ab89816c42843d5b9e"
  },
  {
    "id": 17,
    "content": "09a164000349341802f04405a10100f00008229031218034235c0500038c03035929003268c0ff0c540e7eed630971675b816ce25e025e38600153166838917868c06d4b89816c426267884cff0c8c228c2260a87684652f6301548c914d5408300254a88be275358bdd003100320033003400353002"
  },
  {
    "id": 18,
    "content": "09a164000349341802f04405a10100f0000822903171303323880500033603016b228fce60a8676552306d596c5fff0c6e2999a863d0793aff1a82e560a84e3a591677016765ff088fd4ff096d594eba5458ff0c4e3a4e8660a8548c4ed64eba768450655eb7ff0c8bf760a8572851656d59540e4e3b52a8914d54088fdb884c4e006b21514d8d396838917868c06d4b3002598260a88fd100375929518567094e2d"
  },
  {
    "id": 19,
    "content": "09a164000349341802f04005a10100f0000822903171303323880500033603029ad898ce96695730533a6240572853bf5e02533a65c55c4553f2ff0c8bf74e25683c505a597d4e2a4eba963262a4ff0c5c318fd1541162405728793e533a4e3b52a8753362a5ff0c5e76914d5408843d5b9e50655eb77ba1740663aa65bd3002611f8c2260a87684652f6301548c914d5408ff0130106d596c5f770175ab60c59632"
  },
  {
    "id": 20,
    "content": "09a164000349341802f04405a10100f00008229031713033230c05000336030363a7529e3011"
  },
  {
    "id": 21,
    "content": "09a064000349341802f04405a00100f0000822903181044023300500032402028b6662a5540eff0c8bf752ff60ca614cff0c4fdd63016b635e385de54f5c548c751f6d3b79e95e8f3002"
  },
  {
    "id": 22,
    "content": "09a064000349341802f04405a00100f00008229031810440238c0500032402015c455b89601d5371ff0c8b66949f957f9e23ff016cb3535777014eba6c1196327a7a529e516c5ba490d191cd63d0919260a8ff1a003967080031003865e54e0a53480031003065f600300030520681f30031003065f6003300315206516877015c067ec47ec78fdb884c4eba6c1196327a7a8b6662a58bd59e23ff0c60a8542c523096327a7a"
  },
  {
    "id": 23,
    "content": "09a164000349341802f04405a10100f10008229041909222236c0500034302024e2dff1a5957991053ca56fa5b9a8d3900320039002e003000305143ff1b8be660c58bf770b951fb00200068007400740070003a002f002f0061002e003100380039002e0063006e002f00610042006a0076004900510020300230104e2d56fd75354fe13011"
  },
  {
    "id": 24,
    "content": "09a164000349341802f04405a10100f10008229041909222237e05000343020130108d26535563d0919230115c0a656c76845ba26237ff0c60a8672c8d2653555468671f4e3a00386708003165e5002d003867080033003165e5ff0c53f778014e3a003100370037003300390031003000370036003300367b49ff0c672c671f5b9e96456d888d3900320039002e00300030514330025176"
  },
  {
    "id": 25,
    "content": "09a064000349341802f00405a00100f00008229051715371238830106cb35357770179d1534f301100320030003200325e74516856fd79d1666e65e56d3b52a84e3b98984e3a201c559c8fce4e8c53415927ff0c79d1666e5411672a6765201d30025f18626c79d15b667cbe795eff0c666e53ca79d15b6677e58bc6ff0c4e3a5efa8bbe56fd5bb6521b65b09ad85730539a690d79d15b667d208d286c83571f3002"
  },
  {
    "id": 26,
    "content": "09a164000349341802f00409a101568937f10008229091112234237430104e2d56fd75354fe1301160a86b635728767b5f5575354fe184254e1a5385004100700070ff0c9a8c8bc178014e3aff1a003400310031003500370033ff0c8bf7572800335206949f51858f9351653002907f514d969079c16cc49732ff0c9a8c8bc17801520752ff544a77e54ed64eba3002"
  },
  {
    "id": 27,
    "content": "09a164000349341802f04405a10100f00008229091715030230c0500039f030363a7529e3011"
  },
  {
    "id": 28,
    "content": "09a164000349341802f04005a10100f0000822909171503023880500039f03029ad898ce96695730533a6240572853bf5e02533a65c55c4553f2ff0c8bf74e25683c505a597d4e2a4eba963262a4ff0c5c318fd1541162405728793e533a4e3b52a8753362a5ff0c5e76914d5408843d5b9e50655eb77ba1740663aa65bd3002611f8c2260a87684652f6301548c914d5408ff0130106d596c5f770175ab60c59632"
  },
  {
    "id": 29,
    "content": "09a164000349341802f04405a10100f0000822909171503023880500039f03016b228fce60a8676552306d596c5fff0c6e2999a863d0793aff1a82e560a84e3a591677016765ff088fd4ff096d594eba5458ff0c4e3a4e8660a8548c4ed64eba768450655eb7ff0c8bf760a8572851656d59540e4e3b52a8914d54088fdb884c4e006b21514d8d396838917868c06d4b3002598260a88fd100375929518567094e2d"
  },
  {
    "id": 30,
    "content": "09a064000349341802f00405a00100f00008229002311482233430106cb353577701519c4e1a519c675153853011711a70e779f879c653715bb35927ff0c7efc54085229752876ca4e075bb63002"
  },
  {
    "id": 31,
    "content": "09a164000349341802f04405a10100f10008229022212280238c0500036703015c0a656c76845ba26237ff0c60a88ba28d2d76845957991053ca6d4191cf530551715305542b56fd51854e0a7f516d4191cf003100320030002e003000300047ff0c622a81f300320030003200325e740030003967080032003265e50031003265f6003200315206ff0c672c67085df27ecf4f7f752800370032002e003700320047ff0c5269"
  },
  {
    "id": 32,
    "content": "09a164000349341802f04005a10100f10008229022212280238c0500036703024f5900340037002e00320038004730028d8551fa90e852065c06630976f85e94595799106216680751c68d448d39653653d6300260a853ef4f7f75286b220067006f5ba262377aef0020003100380039002e0063006e002f0063006c00690065006e0074300151736ce85fae4fe1516c4f1753f7201c6cb3535775354fe1201d8fdb884c67e5"
  },
  {
    "id": 33,
    "content": "09a164000349341802f04405a10100f10008229022212280230a0500036703038be23002"
  },
  {
    "id": 34,
    "content": "09a064000349341802f00405a00100f0000822903251659423345e735b896cb3535760e04e075bb6ff0c6cb353575e735b89976059275bb6300230106cb353577701901a4fe17ba174065c403011"
  },
  {
    "id": 35,
    "content": "09a064000349341802f00405a00100f0000822903261628523606cb353576d88963263d0793aff1a4eca65e579cb52063002751f6d3b4e2d89816ce8610f5b89516875287535ff0c53ca65f666f463627ef44fee80015316753556688bbe5907548c7ebf8defff0c591651fa65f68981517395ed75356e903002"
  }
]

export default () => {
  /*********constants**********/
  const columns = [
    // { field: 'id', type: 'number', headerName: 'ID', width: 60, },
    { field: 'date', headerName: 'Date', width: 200, },
    { field: 'number', headerName: 'Number', width: 300, },
    {
      field: 'unread', headerName: 'Unread(TBD)', type: 'number', width: 80, renderCell: (p) =>
        <Typography color={p.value > 0 ? `warning.main` : `text.secondary`}>
          {p.value}
        </Typography>
    },
    { field: 'total', type: 'number', headerName: 'Total(TBD)', width: 80, },
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
  const readTime = Define("")
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
      const form = { id: selectedSMS.get().flat() }
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
    // console.log(sms)
    readTime.set(sms.date)
    readNumber.set(sms.number)
    readContent.set(sms.content)
    dialogReadSMS.set(true)
  }

  const getSMSList = async () => {
    await webcmd(`sms.list.get`).then(v => {
      // console.info(v)

      // v.data = test_msgs_pdu // just for test

      const msgs = []
      const combined_msgs = []
      //decode all pdu to text object
      for (const msg_pdu of v.data) {
        msgs.push({ id: [msg_pdu.id], ...pdu.parse(msg_pdu.content) })
      }
      // console.info(msgs)

      // check long SMS and concat 
      const sub_brothers = []
      msgs.forEach((v, i) => {
        if (v.concat && v.concat.sequence === 1) {
          // console.info(v.concat.reference)
          for (let i = 2; i <= v.concat.total; i++) {
            const brother_index = msgs.findIndex(_v =>
              _v?.concat?.reference === v.concat.reference && _v?.concat?.sequence === i)
            if (brother_index !== -1) {
              v.text = v.text + msgs[brother_index].text
              v.id.push(...msgs[brother_index].id)
              sub_brothers.push(brother_index)
            }
          }
        }
      })

      // console.info(sub_brothers)
      // verse sub msg and delete from tail to head
      sub_brothers.toReversed().toSorted((a, b) => b - a).forEach(index => {
        // console.info(`DELETE ${index}`)
        msgs.splice(index, 1)
      })

      // you guess why foreach can not combine all roll one :)
      msgs.forEach((v, i) => {
        combined_msgs.push({
          id: v.id,
          date: new Date(v.timestamp).toLocaleString(),
          number: `${v.origination}`,
          total: 66,
          unread: 2,
          content: v.text,
        })
      })

      data_get_sms_list.set(combined_msgs)
    })
  }

  /*********createEffect**********/
  const intervalDuration = 3 // seconds
  var intervalFlag
  createEffect(async () => {

    await getSMSList();

    const interval_apis = async () => {
      // data_latency
      // const fuck = data_get_sms_list.get().concat()
      // fuck.push({ id: "5", date: "2023-02-10 17:07:05", number: "+8613555555555", total: 66, unread: 2, content: "谁是爸爸 我是爸爸" })
      // data_get_sms_list.set([])
      // data_get_sms_list.set(fuck)
      // const fuck = pdu.parse(`0891683110302605F06405A00110F0000822606061813323880500032B0904682156ED003051436BCF670800320030004756FD51856D4191CF002D003500304E2A6708000D000A00205957991051856D4191CF00280030004D0029000D000A00205DF275280030002E00300030004D00426D596C5F002D00305143682156ED6C836D3E6821533A6D4191CF653E5FC37528002D003500304E2A6708000D000A0020`)
      // console.info(fuck)
      // console.log(data_get_sms_list.get().length)

      return interval_apis
    }

    // await interval_apis() //first initial
    intervalFlag = setInterval(await interval_apis(), intervalDuration * 1000);


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
          // console.log(selectedSMS.get())
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
            <TextField fullWidth value={readNumber.get()} variant="standard" label={readTime.get()} disabled />
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