import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from '@/App.vue';
import router from "@/router/router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { Modal } from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'


const app = createApp(App);
const myPinia = createPinia();

app.use(router);
app.use(myPinia);
app.component('VueDatePicker', VueDatePicker);
app.component('Modal', Modal)

app.mount('#app');

