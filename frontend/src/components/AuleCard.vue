<script>
import {defineComponent} from 'vue'

export default defineComponent( {
    name: "AuleCard",
    props:['Aula', 'Ruolo'],
    data() {
        return {
        }
    },
    methods: {
    }
})
</script>

<template>
    <div class="container" >
        <div class="row">

            <router-link :to="'/dati/'+Aula.ID_Edificio+'/'+Aula.ID_Aula">{{ Aula.Descrizione }}</router-link>
            <!--<a class="col" :href="'/dati/'+Aula.ID_Edificio+'/'+Aula.ID_Aula">{{ Aula.Descrizione }}</a>-->
            <div class="col">IP: {{ Aula.IP }}</div>
            <div class="col">Num. Camere: {{ Aula.Num_Cam }}</div>
            <div class="col">
                <img v-if="Aula.IsAlive" src="../assets/img/green-led-on-md.png" class="img-fluid" style="width: 30px;height: 30px"/>
                <img v-else src="../assets/img/red-led-on-small-md.png" class="img-fluid" style="width: 30px;height: 30px"/>
            </div>
<!--
                <div class="card-body">
                    <a class="card-title" :href="'/aule/' + Edificio.Id_Edificio">{{ Edificio.Descrizione }}</a> &ndash;&gt;
                    <p class="card-title">{{ Aula.Descrizione }}</p>
                </div>
                <div class="card-body">
                    <p class="card-title">{{ Aula.IP }}</p>
                </div>
                <div class="card-body">
                    <p class="card-title">{{ Aula.Num_Cam }}</p>
                </div>
-->
            <div class="col-2 d-flex justify-content-center">
                <button v-if="this.Ruolo === 1" @click.prevent="this.$emit('EvtModAula',Aula)" type="button" class="btn btn-primary">Modifica</button>
            </div>
            <div class="col-2">
                <button v-if="this.Ruolo === 1" @click.prevent="this.$emit('EvtDelAUla',Aula)" type="button" class="btn btn-primary">Cancella</button>
            </div>
        </div>
    </div>

</template>


<style scoped>

</style>