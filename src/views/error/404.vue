<template>
  <div class="result-page-container">
    <NotFound />
    <div class="result-title">404</div>
    <div class="result-subtitle">啊哦！你访问的页面不存在</div>
    <el-button type="primary" @click="goHome">回到首页</el-button>
  </div>
</template>
<script setup lang="ts">
import NotFound from '@/components/icon/not-found.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
  router.replace('/dashboard');
};
</script>

<style lang="scss">

</style>
