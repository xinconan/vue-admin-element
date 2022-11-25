<template>
  <el-header>
    <section class="head-container">
      <div class="head-left">
        <el-icon :size="20" class="collapse-icon" @click="toggle">
          <Expand v-if="collapse" />
          <Fold v-else />
        </el-icon>
      </div>
      <div class="head-right">
        <el-icon :size="20" @click="toggleScreen">
          <ExitFullScreen v-if="isFullscreen" />
          <FullScreen v-else />
        </el-icon>
      </div>
    </section>
  </el-header>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store/modules/app.ts';
import ExitFullScreen from '@/components/icon/exit-full-screen.vue';

// const router = useRouter();

const store = useAppStore();
const { collapse } = storeToRefs(store);

const toggle = () => {
  store.toggleCollapse();
};

const { isFullscreen, toggle: toggleScreen } = useFullscreen();
</script>

<style lang="scss">
.head-container {
  display: flex;
  align-items: center;
  height: 100%;

  .el-icon {
    cursor: pointer;
  }

  .head-right {
    margin-left: auto;
  }
}
</style>
