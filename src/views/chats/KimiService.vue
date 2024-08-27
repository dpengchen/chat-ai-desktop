<script setup>
import { onMounted, reactive, ref } from 'vue'
import kimiStep from '@/assets/kimiStep.png'
import kimi from '@/assets/kimi.png'
import { useStore } from 'vuex'
import { Message } from '@arco-design/web-vue'
import { requestHandle, sSEHandle } from '@/util/kimiRequestHandle'
import VditorPreviewComponent from '@/components/VditorPreviewComponent.vue'


//状态管理
const store = useStore()
//聊天信息
const chats = ref(store.state.kimiChats)
const regex = /\[\^(\d+)\^\]/g

//发送询问问题
const sendQuestion = () => {
  over.value = true

  //流模式
  if (chats.value.stream) {
    sSEHandle(store, settings.form, chats.value, question.value, (flag, answer, ctrl) => {
      if (!flag && answer != '[DONE]') {
        const data = JSON.parse(`${answer}`)
        chats.value.conversation_id = data.id
        if (!data.choices) {
          return
        }
        const content = data.choices[0].delta.content
        if (content) {
          chats.value.messages[chats.value.messages.length - 1].content += content
        }
        return
      }
      chats.value.messages[chats.value.messages.length - 1].content = chats.value.messages[chats.value.messages.length - 1].content.replaceAll(regex, '')
      ctrl.abort()
      over.value = false
    }, settings.form.requestModel)
    question.value = ''
    return
  }

  //回复模式
  requestHandle(store, settings.form, chats.value, question.value, settings.form.requestModel).then((response) => {
    const data = response.data
    chats.value['conversation_id'] = data.id
    chats.value.messages[chats.value.messages.length - 1].content = data.choices[0].message.content.replaceAll(regex, '')
    over.value = false
    question.value = ''
  }).catch(() => {
    over.value = false
  })
}

//是否响应结束
const over = ref(false)
//问题
const question = ref()

//设置
const settings = reactive({
  visible: false,
  form: store.state.configs.kimi,
  submit: ({ values, errors }) => {
    if (errors) {
      return
    }
    store.commit('updateKimiChat', chats.value)
    store.commit('updateConfigsKimi', values)
    Message.success('提交成功')
    //关闭窗口
    settings.visible = false
  }
})

//当页面显示的时候自动获取焦点
const questionInputRef = ref()

onMounted(() => {
  const { ipcRenderer } = require('electron')
  ipcRenderer.on('global-shortcut', () => {
    if (questionInputRef.value != null) {
      questionInputRef.value.focus()
    }
  })
})

</script>

<template>
  <a-layout class="vh-100 d-flex overflow-hidden">
    <a-layout-header class="p-2 px-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center">
        Kimi
        <a-space>
          <a-tooltip content="清除聊天信息，本地记录清除；还需到官网上进行全部清除">
            <a-button type="text" @click="()=>{chats.messages.length = 0;chats.conversation_id=null}">
              <IconDelete />
            </a-button>
          </a-tooltip>
          <a-space>
            <a-select v-model="chats.use_search">
              <a-option :value="true">联网搜索</a-option>
              <a-option :value="false">关闭联网</a-option>
            </a-select>
            <a-button type="text" @click="settings.visible = true">
              <IconSettings />
            </a-button>
          </a-space>
        </a-space>
      </div>
    </a-layout-header>
    <a-layout-content class="flex-fill overflow-hidden d-flex flex-column">
      <div class="flex-fill overflow-y-scroll ">
        <div v-for="(v,i) in chats.messages" :key="i">
          <div class="d-flex align-items-start justify-content-end ms-5 my-2" v-if="v.role == 'user'">
            <div class="border rounded overflow-x-hidden">
              <VditorPreviewComponent :markdown="v.content" />
            </div>
            <div class="p-2">
              <img :src="kimi" width="35px">
            </div>
          </div>
          <div class="d-flex align-items-start justify-content-start me-5 my-2" v-else>
            <div class="p-2">
              <img :src="kimi" width="35px">
            </div>
            <div class="border rounded overflow-x-hidden">
              <VditorPreviewComponent :markdown="v.content" />
            </div>
          </div>
        </div>
      </div>

      <!--问题输入框 start-->
      <div class="position-relative p-2 border-top">
        <a-textarea ref="questionInputRef" v-model="question" @keyup.ctrl.enter="sendQuestion"
                    :auto-size="{maxRows:10,minRows:5}"
                    class="rounded">
        </a-textarea>
        <a-button @click="sendQuestion" type="primary" size="small" shape="round"
                  class="position-absolute bottom-0 end-0 mb-4 me-3 " style="z-index: 99">
          <template #icon>
            <IconSend />
          </template>
          发送
        </a-button>
        <!--        <VditorEditComponent @send="sendQuestion" :over="over" />-->
      </div>
      <!--问题输入框 end-->
    </a-layout-content>
  </a-layout>
  <a-modal title-align="start" :width="600" v-model:visible="settings.visible" :footer="null" :closable="false">
    <template #title>
      <a-space>
        <IconSettings />
        设置
      </a-space>
    </template>
    <a-form label-align="left" auto-label-width :model="settings.form"
            @submit="settings.submit">
      <a-form-item label="请求模式" field="requestModel" validate-trigger="blur"
                   hide-asterisk
                   :rules="[{required:true,message:'请求模式不能为空'}]"
      >
        <a-select :default-value="true" v-model="settings.form.requestModel">
          <a-option value="api">API（api Token必填）</a-option>
          <a-option value="proxy">代理（身份验证必填）</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="响应模式" field="stream" validate-trigger="blur"
                   hide-asterisk
      >
        <a-select :default-value="true" v-model="chats.stream">
          <a-option :value="true">流模式</a-option>
          <a-option :value="false">回复模式</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="api Token" field="apiToken"
                   :rules="settings.form.requestModel == 'api'?[{required:true,message:'api Token不能为空'}] : null"
                   validate-trigger="blur" hide-asterisk>
        <a-row>
          <a-col>
            <a-input v-model="settings.form.apiToken" placeholder="官方获取token"></a-input>
          </a-col>
          <a-col>
            <a-link>访问获取：https://platform.moonshot.cn/console/api-keys</a-link>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="身份验证" field="authority"
                   :rules="settings.form.requestModel == 'proxy' ?[{required:true,message:'身份验证不能为空'}]:null"
                   validate-trigger="blur" hide-asterisk>
        <a-textarea v-model="settings.form.authority" :auto-size="{minRows:5}"
                    placeholder="多个 userToken value 使用 , 来分割英文符号">
        </a-textarea>
      </a-form-item>
      <a-form-item label="获取方式">
        <a-image :src="kimiStep" width="100"></a-image>
      </a-form-item>
      <a-button class="w-100 mt-2" size="large" html-type="submit">修改</a-button>
    </a-form>
  </a-modal>

</template>

<style scoped lang="scss">
</style>
