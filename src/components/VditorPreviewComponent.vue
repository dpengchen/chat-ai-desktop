<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { defineProps, onMounted, ref, watch } from 'vue'

const props = defineProps({
  markdown: {
    type: String,
    required: true
  }
})

const previewRef = ref()
const regex = /\[\^(\d+)\^\]/g
//页面挂载之后
onMounted(() => {
  const value = props.markdown.replace(regex, '')
  Vditor.preview(previewRef.value, value, {
    theme: { current: 'light' },
    hljs: {
      style: 'github-dark',
      langs: true
    }
  })
})

watch(() => props.markdown, (value) => {
  value = value.replace(regex, '')
  Vditor.preview(previewRef.value, value, {
    theme: { current: 'light' },
    hljs: {
      style: 'github-dark',
      langs: true
    }
  })
})

</script>

<template>
  <div class="p-3">
    <div ref="previewRef" class="font-size"></div>
  </div>
</template>

<style lang="scss">
.vditor-reset {
  padding-right: 10px !important;
  padding-left: 10px !important;
}

.font-size {
  * {
    font-size: 14px;
  }
}
</style>
