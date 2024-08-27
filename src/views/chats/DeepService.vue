<script setup>
import { onMounted, reactive, ref } from 'vue'
import deepSeekStep from '@/assets/deepSeekSetp.png'
import deepSeek from '@/assets/deepSeek.png'
import { useStore } from 'vuex'
import { Message } from '@arco-design/web-vue'
import { requestHandle, sSEHandle } from '@/util/deepSeekRequestHandle'
import VditorPreviewComponent from '@/components/VditorPreviewComponent.vue'


//状态管理
const store = useStore()
//聊天信息
const chats = ref(store.state.deepChats)

//发送询问问题
const sendQuestion = () => {
  over.value = true
  //流模式
  if (chats.value.stream) {
    sSEHandle(store, settings.form, chats.value, question.value, (flag, answer, ctrl) => {
      if (!flag && answer != '[DONE]') {
        const data = JSON.parse(answer)
        chats.value['conversation_id'] = data.id
        chats.value.messages[chats.value.messages.length - 1].content += data.choices[0].delta.content
        return
      }
      ctrl.abort()
      over.value = false
    }, settings.form.requestModel)
    question.value = ''
    return
  }

  //回复模式
  requestHandle(store, settings.form, chats.value, question.value, settings.form.requestModel).then((response) => {
    const data = JSON.parse(response.data)
    chats.value['conversation_id'] = data.id
    chats.value.messages[chats.value.messages.length - 1].content = data.choices[0].delta.content
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
  form: store.state.configs.deep,
  submit: ({ values, errors }) => {
    if (errors) {
      return
    }
    store.commit('updateDeepChat', chats.value)
    store.commit('updateConfigsDeep', values)
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
        DeepSeek
        <a-space>
          <a-tooltip content="清除聊天信息">
            <a-button type="text" @click="()=>{chats.messages.length = 0;chats.conversation_id=null}">
              <IconDelete />
            </a-button>
          </a-tooltip>
          <a-space>
            <a-select v-model="chats.model">
              <template v-if="settings.form.requestModel == 'api'">
                <a-option value="deepseek-chat" label="对话模式" />
                <a-option value="deepseek-coder" label="代码模式" />
              </template>
              <template v-else>
                <a-option value="deepseek_chat" label="对话模式（代理）" />
                <a-option value="deepseek_code" label="代码模式（代理）" />
              </template>
            </a-select>
            <a-button type="text" @click="settings.visible = true">
              <IconSettings />
            </a-button>
          </a-space>
        </a-space>
      </div>
    </a-layout-header>
    <a-layout-content class="flex-fill overflow-hidden d-flex flex-column w-100">
      <div class="flex-fill overflow-y-scroll">
        <div v-for="(v,i) in chats.messages" :key="i" class="">
          <div class="d-flex align-items-start justify-content-end ms-5 my-2" v-if="v.role == 'user'">
            <div class="border rounded overflow-x-hidden">
              <VditorPreviewComponent :markdown="v.content" />
            </div>
            <div class="p-2">
              <img :src="deepSeek" width="35px">
            </div>
          </div>
          <div class="d-flex align-items-start justify-content-start me-5 my-2" v-else>
            <div class="p-2">
              <img :src="deepSeek" width="35px">
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
                   :rules="[{required:true,message:'请求模式不能为空'}]">
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
            <a-link>访问获取：https://platform.deepseek.com/api_keys</a-link>
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
        <a-image :src="deepSeekStep" width="100"></a-image>
      </a-form-item>
      <a-button class="w-100 mt-2" size="large" html-type="submit">修改</a-button>
    </a-form>
  </a-modal>

</template>

<style scoped lang="scss">
</style>
