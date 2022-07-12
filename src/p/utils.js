
import { createSignal, createStore } from 'react-solid-state'

export function Define(value = '') {
  const [getValue, setValue] = createSignal(value)
  return { get: getValue, set: setValue }
}

export function Store(value) {
  const [getValue, setValue] = createStore(value)
  return { get: getValue, set: setValue }
}




export async function fetching(body) {

  // const server = 'http://192.168.1.1/api'
  const server = '/d/'
  const method = 'post'
  const mode = 'cors'// Access-Control-Allow-Origin: http://ccmeta.com:3000
  const credentials = 'include'// Access-Control-Allow-Credentials: true 

  if (true) {
    const res = await fetch(server + body)
    if (body.indexOf("=1") === -1) {
      // window.location.href = '#'
    }
    return JSON.parse(await res.text())
  }

  const options = {
    method,
    body,
    mode,
    credentials,
    // headers,
  }
  const res = await fetch(server, options)
  return JSON.parse(await res.text())
}



