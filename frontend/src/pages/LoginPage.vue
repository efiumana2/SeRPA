<script>
import {defineComponent} from "vue";
import router from '@/router/router';
import { useUserStore } from "@/stores/user";
import http from "@/utils/http"

export default {
    name: "LoginPage",
    data() {
        return {
            UserName: '',
            Password: '',
            Tipo: 0,
            ShowPassword: 0
        }
    },
    setup () {
    },
    methods: {
        async onSubmit() {
            const UserStore = useUserStore();

            if (this.UserName === "" || this.Password === "") {
                alert("Devi inserire sia lo username che la password")
            } else {
                try {
                    let response = await http.get("/CheckUsername/"+this.UserName)
                    if (this.Password !== response.data["Password"]) {
                        alert("Password errata")
                    } else {
                        UserStore.register(response.data["ID_Utente"],this.UserName,response.data["Tipo"]);
                        router.push('/');
                    }
                }
                catch (error) {
/*                    if (error.response.status === 404) {
                        alert('No Username')
                    } else {*/
                        console.log(error);
                    }
                }
            }
    },
    mounted() {
        this.UserName = '';
        this.Password = '';
        this.Tipo = 0
    }
}

</script>

<template>
    <div class="card m-3">
        <h4 class="card-header">Login</h4>
        <div class="card-body">
<!--            <form @submit="onSubmit">-->
            <form>
                <div class="form-group">
                    <label>Username</label>
                    <input v-model="UserName" type="text" class="form-control" id="Descrizione" placeholder="Inserisci lo username">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="Password" :type="ShowPassword ? 'text' : 'password'" class="form-control" id="Descrizione" placeholder="Inserisci la password">
                </div>
                <div class="form-check">
                    <input v-model="ShowPassword" class="form-check-input" type="checkbox"  id="ShowPassword" placeholder="Mostra la password">
                    <label class="form-check-label">Show Password</label>
                </div>
                <button @click.prevent="onSubmit" type="submit" class="btn btn-primary">Submit</button>
<!--                <button class="btn btn-primary" >
                    <span class="spinner-border spinner-border-sm mr-1"></span>
                    Login
                </button>-->

            </form>
<!--            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
                    <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
                    <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
            </Form>-->
        </div>
    </div>
</template>

<style scoped>
</style>