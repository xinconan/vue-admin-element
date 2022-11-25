<template>
  <div class="login-wrapper">
    <div class="login-content">
      <div class="login-form-header flex items-center justify-center">
        <img src="../../assets/logo.png" alt="logo" />
        <span>Vue 3 Admin</span>
      </div>
      <el-form class="login-form" :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="userName">
          <el-input
            :prefix-icon="User"
            v-model="form.userName"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            :prefix-icon="Lock"
            v-model="form.pwd"
            type="password"
            @keyup.enter.native="login(loginForm)"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-button class="w-full" type="primary" @click="login(loginForm)"
          >登录</el-button
        >
      </el-form>
    </div>
    <footer class="login-footer"></footer>
  </div>
</template>

<script lang="ts" setup>
import { Lock, User } from '@element-plus/icons-vue';
import type { FormRules, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../store/modules/app';

const router = useRouter();
const route = useRoute();
const store = useAppStore();
const loginForm = ref<FormInstance>();

const form = reactive({
  userName: '',
  pwd: '',
});

const login = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate((valid) => {
    if (!valid) {
      return;
    }
    store.setUserInfo(form.userName, 'mock-token');
    if (route.query.return) {
      router.push(route.query.return as string);
    } else {
      router.push('/dashboard');
    }
  });
};

const rules = reactive<FormRules>({
  userName: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  pwd: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
});
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: #f0f2f5;
  background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}
.login-content {
  padding: 32px 0;
  margin-top: 150px;
}
.login-form-header {
  margin-bottom: 32px;

  img {
    width: 44px;
    height: 44px;
    margin-right: 16px;
  }
  span {
    font-size: 34px;
    font-weight: 600;
  }
}
.login-form {
  width: 328px;
  margin: 0 auto;
}
</style>
