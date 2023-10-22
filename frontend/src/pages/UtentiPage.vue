<script>
import {defineComponent} from 'vue'
import UtentiCard from "@/components/UtentiCard.vue";
import { store } from '@/stores/State';
import {useUserStore} from "@/stores/user";
import http from "@/utils/http"

export default {
    name: "UtentiPage",
    components: {UtentiCard},
    data() {
        return {
            ShowForm: false,
            ShowPassword: false,
            Modifica: 0,
            NuovoUtente: {
                Username: "",
                Password: "",
                Descrizione: "",
                Tipo: 0
            },
            Utenti: [],
            store
        }
    },
    methods: {
        async ListaUtenti() {
            let url = '/Users';
            try {
                let response = await http.get(url);
                switch (response.status) {
                    case 204:
                        alert("No rows")
                        break;
                    case 200:
                        response.data.forEach(Utente => {
                            this.Utenti.push({
                                ID_Utente: Utente.ID_Utente,
                                Username: Utente.Username,
                                Password: Utente.Password,
                                Descrizione: Utente.Descrizione,
                                Tipo: Utente.Tipo
                            })
                        })
                        break;
                    default:
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        showAddUtente() {
            this.NuovoUtente.Username = ""
            this.NuovoUtente.Password = ""
            this.NuovoUtente.Descrizione = ""
            this.NuovoUtente.Tipo = 1;
            this.ShowForm = true;
        },
        CancelAddUtente() {
            this.ShowForm = false;
        },
        async AddUtente() {
            if (this.Modifica > 0) {
                try {
                    let response = await http.put("/Users/" + this.Utenti[this.Modifica].ID_Utente, {
                        Username:       this.NuovoUtente.Username,
                        Password:       this.NuovoUtente.Password,
                        Descrizione:    this.NuovoUtente.Descrizione,
                        Tipo:           this.NuovoUtente.Tipo
                    })
                }
                catch(error) {
                    console.log(error);
                };
                this.Utenti[this.Modifica].Descrizione = this.NuovoUtente.Descrizione;
                this.Utenti[this.Modifica].Username = this.NuovoUtente.Username;
                this.Utenti[this.Modifica].Tipo = this.NuovoUtente.Tipo;
                this.Modifica = 0;
            } else {
                var UtenteAdded = {};
                try {
                    let response = http.post("/Users", {
                        Username:       this.NuovoUtente.Username,
                        Password:       this.NuovoUtente.Password,
                        Descrizione:    this.NuovoUtente.Descrizione,
                        Tipo:           this.NuovoUtente.Tipo
                    })
                    UtenteAdded.ID_Utente = response.data[0];
                    }
                    catch(error) {
                        console.log(error);
                    };
                UtenteAdded.Descrizione = this.NuovoUtente.Descrizione;
                UtenteAdded.Username    = this.NuovoUtente.Username;
                UtenteAdded.Tipo        = this.NuovoUtente.Tipo;
                this.Utenti.push(UtenteAdded);
            }
            this.ShowForm = false;
        },
        DelUtente(Utente) {
            if (confirm("Are you sure?")) {
                const URL = "/Users/"+Utente.ID_Utente;
                try {
                    let response = http.delete(URL);
                    this.Utenti.splice(this.Utenti.findIndex(item => item.ID_Utente === Utente.ID_Utente),1);
                }
                catch(error) {
                    console.log(error);
                }
            };
        },
        ModUtente(Utente) {
            var vv = 0;
            vv = this.Utenti.findIndex(item => item.ID_Utente === Utente.ID_Utente);
            this.NuovoUtente.Username = this.Utenti[vv].Username;
            this.NuovoUtente.Password = this.Utenti[vv].Password;
            this.NuovoUtente.Descrizione = this.Utenti[vv].Descrizione;
            this.NuovoUtente.Tipo = this.Utenti[vv].Tipo;
            this.Modifica = vv;
            this.ShowForm = true;
        }
    },
    mounted(){
        this.ListaUtenti();
    },

}
</script>

<template>
    <section>
        <div class="row">
            <div class="col">
                <button @click.prevent="showAddUtente" type="button" class="btn btn-success"><i class="fas fa-plus"></i>Aggiungi Utente</button>
            </div>
        </div>
        <div class="row" v-if="ShowForm">
            <div class="col">
                <form>
                    <div class="form-group">
                        <label for="title">Username</label>
                        <input v-model="NuovoUtente.Username" type="text" class="form-control" id="Descrizione" placeholder="Inserisci lo Username">
                    </div>
                    <div class="form-group">
                        <label for="title">Password</label>
                        <input v-model="NuovoUtente.Password" :type="ShowPassword ? 'text' : 'password'" class="form-control" id="IP" placeholder="Inserisci la password">
                    </div>
                    <div class="form-check">
                        <input v-model="ShowPassword" class="form-check-input" type="checkbox"  id="ShowPassword" placeholder="Mostra la password">
                        <label class="form-check-label">Show Password</label>
                    </div>
                    <div class="form-group">
                        <label for="title">Descrizione</label>
                        <input v-model="NuovoUtente.Descrizione" type="text" class="form-control" id="Num_Cam" placeholder="Inserisci la descrzione">
                    </div>
                    <div class="form-group">
                        <label for="title">Tipo</label>
                        <select v-model="NuovoUtente.Tipo" class="form-select" style="width:auto;" aria-label="Tipo">
                            <option value="1">Amministratore</option>
                            <option value="2">Utente standard</option>
                        </select>
                    </div>
                    <button @click.prevent="AddUtente" type="submit" class="btn btn-primary">Submit</button>
                    <button @click.prevent="CancelAddUtente" type="submit" class="btn btn-danger">Cancel</button>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <UtentiCard v-for="Utente in Utenti" :Utente="Utente" @EvtDelUtente="DelUtente" @EvtModUtente="ModUtente"></UtentiCard>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>