import {createRouter, createWebHistory} from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import EdificiPage from "@/pages/EdificiPage.vue";
import AulePage from "@/pages/AulePage.vue"
import DatiPage from "@/pages/DatiPage.vue"
import NotFound from "@/pages/NotFound.vue";
import { useUserStore } from "@/stores/user.js";
import LoginPage from "@/pages/LoginPage.vue";
import UtentiPage from "@/pages/UtentiPage.vue"
import ChangePasswd from "@/components/ChangePasswd.vue"
import About from "@/views/AboutView.vue"

const routes = [
    {path: '/',name: 'Home', component: HomePage},
    {path: '/edifici', name: 'Edifici', component: EdificiPage},
    {path: '/404', name: 'NotFound', component: NotFound},
    {path: '/aule/:id', name: 'aule', component: AulePage },
    {path: '/dati/:ID_Edificio/:ID_Aula',component: DatiPage },
    {path: '/login', component: LoginPage},
    {path: '/utenti', name: 'Utenti', component: UtentiPage},
    {path: '/ChangePasswd', name: 'ChangePasswd', component: ChangePasswd},
    {path: '/About', name: 'About', component: About},
    {path: '/Logout', redirect: to => {
            const UserStore = useUserStore();

        UserStore.UnRegister();
        return{ path: '/login'};
    }},
    {path: '/:catchAll(.*)', redirect: '/404'}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to) => {
    const UserStore = useUserStore();

    if (to.path != '/login' && !UserStore.LoggedIn) {
        return '/login';
    }
})
export default router;