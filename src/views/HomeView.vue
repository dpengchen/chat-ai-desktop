<script setup>
import deepSeek from '@/assets/deepSeek.png'
import ty from '@/assets/ty.png'
import kimi from '@/assets/kimi.png'
import { reactive } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'
import { Message } from '@arco-design/web-vue'
//统一高度
const menuHeight = 35

//装填管理
const store = useStore()
//设置
const settings = reactive({
  //设置信息窗口
  visible: false,
  form: store.state.servers,
  submit: ({ values, errors }) => {
    if (errors) {
      return
    }
    //提交
    store.commit('updateServer', values)
    Message.success('提交成功')
    //关闭窗口
    settings.visible = false
  }
})

//按钮点击
const menuItemClick = (key) => {
  router.push(`/${key}`)
}

router.push('/kimi')
</script>
<template>
  <a-layout class="w-100 h-100">
    <a-layout-sider class="h-100 menu-bg-color" collapsed :collapsed-width="70">
      <div class="h-100 d-flex flex-column justify-content-between">
        <a-menu default-selected-keys="kimi" @menu-item-click="menuItemClick" :level-indent="20" class="w-100">
          <a-menu-item key="kimi">
            <template #icon>
              <div class="py-2">
                <img
                  :src="kimi"
                  :width="`${menuHeight}px`" :height="`${menuHeight}px`" />
              </div>
            </template>
            Kimi
          </a-menu-item>
          <a-menu-item key="ty">
            <template #icon>
              <div class="py-2">
                <img
                  :src="ty"
                  :width="`${menuHeight}px`" :height="`${menuHeight}px`" />
              </div>
            </template>
            通义千问
          </a-menu-item>
          <a-menu-item key="deep">
            <template #icon>
              <div class="py-2">
                <img
                  :src="deepSeek"
                  :width="`${menuHeight}px`" :height="`${menuHeight}px`" />
              </div>
            </template>
            DeepSeek
          </a-menu-item>
        </a-menu>
        <a-button type="text" class="w-100 py-4" @click="settings.visible = true">
          <template #icon>
            <IconSettings :size="18" />
          </template>
        </a-button>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>

  <a-modal title-align="start" :width="600" v-model:visible="settings.visible" :footer="null" :closable="false">
    <template #title>
      <a-space>
        <IconSettings />
        设置
      </a-space>
    </template>
    <a-form label-align="left" auto-label-width :model="settings.form" @submit="settings.submit">
      <a-form-item field="deep"
                   :rules="[{validator:(value, callback)=>{ if(!settings.form.deep || !settings.form.ty || !settings.form.kimi)callback('代理地址不能为空')},}]"
                   validate-trigger="blur">
        <template #label>
          <a-tooltip content="需要自建代理服务">
            代理地址
            <IconQuestionCircle />
          </a-tooltip>
        </template>
        <a-row class="w-100">
          <a-col class="mb-2">
            <a-input placeholder="深度地址" v-model="settings.form.deep" />
          </a-col>
          <a-col class="mb-2">
            <a-input placeholder="通义地址" v-model="settings.form.ty" />
          </a-col>
          <a-col>
            <a-input placeholder="Kimi地址" v-model="settings.form.kimi" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="唤醒热键：">
        <a-input default-value="Ctrl + Q" disabled></a-input>
      </a-form-item>

      <a-button class="w-100 mt-2" size="large" html-type="submit">修改</a-button>
    </a-form>
  </a-modal>
</template>

<style lang="scss">
.menu-bg-color {
  background-color: var(--color-menu-light-bg);

  .menu-icon-remove-bg {
    mix-blend-mode: multiply;
  }
}

</style>
<script setup>
</script>
