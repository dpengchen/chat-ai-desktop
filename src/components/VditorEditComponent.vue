<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { Message } from '@arco-design/web-vue'


defineProps({
  over: {
    type: Boolean,
    required: true
  }
})

//父子通信
const emits = defineEmits(['send'])

//编辑器实例DOM
const editorRef = ref()

//vditor 实例
let instance = null
//页面挂载之后
onMounted(() => {
  console.log(editorRef.value)
  instance = new Vditor(editorRef.value, {
    cache: {
      enable: false
    },
    width: '100%',
    height: '150px',
    minHeight: '150px',
    toolbar: [],
    resize: {
      enable: false
    }
  })
})

//获取输入值
const getVditorValue = () => {
  const value = instance.getValue()
  if (!value.trim()) {
    Message.error('问题不能为空！')
    return
  }
  instance.setValue('')
  emits('send', value)
}


const { ipcRenderer } = require('electron')
ipcRenderer.on('global-shortcut',()=>{
  //获得输入
  instance.focus()
})

</script>

<template>
  <div class="w-100   p-3 border-top">
    <div class="position-relative ">
      <div ref="editorRef"></div>
      <a-button @click="getVditorValue" class="position-absolute bottom-0 end-0 m-2 bg-primary text-white"
                :disabled="over">
        <template #icon>
          <IconSend />
        </template>
        发送
      </a-button>
    </div>
  </div>
</template>

<style lang="scss">
.vditor-reset {
  padding-right: 10px !important;
  padding-left: 10px !important;
}
</style>
