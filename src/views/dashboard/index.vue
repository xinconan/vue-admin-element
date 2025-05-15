<template>
  <div>dashboard</div>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <el-form cols="3">
    <fieldCollapse>
      <baseForm/>
    </fieldCollapse>
    
  </el-form>
</template>
<script lang="ts" setup>
import fieldCollapse from '@/components/fieldCollapse.vue';
import baseForm from '@/components/baseForm.vue';
</script>