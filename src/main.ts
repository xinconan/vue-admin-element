import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import { router } from './router';
import { setupStore } from './store';
import '@/styles/tailwind.css';
import '@/styles/index.scss';
// 解决elmessage 在axios中无法被自动导入问题
import 'element-plus/theme-chalk/el-message.css';

const app = createApp(App);
setupStore(app);
app.use(router);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
