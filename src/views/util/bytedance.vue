<template>
  <div>
    <h2>飞书文档（PDF、PPTX、xlsx）下载链接</h2>
    <el-radio-group v-model="type">
      <el-radio label="ppt">PPTX</el-radio>
      <el-radio label="pdf">PDF</el-radio>
      <el-radio label="xlsx">xlsx</el-radio>
    </el-radio-group>
    <el-input v-model="srcUrl" placeholder="请输入链接" clearable></el-input>
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
  if (srcUrl.value) {
    if (type.value === 'ppt') {
      // https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/preview/REn1bft7QoER8hxlUqPcVhGdnrc?preview_type=9&version=7193904369966956548&mount_point=explorer
      // https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/preview/REn1bft7QoER8hxlUqPcVhGdnrc?preview_type=16&version=7193904369966956548&mount_point=explorer
      url.value = srcUrl.value.replace('preview_type=9', 'preview_type=16');
    } else if (type.value === 'pdf') {
      // https://bytedance.feishu.cn/space/api/box/stream/download/preview_sub/BsO2btmpEoCxgcxu4DwcwuM0nfg?preview_type=22&sub_id=txt_all.json&version=7197997666453716994
      // https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/preview/REn1bft7QoER8hxlUqPcVhGdnrc?preview_type=9&version=7193904369966956548&mount_point=explorer
      url.value = srcUrl.value
        .replace('bytedance.feishu.cn', 'internal-api-drive-stream.feishu.cn')
        .replace('preview_sub', 'preview')
        .replace('preview_type=22', 'preview_type=9')
        .replace('&sub_id=txt_all.json', '');
    } else if (type.value === 'xlsx') {
      // https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/preview_sub/boxcnjHQTrdEcmjXXA5WSDrqtOb?preview_type=8&version=7219182669375258628&mount_point=explorer&sub_id=style
      // https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/preview/boxcnjHQTrdEcmjXXA5WSDrqtOb?preview_type=16&version=7219182669375258628&mount_point=explorer&sub_id=style
      url.value = srcUrl.value
        .replace('preview_sub', 'preview')
        .replace('preview_type=8', 'preview_type=16');
    }
  }
};
</script>
