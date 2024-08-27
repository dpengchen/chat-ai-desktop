import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'


export default createStore({
  state: {
    //用来记录服务地址信息
    servers: { ty: null, deep: null, kimi: null },
    //用来记录各个服务token配置信息
    configs: {
      ty: {
        requestModel: 'api',
        apiToken: '',
        authority: null
      }, deep: {
        requestModel: 'api', //api or proxy
        apiToken: '',
        authority: null
      }, kimi: {
        requestModel: 'api', //api or proxy
        apiToken: '',
        authority: null
      }
    },
    tyChats: {
      conversation_id: null,
      // model必须为deepseek_chat或deepseek_code
      model: 'qwen-turbo',
      messages: [],
      // 如果使用SSE流请设置为true，默认false
      stream: true
    },
    deepChats: {
      conversation_id: null,
      // model必须为deepseek_chat或deepseek_code
      model: 'deepseek-chat',
      messages: [],
      // 如果使用SSE流请设置为true，默认false
      stream: true
    },
    kimiChats: {
      conversation_id: null,
      // model必须为deepseek_chat或deepseek_code
      model: 'moonshot-v1-8k',
      messages: [],
      //开启联网搜索
      use_search: true,
      // 如果使用SSE流请设置为true，默认false
      stream: true
    }

  },
  getters: {},
  mutations: {
    updateServer(state, playload) {
      state.servers = playload
    },
    updateConfigsTy(state, playload) {
      state.configs.ty = playload
    },
    updateConfigsDeep(state, playload) {
      state.configs.deep = playload
    },
    updateConfigsKimi(state, playload) {
      state.configs.kimi = playload
    },
    updateTYChat(state, playload) {
      state.tyChats = playload
    },
    updateDeepChat(state, playload) {
      state.deepChats = playload
    },
    updateKimiChat(state, playload) {
      state.kimiChats = playload
    }
  },
  actions: {},
  modules: {},
  //配置插件，持久化存储
  plugins: [
    createPersistedState({
      key: 'chat-ai-desktop',
      paths: ['servers', 'configs', 'tyChats', 'deepChats'],
      storage: localStorage
    })
  ]
})
