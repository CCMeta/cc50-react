
import { createSignal, createStore } from 'react-solid-state'
export { rpc } from './rpc'

export function Define(value = '') {
  const [getValue, setValue] = createSignal(value)
  return { get: getValue, set: setValue }
}

export function Store(value = '') {
  const [getValue, setValue] = createStore(value)
  return { get: getValue, set: setValue }
}

export const secondsToWatch = v => {
  var sec_num = parseInt(v, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

export async function fetching(body, type = `login`, subpath = ``) {
  let path = ''
  let method = 'post'
  const headers = {}
  switch (type) {
    case 'login':
      path = `/cgi-bin/luci`
      break;
    case 'webcmd':
      // path = `/cgi-bin/luci/admin/mtk/webcmd`
      path = `/cgi-bin/cgi-exec`
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      break;
    case 'wifi':
      path = `/cgi-bin/luci/admin/mtk/wifi${subpath}`
      method = 'get'
      break;
    case 'usage':
      path = `/cgi-bin/luci/admin/network/usage/usage_data`
      method = 'get'
      break;
    default:
      break;
  }

  const options = {
    method, body, mode: 'cors', credentials: 'include', headers,
  }

  const res = await fetch(path, options)
  const res_text = await res.text()

  try {
    return JSON.parse(res_text)
  } catch (e) {
    // console.log(e)
  }
  return res_text
}

export function CmdResultParser(raw, keyword, endword = '\n') {
  let slice_on = raw.indexOf(keyword) + keyword.length
  let slice_off = raw.indexOf(endword, slice_on)
  const result = raw.slice(slice_on, slice_off)
  return result
}

export function FormBuilder(data) {
  // const form = new FormData()
  const form = new URLSearchParams()
  for (let i in data) {
    form.append(i, data[i])
  }
  return form
}

export const bytesToHuman = (value, size = "B") => {
  if (!value || value === 0) return '0 B';
  const unit = 1024
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const times = Math.floor(Math.log(value) / Math.log(unit))
  return (value / Math.pow(unit, times)).toFixed(2) + ' ' + sizes[times + sizes.indexOf(size)]
}

export const dBmToQuality = dBm => Math.min((dBm + 100) * 2, 100)

export const intToColor = (value, mode = `asc`) =>
  mode === `asc`
    ? (value > 75 ? `error` : value > 50 ? `warning` : value > 25 ? `info` : value > -1 ? `success` : `inherit`)
    : (value > 75 ? `success` : value > 50 ? `info` : value > 25 ? `warning` : value > -1 ? `error` : `inherit`)

export const boolToInt = v => {
  switch (v) {
    case true:
      return 1;
    case false:
      return 0;
    case 1:
      return true;
    case 0:
      return false;
  }
}

export const MAP_WirelessMode = {
  "0": "B/G mixed",
  "1": "B only",
  "4": "G only",
  "9": "B/G/GN mixed",
  "16": "B/G/GN/AX mixed",
  "2": "A only",
  "8": "A/N in 5 band",
  "14": "A/AC/AN mixed",
  "15": "AC/AN mixed",
  "17": "AC/AN/AX mixed",
}

/**
 * This function is for webcmd hello only 22/11/23 
 * @param {*} action API method you want call
 * @param {*} data API datas object will be pack to JSON
 * @returns API response data
 */
export async function webcmd(action, data = ``) {
  // const path = `/cgi-bin/luci/admin/mtk/webcmd`
  const path = `/cgi-bin/cgi-hell`
  const method = 'post'

  // This replace is for char slash and char quote.
  // To replace single char and the result will be `hello xxx.xxx "{\"key\":\"value\"}"`
  const data_json = data ?
    // `"${JSON.stringify(data).replaceAll(`\\`, `\\\\`).replaceAll(`"`, `\\\"`)}"` : ``
    // `${JSON.stringify(data).replaceAll(`\\`, `\\\\`).replaceAll(`"`, `\\\"`)}` : ``
    `${JSON.stringify(data)}` : ``

  const body = FormBuilder({
    "sessionid": sessionStorage.getItem('sid'),
    "command": `hellapi ${action} ${data_json}`,
    // "command": `/usr/sbin/iptables --line-numbers -w -nvxL -t nat`,
    // "cmd": `hellapi ${action} ${data_json}`,
    // "token": sessionStorage.getItem('sid'),
  })

  const options = {
    method, body, mode: 'cors', credentials: 'include', // headers,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }

  const res = await fetch(path, options)
  const res_text = await res.text()

  try {
    const result = JSON.parse(res_text)
    return result
  } catch (e) {
    console.log(e)
    console.log(`Error: ${res_text}`)
  }
  return res_text
}

