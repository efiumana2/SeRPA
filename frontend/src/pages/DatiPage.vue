<script>
import {defineComponent} from 'vue'
import {useUserStore} from "@/stores/user";
import router from "@/router/router";
import "bootstrap/dist/js/bootstrap.js";
import DatiCard from "@/components/DatiCard.vue";
import DateToMysql from "@/utils/DateToMysql";
import { store } from '@/stores/State';
import http from "@/utils/http"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

/* Mettere uno stato per poter visualizzre nella navbar il tasto per tornare indietro */
export default defineComponent( {
    name: "DatiPage",
//
    components: {Line},
    data() {
        return {
            DateFrom:'',
            DateTo:'',
            DBDateFrom:'',
            DBDateTo:'',
            Dati: [],
            store,
            chartData: '',
            loaded: false
        }
    },
    mounted () {
        var date = new Date();
        this.DateFrom = new Date(date.getFullYear(), date.getMonth(), 1,8,0);
        this.DateTo = date;
        store.ShowBackAule = this.$route.params.ID_Edificio;
    },
    methods: {
        async ShowData() {

            const options = {
                responsive: true,
                maintainAspectRatio: false
            }
            this.loaded = false
            this.DBDateFrom = DateToMysql.DateToMysql(this.DateFrom);
            this.DBDateTo = DateToMysql.DateToMysql(this.DateTo);
            let url = '/GetHistory/'+this.$route.params.ID_Edificio+'/'+this.$route.params.ID_Aula+'/'+this.DBDateFrom+'/'+this.DBDateTo;
            try {
                let response = await http.get(url)
                this.Dati = response.data;
                this.chartData = {
                    labels: this.Dati.map(item => item.data),
                    datasets: [{
                        label: 'Presenze',
                        lineTension: 0.5,
                        data: this.Dati.map(item => item.presenze)
                    }]
                }
                this.loaded = true;
                console.log('ciao')
                console.log(this.chartData);
            } catch (err) {
                console.log(error);
            }
        },
        async ScaricaDati() {
            this.DBDateFrom = DateToMysql.DateToMysql(this.DateFrom);
            this.DBDateTo = DateToMysql.DateToMysql(this.DateTo);
            let url = '/GetHistory/'+this.$route.params.ID_Edificio+'/'+this.$route.params.ID_Aula+'/'+this.DBDateFrom+'/'+this.DBDateTo;
            try {
                let response = await http.get(url);
                const csvData = this.convertToCSV(response.data);
                const blob = new Blob([csvData], {type: 'text/csv'});
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'exported_data.csv';
                link.click();
                URL.revokeObjectURL(link.href);
            }
            catch(error) {
                console.log(error);
            }
        },
        convertToCSV(data) {
            const header = Object.keys(data[0]);
            const csvHeader = header.join(',');
            const csvRows = data.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName])).join(','));
            return [csvHeader, ...csvRows].join('\n');
        }
    }
})


</script>

<template>
<div class="container-fluid">
    <form>
        <div class="form-group gx-5">
            <div class="row gx-5">
                <div class="col-sm-5">
                    <VueDatePicker v-model="DateFrom" :format="'dd/MM/yyyy HH:mm'" :timezone='"Europe/Rome"'>Ciao</VueDatePicker>
                </div>
                <div class="col">
                    <VueDatePicker v-model="DateTo"  :format="'dd/MM/yyyy HH:mm'"></VueDatePicker>
                </div>
                <div class="col">
                    <button @click.prevent="ShowData" type="submit" class="btn btn-primary">Visualizza</button>
                </div>
                <div class="col">
                    <button @click.prevent="ScaricaDati" type="submit" class="btn btn-primary">Esporta in CSV</button>
                </div>
            </div>
        </div>
    </form>
<!--    <div class="row">
        <div class="col">
            <DatiCard v-for="Dato in Dati" :Dato="Dato" ></DatiCard>
        </div>
    </div>-->
    <Line  v-if="loaded" :data="this.chartData" />
</div>
</template>


<style scoped>

</style>