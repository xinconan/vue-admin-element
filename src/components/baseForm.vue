<template>
  <el-form-item v-for="item of list" :key="item" ref="itemRef" label="测试">
    <el-input></el-input>
  </el-form-item>
  
</template>
<script setup>
import { reactive, ref } from 'vue';

const COMPONENT_NAME = 'BaseForm'

defineOptions({
  name: COMPONENT_NAME,
})
const list = reactive([1,2,3,4,5])
const itemRef = ref()
defineExpose({
  itemRef,
})
</script>