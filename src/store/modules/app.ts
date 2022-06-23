import { defineStore } from 'pinia';

export const appStore = defineStore({
  id: 'app',
  state: () => {
    return {
      collapse: false,
      menuActive: 'home',
    };
  },
  getters: {
    getCollapse(): boolean {
      return this.collapse;
    },
  },
  actions: {
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
    setMenuActive(active: string) {
      this.menuActive = active;
    },
  },
});
