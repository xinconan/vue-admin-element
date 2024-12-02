<script setup lang="ts"></script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
.app-container {
  height: 100%;
  
  .el-switch__core .el-switch__inner .is-icon, .el-switch__core .el-switch__inner .is-text {
    color: var(--page-text-color);
  }
}
.result-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 400px;
  padding-top: 50px;

  .result-title {
    color: var(--page-text-color);
    font-size: 24px;
    line-height: 1.8;
  }
  .result-subtitle {
    color: var(--el-text-color-primary);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
  }
}
#nprogress .bar {
  background: var(--el-color-primary) !important;
}
</style>
