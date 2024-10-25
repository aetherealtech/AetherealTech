import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import Home from './Home.vue'
import Button from "primevue/button";

const app = createApp(Home);

app.use(PrimeVue, {})
app.component('Button', Button)

app.mount('#home')