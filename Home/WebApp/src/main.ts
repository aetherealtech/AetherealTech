import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import Home from './Home.vue'
import { HomeViewModelProd } from 'homelogic'
import Button from "primevue/button";

const app = createApp(
    Home,
    {
        viewModel: new HomeViewModelProd()
    }
)

app.use(PrimeVue, {})
app.component('Button', Button)

app.mount('#home')