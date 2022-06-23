<template>
  <div class="result-page-container">
    <Unauthorized />
    <div class="result-title">403</div>
    <div class="result-subtitle">啊哦！你没有访问该页面的权限</div>
    <el-button type="primary" @click="goHome">回到首页</el-button>
  </div>
</template>
<script setup lang="ts">
import Unauthorized from '@/components/icon/unauthorized.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
  router.replace('/dashboard');
};
</script>

<style lang="scss">

</style>
