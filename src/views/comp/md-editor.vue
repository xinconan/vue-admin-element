<template>
  <div>
    <MdEditor v-model="markdownContent" height="500px" :theme="theme" />
    <el-button @click="showContent" type="primary">显示内容</el-button>
    <MdPreview :model-value="markdownContent" :theme="theme" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useDark } from '@vueuse/core';

const markdownContent = ref('');
const isDark = useDark();

const theme = computed(() => {
  return isDark.value ? 'dark' : 'light';
});

const showContent = () => {
  console.log(markdownContent.value); // 获取 Markdown 格式内容
};
</script>

<style scoped lang="scss">
:deep(.md-editor-previewOnly) {
  padding: 10px 20px;
}
</style>
