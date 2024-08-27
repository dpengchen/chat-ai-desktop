<template>
  <router-view></router-view>
</template>
<style>
html, body, #app {
  width: 100%;
  height: 100%;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 12px; /* 滚动条宽度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1; /* 轨道背景色 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #888; /* 滑块背景色 */
  border-radius: 6px; /* 滑块圆角 */
}

/* 滚动条滑块悬停状态 */
::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滑块悬停时的背景色 */
}

/* 滚动条按钮（上下箭头） */
::-webkit-scrollbar-button {
  display: none; /* 隐藏滚动条按钮 */
}

/* 滚动条角 */
::-webkit-scrollbar-corner {
  background: #f1f1f1; /* 滚动条角背景色 */
}
</style>
