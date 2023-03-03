<template>
  <el-header>
    <section class="head-container">
      <div class="head-left">
        <el-icon :size="20" class="collapse-icon" @click="toggle">
          <Expand v-if="collapse" />
          <Fold v-else />
        </el-icon>
      </div>
      <div class="head-right flex items-center">
        <el-switch
          v-model="isDark"
          style="--el-switch-on-color: #3a3a3a;"
          class="mr-3"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
        />
        <el-icon :size="20" @click="toggleScreen">
          <ExitFullScreen v-if="isFullscreen" />
          <FullScreen v-else />
        </el-icon>
        <el-dropdown @command="onCommand">
          <div class="cursor-pointer flex items-center ml-3">
            <el-avatar :src="user.avatar" :size="30" />
            <span class="ml-3">{{ user.name }}</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </template>
        </el-dropdown>
      </div>
    </section>
  </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFullscreen, useDark } from '@vueuse/core';
import { useAppStore } from '@/store/modules/app';
import ExitFullScreen from '@/components/icon/exit-full-screen.vue';
import { Sunny, Moon } from '@element-plus/icons-vue';

const router = useRouter();

const store = useAppStore();
const { collapse, user } = storeToRefs(store);

const toggle = () => {
  store.toggleCollapse();
};

const { isFullscreen, toggle: toggleScreen } = useFullscreen();
const isDark = useDark();

const onCommand = (item: string) => {
  if (item === 'logout') {
    store.logout();
    router.push('/login');
  }
};
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
