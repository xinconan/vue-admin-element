import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { start, done } from '@/utils/nprogress';
import Layout from '../layout/index.vue';
import { useAppStore } from '../store/modules/app';

const whiteList = ['/login'];

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'home',
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {},
      },
    ],
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        name: 'form1',
        path: 'form1',
        component: () => import('@/views/form/index.vue'),
        meta: {},
      },
      {
        name: 'tax',
        path: 'tax',
        component: () => import('@/views/form/tax.vue'),
        meta: { title: '个税计算器' },
      },
      {
        name: 'epub',
        path: 'epub',
        component: () => import('@/views/form/epub.vue'),
        meta: { title: '异步电子书' },
      },
      {
        name: 'turing',
        path: 'turing',
        component: () => import('@/views/form/turing.vue'),
        meta: { title: '图灵电子书' },
      },
      {
        name: 'cxstar',
        path: 'cxstar',
        component: () => import('@/views/form/cxstar.vue'),
        meta: { title: '畅想之星' },
      },
      {
        name: 'cxSearch',
        path: 'cxSearch',
        component: () => import('@/views/form/cxstar-search.vue'),
        meta: { title: '畅想之星搜索' },
      },
      {
        name: 'imgPreview',
        path: 'imgPreview',
        component: () => import('@/views/form/imgPreview.vue'),
        meta: {},
      },
    ],
  },
  {
    path: '/util',
    component: Layout,
    children: [
      {
        name: 'feishu',
        path: 'feishu',
        component: () => import('@/views/util/bytedance.vue'),
      },
      {
        name: 'rsa',
        path: 'rsa',
        component: () => import('@/views/util/rsa.vue'),
      },
    ],
  },
  {
    path: '/error',
    component: Layout,
    children: [
      {
        name: '403',
        path: '403',
        component: () => import('@/views/error/403.vue'),
      },
      {
        name: '404',
        path: '404',
        component: () => import('@/views/error/404.vue'),
      },
      {
        name: '500',
        path: '500',
        component: () => import('@/views/error/500.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error/404',
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  start();
  const store = useAppStore();
  if (store.isLogin) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?return=${to.path}`);
    }
  }
});

router.afterEach(() => {
  done();
});
