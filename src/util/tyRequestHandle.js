import { Message } from '@arco-design/web-vue'
import { requestSSE } from '@/util/request'
import axios from 'axios'


function commonsFunc(store, chats, question, requestModel, url, token, settings) {

  let sendData = null
  let flag = true

  //检查配置是否有效
  if (requestModel == 'proxy') {
    if (!chats.model) {
      Message.error('请选择chat对话模式局部设置旁边')
      flag = false
      return { sendData, url, token, flag }
    }
    if (!store.state.servers.ty) {
      Message.error('请先前往全局设置配置代理地址')
      flag = false
      return { sendData, url, token, flag }
    }
    if (!settings.authority) {
      Message.error('请先前往当前设置配置身份验证')
      flag = false
      return { sendData, url, token, flag }
    }
  } else {
    if (!settings.apiToken) {
      Message.error('请先前往当前设置配置apiToken')
      flag = false
      return { sendData, url, token, flag }
    }
  }

  //将本轮询问添加到信息中
  chats.messages.push({
    role: 'user',
    content: question
  })

  //深拷贝
  sendData = JSON.parse(JSON.stringify(chats))
  sendData.messages = [sendData.messages.pop()]

  //采用官方模式则替换url和token值，并删除conversation_id
  if (requestModel == 'api') {
    url = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    delete sendData.conversation_id
    token = settings.apiToken
  } else {
    //代理模式如果没有值则删除
    if (sendData.conversation_id == null) {
      delete sendData.conversation_id
    }
  }

  //添加AI响应
  chats.messages.push({
    role: 'assistant',
    content: ''
  })
  return { sendData, url, token, flag }
}

/**
 * 代理模式SSE处理
 * @param store 状态
 * @param settings  配置
 * @param chats  聊天记录
 * @param question  当前询问问题
 * @param callback 回调函数用于处理SSE响应
 * @param requestModel 值为api 则是官方 proxy 则是代理
 */
export const sSEHandle = (store, settings, chats, question, callback, requestModel) => {
  let url = store.state.servers.ty
  let token = settings.authority

  const __ret = commonsFunc(store, chats, question, requestModel, url, token, settings)
  const sendData = __ret.sendData
  url = __ret.url
  token = __ret.token

  //是否通过验证
  if (!__ret.flag) {
    return
  }

  //发送流请求
  requestSSE(url, sendData, { Authorization: `Bearer ${token}` }, callback)
}

/**
 * 请求响应模式
 * @param store 状态
 * @param settings  配置
 * @param chats  聊天记录
 * @param question  当前询问问题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const requestHandle = (store, settings, chats, question, requestModel) => {
  let url = store.state.servers.ty
  let token = settings.authority

  const __ret = commonsFunc(store, chats, question, requestModel, url, token, settings)
  const sendData = __ret.sendData
  url = __ret.url
  token = __ret.token

  //是否通过验证
  if (!__ret.flag) {
    return Promise.reject('未通过验证')
  }

  return axios.post(url, sendData, { headers: { Authorization: `Bearer ${token}` } })
}

