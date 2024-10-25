import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import About from './About.vue'

const app = createApp(About);

app.use(PrimeVue, {})

app.mount('#about')