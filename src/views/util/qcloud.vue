<template>
  <div>
    <h2>腾讯云cos去水印链接转换</h2>
    <el-input v-model="srcUrl" placeholder="请输入链接" clearable />
    <el-button class="mt-3" type="primary" @click="transform">转换</el-button>
    <p>转换后的链接：</p>
    <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">
      {{ url }}
    </a>
    <h2>蚂蚁庄园时间计算</h2>
    <el-time-picker v-model="time"/>
    <el-button @click="calcTime">计算</el-button>
    <h3>加速前</h3>
    <p v-for="item in timeList" :key="item">{{ item }}</p>
    <h3>加速后</h3>
    <p v-for="item in timeList2" :key="item">{{ item }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import dayjs from 'dayjs';

const time = ref(new Date());
const srcUrl = ref('');
const url = ref('');
let timeList = reactive<string[]>([])
let timeList2 = reactive<string[]>([])

const transform = () => {
  const orgUrl = srcUrl.value;
  if (orgUrl) {
    const start = orgUrl.indexOf('?');
    const end = orgUrl.indexOf('&');
    url.value = orgUrl.substring(0, start + 1) + orgUrl.substring(end + 1);
  }
};

const calcTime = () => {
  let t = dayjs(time.value)
  timeList.length = 0;
  timeList2.length = 0;
  let i = 0;
  let t1 = t, t2 =t;
  while(i < 5) {
    t1 = t1.add(145, 'minute');
    timeList.push(t1.format('HH:mm'));
    t2 = t2.add(115, 'minute');
    timeList2.push(t2.format('HH:mm'));
    i++;
  }
}
</script>
