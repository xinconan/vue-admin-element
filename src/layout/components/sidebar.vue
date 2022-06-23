<template>
  <el-aside :class="{ collapse: collapse, 'sidebar-container': true }">
    <div class="logo-wrap">VueAdmin</div>
    <el-scrollbar>
      <el-menu
        :default-active="menuActive"
        :collapse="collapse"
        @open="handleOpen"
      >
        <el-menu-item index="home" @click="onMenuClick('home')">
          <el-icon>
            <Menu />
          </el-icon>
          <template #title>Home</template>
        </el-menu-item>
        <el-sub-menu index="form">
          <template #title>
            <el-icon>
              <Document />
            </el-icon>
            <span>form表单</span>
          </template>
          <el-menu-item index="form-1">表单1</el-menu-item>
          <el-menu-item index="form-2" @click="onMenuClick('form1')"
            >表单2</el-menu-item
          >
        </el-sub-menu>
        <el-sub-menu index="form2">
          <template #title>
            <el-icon><Medal /></el-icon>
            <span>组件</span>
          </template>
          <el-menu-item index="form-1">表单1</el-menu-item>
          <el-menu-item index="form-2" @click="onMenuClick('form1')"
            >表单2</el-menu-item
          >
        </el-sub-menu>
        <el-sub-menu index="form3">
          <template #title>
            <el-icon>
              <Failed />
            </el-icon>
            <span>错误页面</span>
          </template>
          <el-menu-item index="403" @click="onMenuClick('403')">
            403页面
          </el-menu-item>
          <el-menu-item index="404" @click="onMenuClick('404')">
            404页面
          </el-menu-item>
          <el-menu-item index="500" @click="onMenuClick('500')">
            500页面
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="form4">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>form表单</span>
          </template>
          <el-menu-item index="form-1">表单1</el-menu-item>
          <el-menu-item index="form-2" @click="onMenuClick('form1')"
            >表单2</el-menu-item
          >
        </el-sub-menu>
        <el-sub-menu index="form5">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>form表单</span>
          </template>
          <el-menu-item index="form-1">表单1</el-menu-item>
          <el-menu-item index="form-2" @click="onMenuClick('form1')"
            >表单2</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { appStore } from '@/store/modules/app.ts';
import { ref } from 'vue';

const router = useRouter();
const active = ref('home');

const store = appStore();
const { collapse, menuActive } = storeToRefs(store);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const onMenuClick = (path: string) => {
  console.log(path);
  router.push({ name: path });
  store.setMenuActive(path);
};
const setActive = () => {
  active.value = 'home';
};
</script>

<style lang="scss">
.sidebar-container {
  width: 200px;
  transition: width 0.3s;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);

  &.collapse {
    width: 64px;
  }

  .logo-wrap {
    height: 60px;
    line-height: 60px;
    text-align: center;
    flex-shrink: 0;
  }

  .el-menu {
    border-right: none;
  }
}
</style>
