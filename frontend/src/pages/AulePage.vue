<script>
import {defineComponent} from 'vue'
import AuleCard from "@/components/AuleCard.vue";
import { store } from '@/stores/State';
import {useUserStore} from "@/stores/user";
import { mapState } from 'pinia'
import http from "@/utils/http"

async function CheckAlive(ID_Edificio,ID_Aula) {
    try {
        let response = await http.get("/status/" + ID_Edificio + "/" + ID_Aula)
        if (response.data.length === 0) {
            alert('No Rows')
            return false
        } else {
            return response.data.isAlive
        }
    }
    catch(error) {
            console.log(error);
    }
}


export default defineComponent({
    name: "AulePage",
    components: {AuleCard},
    data() {
        return {
            SHowForm: false,
            Modi: 0,
            NewAula: {
                Descrizione: "",
                IP: "",
                Num_Cam: 0
            },
            Aule: [],
            store
        }
    },
    methods: {
        async listAule(){
            try {
                let response = await http.get("/Aule/"+this.$route.params.id)
                    if (response.data.length === 0) {
                        alert('No Rows')
                    } else {
                        response.data.forEach(Aula =>  {
                            this.Aule.push({ID_Edificio: Aula.ID_Edificio,
                                ID_Aula: Aula.ID_Aula,
                                Descrizione: Aula.Descrizione,
                                IP: Aula.IP,
                                Num_Cam: Aula.Num_Cam,
                                IsAlive: CheckAlive(Aula.ID_Edificio, Aula.ID_Aula)
                            })
                        })
                    }
                }
                catch(error) {
                    console.log(error);
                }
        },
        showAddAula(){
            this.NewEdificio = '';
            this.SHowForm = true;
        },
        CancelAddAula() {
            this.SHowForm = false;
        },
        AddAula() {
            if (this.Modi > 0) {
                this.Modi--;
                try {
                    let response = http.put("/Aule/" + this.Aule[this.Modi].ID_Edificio + "/" + this.Aule[this.Modi].ID_Aula, {
                        Descrizione: this.NewAula.Descrizione,
                        IP: this.NewAula.IP,
                        Num_Cam: this.NewAula.Num_Cam
                    })
                }
                catch(error) {
                    console.log(error);
                }
                this.Aule[this.Modi].Descrizione = this.NewAula.Descrizione;
                this.Aule[this.Modi].IP = this.NewAula.IP;
                this.Aule[this.Modi].Num_Cam = this.NewAula.Num_Cam;
                this.Modi = 0;
            } else {
                //console.log('Adding');
                var AuAdded = {};
                try {
                    let response = http.post("/Aule/"+this.$route.params.id, {
                        Descrizione: this.NewAula.Descrizione,
                        IP: this.NewAula.IP,
                        Num_Cam: this.NewAula.Num_Cam
                    })
                    AuAdded.Id_Edificio = response.data[0];
                    AuAdded.Descrizione = this.NewAula.Descrizione;
                    AuAdded.IP = this.NewAula.IP;
                    AuAdded.Num_Cam = this.NewAula.Num_Cam;
                    this.Aule.push(AuAdded);
                    }
                catch(error) {
                    console.log(error);
                };
            }
            this.SHowForm = false;
        },
        DelAula(Aula){
            if (confirm("Are you sure?")) {
                const URL = "/Aule/" + Aula.ID_Edificio+"/"+Aula.ID_Aula;
                try {
                    let response = http.delete(URL);
                    this.Aule.splice(this.Aule.findIndex(item => (item.ID_Edificio === Aula.ID_Edificio) && (item.ID_Aula === Aula.ID_Aula)),1);
                }
                catch(error) {
                    console.log(error);
                }
            }
        },
        ModAula(Aula) {
            var vv = 0;
            vv = this.Aule.findIndex(item => (item.ID_Edificio === Aula.ID_Edificio) && (item.ID_Aula === Aula.ID_Aula));
            this.NewAula.Descrizione = this.Aule[vv].Descrizione;
            this.NewAula.IP = this.Aule[vv].IP;
            this.NewAula.Num_Cam = this.Aule[vv].Num_Cam;
            this.Modi = vv + 1;
            this.SHowForm = true;
        }
    },
    mounted(){
        this.listAule();
        this.store.ShowBackAule = 0;
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
                <button v-if="this.Ruolo === 1" @click.prevent="showAddAula" type="button" class="btn btn-success"><i class="fas fa-plus"></i>Aggiungi Aula</button>
            </div>
        </div>
        <div class="row" v-if="SHowForm">
            <div class="col">
                <form>
                    <div class="form-group">
                        <label for="title">Descrizione</label>
                        <input v-model="NewAula.Descrizione" type="text" class="form-control" id="Descrizione" placeholder="Inserisci la Descrizione">
                    </div>
                    <div class="form-group">
                        <label for="title">IP</label>
                        <input v-model="NewAula.IP" type="text" class="form-control" id="IP" placeholder="Inserisci l'indirizzo IP">
                    </div>
                    <div class="form-group">
                        <label for="title">Numero Telecamere</label>
                        <input v-model="NewAula.Num_Cam" type="text" class="form-control" id="Num_Cam" placeholder="Inserisci numero telecamere">
                    </div>
                    <button @click.prevent="AddAula" type="submit" class="btn btn-primary">Submit</button>
                    <button @click.prevent="CancelAddAula" type="submit" class="btn btn-danger">Cancel</button>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <AuleCard v-for="Aula in Aule" :Aula="Aula" :Ruolo="this.Ruolo" @EvtDelAUla="DelAula" @EvtModAula="ModAula"></AuleCard>
            </div>
        </div>
    </section>
</template>


<style scoped>

</style>