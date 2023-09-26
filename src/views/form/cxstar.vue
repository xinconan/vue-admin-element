<template>
  <div class="cxstar">
    <el-tabs v-model="activeId">
      <el-tab-pane
        :label="item.name"
        v-for="item in tabs"
        :name="item.id"
        :lazy="true"
      >
        <cxstarInfo :pinst="item.pinst" :ifbg="item.ifbg" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { libraries } from '@/utils/const';
import { reactive, ref } from 'vue';
import cxstarInfo from './components/cxstar-info.vue';

const tabs = reactive(libraries);

const activeId = ref('hblib');
</script>

<style lang="scss" scoped>
.cxstar {
  :deep(.el-tabs__content) {
    height: calc(100vh - 214px);
  }
}
</style>
