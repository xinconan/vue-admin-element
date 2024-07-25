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
<script setup>
import fieldCollapse from '@/components/fieldCollapse';
import baseForm from '@/components/baseForm';
</script>