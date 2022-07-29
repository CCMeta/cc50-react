import axios from 'axios'

const api_host_ubus = '/cgi-bin/luci/admin/ubus'
const api_host_webcmd = '/cgi-bin/luci/admin/mtk/webcmd'

export const rpc = {}

let RPC_ID = 1

function sid() {
  return sessionStorage.getItem('sid') || ''
}

rpc.request = function (method, params, url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const req = {
      jsonrpc: '2.0',
      id: RPC_ID++,
      method,
      params
    }

    axios.post(url, req, { timeout }).then(res => {
      res = res.data

      if (typeof (res) !== 'object' || res.jsonrpc !== '2.0')
        throw new Error('rpc request: Invalid msg')
      if (res.id !== req.id)
        throw new Error('No related request for JSON response')
      if (typeof (res.error) === 'object')
        return reject(JSON.stringify({ req, error: res.error }))

      resolve(res.result)
    }).catch(err => reject(err))
  })
}

rpc.post = function (target, action, object = {}, type = 'ubus') {
  switch (type) {
    case 'webcmd':
      return this.request('call', [sid(), target, action, object], api_host_webcmd)
    case 'ubus':
    default:
      return this.request('call', [sid(), target, action, object], api_host_ubus)
  }
}


// rpc.call = function (object, method, params, timeout) {
//   if (typeof params !== 'object') params = {}
//   return this.request('call', [sid(), object, method, params], timeout)
// }

// rpc.ubus = function (object, method, params, timeout) {
//   return this.request('call', [sid(), 'ubus', 'call', { object, method, params }], timeout)
// }

// rpc.login = function (username, password) {
//   return this.request('login', {
//     username,
//     password
//   })
// }

// rpc.logout = function () {
//   return this.request('logout', { sid: sid() })
// }

// rpc.alive = function () {
//   return this.request('alive', { sid: sid() })
// }
