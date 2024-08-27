import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//引入ARCO UI
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

//导入bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

const app = createApp(App)
//初始 arcoUI
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.use(store).use(router).mount('#app')
