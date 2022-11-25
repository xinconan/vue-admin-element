import type { App } from 'vue';
import { createPinia } from 'pinia';
import pluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(pluginPersistedstate);

export const setupStore = (app: App<Element>) => {
  app.use(store);
};
