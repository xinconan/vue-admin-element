<template>
  <div class="result-page-container">
    <ServerError />
    <div class="result-title">500</div>
    <div class="result-subtitle">啊哦！服务出现了问题，工程师在紧急抢修中！</div>
    <el-button type="primary" @click="goHome">回到首页</el-button>
  </div>
</template>
<script setup lang="ts">
import ServerError from '@/components/icon/server-error.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
  router.replace('/dashboard');
};
</script>

<style lang="scss">

</style>
