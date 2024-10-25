import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import Blog from './Blog.vue'

const app = createApp(Blog);

app.use(PrimeVue, {})

app.mount('#blog')