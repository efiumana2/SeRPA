<script>
import {Modal} from "@kouts/vue-modal";
import {store} from "@/stores/State";
import {useUserStore} from "@/stores/user";
import http from "@/utils/http"

export default {
    name: "ChangePasswd",
    components: {
        Modal
    },
    data(){
        return {
            OldPassword: "",
            ShowOldPassword: false,
            NewPassword1: "",
            ShowNewPassword1: false,
            NewPassword2: "",
            ShowNewPassword2: false,
            ShowModal:false,
            Utente: {
                Username: "",
                Password: "",
                Descrizione: "",
                Tipo: 0
            },

        }
    },
    methods: {
        async CambiaPassword() {
            const UserStore = useUserStore();
            const ID_Utente = UserStore.GetUserID;

            if (this.NewPassword1 !== this.NewPassword2) {
                alert("Le due nuove password non corrispondono")
                return;
            }
            console.log("dopo")
            let url = '/Users/'+ID_Utente;
            try {
                let response = await http.get(url);
                switch (response.status) {
                    case 204:
                        alert("No rows")
                        break;
                    case 200:
                        if (response.data.Password !== this.OldPassword) {
                            alert("La vecchi apassword non corrisponde")
                            return;
                        }
                        this.Utente.Username = response.data.Username;
                        this.Utente.Password = this.NewPassword1;
                        this.Utente.Descrizione = response.data.Descrizione;
                        this.Utente.Tipo = response.data.Tipo;

                        try{
                            let response = await http.put("/Users/" + ID_Utente, {
                                Username:       this.Utente.Username,
                                Password:       this.Utente.Password,
                                Descrizione:    this.Utente.Descrizione,
                                Tipo:           this.Utente.Tipo
                            })
                            } catch (err){
                                console.log(err)
                            }
                        break;
                    default:
                    }
            } catch (err) {
                console.log(err);
            } finally {

            }

            this.ShowModal = false;
            this.$router.go(-1);
        },
        ChiudiModal() {
            this.ShowModal = false;
            this.$router.go(-1);
        }
    },
    mounted() {
        this.ShowModal = true;
    }
}
</script>

<template>
    <Modal v-model="ShowModal" :enableClose="false" title="My first modal">
        <form>
            <div class="mb-3">
                <label>Old Password</label>
                <input v-model="OldPassword" :type="ShowOldPassword ? 'text' : 'password'" class="form-control" id="OldPassword" placeholder="Inserisci la vecchia password">
                <input v-model="ShowOldPassword" class="form-check-input" type="checkbox"  id="ShowPassword" placeholder="Mostra la password">
                <label class="form-check-label">Show Password</label>
            </div>
            <div class="mb-3">
                <label>New Password</label>
                <input v-model="NewPassword1" :type="ShowNewPassword1 ? 'text' : 'password'" class="form-control" id="NewPassword1" placeholder="Inserisci la nuova password">
                <input v-model="ShowNewPassword1" class="form-check-input" type="checkbox"  id="ShowOldPassword1" placeholder="Mostra la password">
                <label class="form-check-label">Show Password</label>
            </div>
            <div class="mb-3">
                <label>Ripeti la nuova Password</label>
                <input v-model="NewPassword2" :type="ShowNewPassword2 ? 'text' : 'password'" class="form-control" id="NewPassword2" placeholder="Inserisci nuovamante la nuova password">
                <input v-model="ShowNewPassword2" class="form-check-input" type="checkbox"  id="Show NewPassword2" placeholder="Mostra la password">
                <label class="form-check-label">Show Password</label>
            </div>
            <div class="row modal-footer">
                <div class="col-sm-12">
                    <div class="float-right">
                        <button class="btn btn-primary" type="button" @click="CambiaPassword()">Ok</button>
                        <button class="btn btn-secondary ml-2" type="button" @click="ChiudiModal()">Cancel</button>
                    </div>
                </div>
            </div>
        </form>
    </Modal>
</template>

<style scoped>

</style>