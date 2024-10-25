import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import Contact from './Contact.vue'

const app = createApp(Contact);

app.use(PrimeVue, {})

app.mount('#contact')