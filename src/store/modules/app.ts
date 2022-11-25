import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      collapse: false,
      menuActive: 'home',
      user: {
        token: '',
        name: '',
      },
    };
  },
  // 本地持久化
  persist: {
    paths: ['user'],
  },
  getters: {
    getCollapse(): boolean {
      return this.collapse;
    },
    userToken(): string {
      return this.user.token;
    },
    isLogin(): boolean {
      return !!this.userToken;
    },
  },
  actions: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    setMenuActive(active: string) {
      this.menuActive = active;
    },
    setUserInfo(name: string, token: string) {
      this.user.name = name;
      this.user.token = token;
    },
  },
});
