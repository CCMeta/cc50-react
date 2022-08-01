
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

export function CmdResultParser(raw, keyword) {
  let slice_on = raw.indexOf(keyword) + keyword.length
  let slice_off = raw.indexOf('\n', slice_on)
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



