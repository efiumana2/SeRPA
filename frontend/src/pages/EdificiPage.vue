<script>
import {defineComponent} from 'vue'
import EdificiCard from "@/components/EdificiCard.vue";
import {useUserStore} from "@/stores/user";
import { mapState } from 'pinia'
import http from "@/utils/http"

export default defineComponent({
    name: "EdificiPage",
    components: {EdificiCard},
    data() {
        return {
            SHowForm: false,
            Modi: 0,
            NewEdificio: "",
            Edifici: []
        }
    },
    methods: {
        async listEdifci() {
            try {
            let response = await http.get("/Edifici")
                // Usare un foreach di response e fare un Edifici.push
                const EEdifici = response.data;
                this.Edifici = EEdifici;
            }
            catch(error) {
                console.log(error);
            }
        },
        showAddEdificio(){
            this.NewEdificio = '';
            this.SHowForm = true;
        },
        cancelAddEdificio() {
            this.SHowForm = false;
        },
        AddEdificio() {
            if (this.Modi > 0) {
                var EdModi = {};
                try {
                    let response = http.put("/Edifici/" + this.Modi, {
                        Descrizione: NewEdificio.value
                    });
                }
                catch (error){
                    console.log(error);
                };
                var vv = this.Edifici.findIndex(item => item.Id_Edificio === this.Modi);
                this.Edifici[vv].Descrizione = NewEdificio.value;
                this.Modi = 0;
            } else {
                var EdAdded = {};
                try {
                    let response = http.post("/Edifici", {
                        Descrizione: NewEdificio.value
                    })
                    EdAdded.Id_Edificio = response.data[0];
                    EdAdded.Descrizione = NewEdificio.value;
                    this.Edifici.push(EdAdded);
                }
                catch(error) {
                    console.log(error);
                };
            }
            this.SHowForm = false;
        },
        async Cancella(Edificio) {
            if (confirm("Are you sure?")) {
                const URL = "/Edifici/"+Edificio.Id_Edificio;
                try {
                    let response = await http.delete(URL);
                    this.Edifici.splice(this.Edifici.findIndex(item => item.Id_Edificio === Edificio.Id_Edificio),1);
                }
                catch(error) {
                    console.log(error);
                }
            };
        },
        Modifica (Edificio) {
            var vv = 0;
            vv = this.Edifici.findIndex(item => item.Id_Edificio === Edificio.Id_Edificio);
            this.NewEdificio = this.Edifici[vv].Descrizione;
            this.Modi = this.Edifici[vv].Id_Edificio;
            this.SHowForm = true;
        }
    },
    mounted(){
        this.listEdifci();
    },
    computed: {
        ...mapState(useUserStore,['Ruolo'])
    }
})
</script>

<template>
    <section>
        <div class="row">
            <div class="col">
                <button v-if="this.Ruolo === 1" @click.prevent="showAddEdificio" type="button" class="btn btn-success"><i class="fas fa-plus"></i>Aggiungi Edificio</button>
            </div>
        </div>
        <div class="row" v-if="SHowForm">
            <div class="col">
                <form>
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input v-model="NewEdificio" type="text" class="form-control" id="NewEdificio" placeholder="Enter title">
                    </div>
                    <button @click.prevent="AddEdificio" type="submit" class="btn btn-primary">Submit</button>
                    <button @click.prevent="cancelAddEdificio" type="submit" class="btn btn-danger">Cancel</button>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <EdificiCard v-for="Edificio in Edifici" :Edificio="Edificio" :Ruolo="this.Ruolo" @EvtCancella="Cancella" @EvtModifica="Modifica"></EdificiCard>
            </div>
        </div>
    </section>
</template>

<style scoped>

</style>