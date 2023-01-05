<template>
  <el-container class="layout-container">
    <Sidebar />
    <el-container>
      <Header />
      <el-main class="main-container">
        <router-view />
      </el-main>
      <el-footer class="footer-container">
        <p>Copyright ©2022-present Xinconan</p>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Sidebar from './components/sidebar.vue';
import Header from './components/header.vue';
</script>

<style lang="scss">
.layout-container {
  height: 100%;
}
.main-container {
  background-color: var(--page-bg-color);
}
.footer-container {
  background-color: var(--page-bg-color);
  color: var(--footer-text-color);
  display: flex;
  align-items: center;

  p {
    text-align: center;
    width: 100%;
  }
}
</style>
