<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "EdificiCard",
    props:['Edificio', 'Ruolo'],
    methods:{
        debug() {
          console.log(Edificio);
        },
        init() {
            this.debug()
        }
    }
})
</script>

<template>
    <div class="container" >
        <div class="row">
            <div class="col-5">
                <div class="card-body">
                    <router-link :to="'/aule/'+Edificio.Id_Edificio">{{ Edificio.Descrizione }}</router-link>
                </div>
            </div>
            <div class="col-2 d-flex justify-content-center">
                <button v-if="this.Ruolo === 1" @click.prevent="this.$emit('EvtModifica',Edificio)" type="button" class="btn btn-primary">Modifica</button>
            </div>
            <div class="col-2">
                <button v-if="this.Ruolo === 1" @click.prevent="this.$emit('EvtCancella',Edificio)" type="button" class="btn btn-primary">Cancella</button>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>