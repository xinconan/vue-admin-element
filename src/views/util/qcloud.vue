<template>
  <div>
    <h2>腾讯云cos去水印链接转换</h2>
    <el-input v-model="srcUrl" placeholder="请输入链接" clearable />
    <el-button class="mt-3" type="primary" @click="transform">转换</el-button>
    <p>转换后的链接：</p>
    <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
      {{ url }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const type = ref('ppt');
const srcUrl = ref('');
const url = ref('');

const transform = () => {
  const orgUrl = srcUrl.value;
  if (orgUrl) {
    const start = orgUrl.indexOf('?');
    const end = orgUrl.indexOf('&');
    url.value = orgUrl.substring(0, start + 1) + orgUrl.substring(end + 1);
  }
};
</script>
