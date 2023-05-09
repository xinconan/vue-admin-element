<template>
  <el-aside :class="{ collapse: collapse, 'sidebar-container': true }">
    <div class="logo-wrap flex items-center justify-center">
      <img
        :class="{ 'mr-4': !collapse }"
        src="../../assets/logo.png"
        alt="logo"
      />
      <span v-show="!collapse">VueAdmin</span>
    </div>
    <!-- menu, 支持2级菜单 -->
    <el-scrollbar>
      <el-menu
        :default-active="menuActive"
        :collapse="collapse"
        @open="handleOpen"
      >
        <template v-for="permission in permissions">
          <el-menu-item
            v-if="!permission.children"
            :index="permission.path"
            @click="onMenuClick(permission.path)"
          >
            <el-icon v-if="permission.icon">
              <component :is="permission.icon" />
            </el-icon>
            <template #title>{{ permission.title }}</template>
          </el-menu-item>
          <el-sub-menu v-else :index="permission.path">
            <template #title>
              <el-icon v-if="permission.icon">
                <component :is="permission.icon" />
              </el-icon>
              <span>{{ permission.title }}</span>
            </template>
            <el-menu-item
              v-for="child in permission.children"
              :index="child.path"
              @click="onMenuClick(child.path)"
            >
              <el-icon v-if="child?.icon">
                <component :is="child.icon" />
              </el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/modules/app';
import { computed, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const active = ref('home');

const store = useAppStore();
const { collapse } = storeToRefs(store);

interface IMenu{
  path: string;
  title: string;
  icon?: string;
  children?: IMenu[]
}

const permissions = ref<IMenu[]>([
  {
    path: '/dashboard',
    title: 'Home',
    icon: 'Menu',
  },
  {
    path: '/form',
    title: 'form表单',
    icon: 'Document',
    children: [
      {
        path: '/form/form1',
        title: 'form1',
        icon: 'Document',
      },
      {
        path: '/form/tax',
        title: '个税计算器',
        icon: 'Calendar',
      },
      {
        path: '/form/epub',
        title: '异步电子书',
        icon: 'Reading',
      },
      {
        path: '/form/turing',
        title: '图灵电子书',
        icon: 'Reading',
      },
      {
        path: '/form/imgPreview',
        title: '图片预览',
        icon: 'Picture',
      },
    ],
  },
  {
    path: '/comp',
    title: '组件',
    icon: 'Medal',
    children: [
      {
        path: '/comp/comp1',
        title: '组件1',
        icon: '',
      },
    ],
  },
  {
    path: '/util',
    title: '工具箱',
    icon: 'Box',
    children: [
      {
        path: '/util/feishu',
        title: '飞书文档',
      },
      {
        path: '/util/rsa',
        title: 'RSA加解密',
      },
    ],
  },
  {
    path: '/error',
    title: '错误页',
    icon: 'Failed',
    children: [
      {
        path: '/error/403',
        title: '403',
        icon: '',
      },
      {
        path: '/error/404',
        title: '404',
        icon: '',
      },
      {
        path: '/error/500',
        title: '500',
        icon: '',
      },
    ],
  },
]);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const onMenuClick = (path: string) => {
  console.log(path);
  router.push(path);
};
const setActive = () => {
  active.value = 'home';
};
const menuActive = computed<string>(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
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
    flex-shrink: 0;

    img {
      width: 44px;
      height: 44px;
    }
  }

  .el-menu {
    border-right: none;
  }
}
</style>
