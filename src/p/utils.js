
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
  switch (type) {
    case 'login':
      path = `/cgi-bin/luci`
      break;
    case 'webcmd':
      path = `/cgi-bin/luci/admin/mtk/webcmd`
      break;
    case 'wifi':
      path = `/cgi-bin/luci/admin/mtk/wifi${subpath}`
      method = 'get'
      body = null
      break;
    default:
      break;
  }

  const options = {
    method, body, mode: 'cors', credentials: 'include', // headers,
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
  const form = new FormData()
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



