//选择使用SSE流模式
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { Message } from '@arco-design/web-vue'
import axios from 'axios'

export const requestSSE = (url, data, headers, callback) => {
  headers['Content-Type'] = 'application/json;charset=utf8'
  const ctrl = new AbortController()
  fetchEventSource(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    signal: ctrl.signal,
    openWhenHidden: true,
    onmessage(msg) {
      callback(false, msg.data, ctrl)
    },
    onclose() {
      callback(true, null, ctrl)
      ctrl.abort()
    },
    onerror(err) {
      callback(true, null, ctrl)
      ctrl.abort()
      Message.error(JSON.stringify(err))
    }
  })
}

export const request = (url, data, headers) => {
  return axios.post(url, data, {
    headers: headers
  })
}
