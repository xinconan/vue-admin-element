<template>
  <img style="width: 400px" v-if="imgUrl" :src="imgUrl" />
  <el-upload
    ref="upload"
    :limit="1"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="onFileChange"
    accept=".png,.jpg,.jpeg,.gif"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import type { UploadFile, UploadInstance } from 'element-plus';
import { onUnmounted, ref } from 'vue';

const upload = ref<UploadInstance>();
const imgUrl = ref<string | null>(null);

const onFileChange = (uploadFile: UploadFile) => {
  imgUrl.value = window.URL.createObjectURL(uploadFile.raw!);
};

onUnmounted(() => {
  if (imgUrl.value) {
    window.URL.revokeObjectURL(imgUrl.value)
  }
})
</script>
