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
//页面挂载之后
onMounted(() => {
  Vditor.preview(previewRef.value, props.markdown, {
    theme: { current: 'light' },
    hljs: {
      style: 'github-dark',
      langs: true
    }
  })
})

//复制文本内容
const copy = () => {
  navigator.clipboard.writeText(props.markdown)
}

watch(() => props.markdown, (value) => {
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
  <div class="p-3 position-relative">
    <a-button class="position-absolute end-0 top-0" type="text" shape="round" @click="copy">
      <template #icon>
        <IconCopy />
      </template>
    </a-button>
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
