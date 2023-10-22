<script>
import {defineComponent} from 'vue'
import NavButton from "@/components/NavButton.vue";
import { useUserStore } from "@/stores/user.js";
import { store } from '@/stores/State';
import { mapState } from 'pinia'

export default defineComponent({
    name: "NavBar",
    components: {NavButton},
    data(){
        return {
            store
        }
    },
    computed: {
        ...mapState(useUserStore,['Ruolo']),
        ...mapState(useUserStore,['UserName'])
    },
    methods:{
        ChangePasswordClicked() {
            alert("Cambio password")
        }
    }
})
</script>

<template>
    <nav class="navbar navbar-light bg-light navbar-expand-lg">
        <div class="container container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <NavButton route-name="Home" routePath="/"></NavButton>
                    <NavButton route-name="Edifici" routePath="/edifici"></NavButton>
                    <NavButton v-if="this.store.ShowBackAule > 0" route-name='Aule' :routePath="'/aule/' + 1"></NavButton>
                </ul>
                <div class="mx-5">
                    <NavButton v-if="this.Ruolo === 1" route-name="Gestione Utenti" routePath="/utenti"></NavButton>
                </div>
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {{ this.UserName }}
                    </a>
                    <ul class="dropdown-menu">
                        <li> <RouterLink class="dropdown-item" :to="'/ChangePasswd'">Cambia password</RouterLink></li>
<!--                        <li><button class="dropdown-item" type="button" @click="ChangePasswordClicked">Cambia password</button></li>-->
                        <li><hr class="dropdown-divider"></li>
                        <li><RouterLink class="dropdown-item" :to="'/Logout'">Logout</RouterLink></li>
                    </ul>
                </div>
                <div class="mx-5">
                    <NavButton route-name="About" routePath="/About"></NavButton>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>

</style>