import { defineStore } from 'pinia';

export const appStore = defineStore({
  id: 'app',
  state: () => {
    return {
      collapse: false,
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
  },
});
