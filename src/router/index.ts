import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '../layout/index.vue';

export const routes: RouteRecordRaw[] = [
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
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
