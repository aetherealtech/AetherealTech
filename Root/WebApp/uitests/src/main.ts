import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import App from './App.vue'
import Menubar from "primevue/menubar";

const app = createApp(App)

app.use(PrimeVue, {})

app.component('Menubar', Menubar)

app.mount('#app')