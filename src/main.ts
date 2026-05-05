import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';
import router from './routers';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia)
   .use(router);

const authStore = useAuthStore();
authStore.init();

app.mount('#app');
