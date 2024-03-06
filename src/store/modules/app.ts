import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      collapse: false,
      menuActive: 'home',
      user: {
        token: '',
        name: '',
        avatar: '',
      },
      // 书香中国token
      chineseToken: '',
    };
  },
  // 本地持久化
  persist: {
    paths: ['user', 'chineseToken'],
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
      // prettier-ignore
      this.user.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
    },
    setChineseToken(token: string) {
      this.chineseToken = token;
    },
    logout() {
      this.user.name = '';
      this.user.token = '';
      this.user.avatar = '';
    },
  },
});
