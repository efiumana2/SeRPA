<template>
    <div class="container">
        <div class="row">
            <div class="col">Username: {{ Utente.Username }}</div>
            <div class="col">Descrizione: {{ Utente.Descrizione }}</div>
            <div class="col">Tipo: {{ Utente.Tipo === 1 ? "Amministratore" : "Utente Standard" }}</div>
            <div class="col-2 d-flex justify-content-center">
                <button @click.prevent="this.$emit('EvtModUtente',Utente)" type="button" class="btn btn-primary">Modifica</button>
            </div>
            <div class="col-2">
                <button @click.prevent="this.$emit('EvtDelUtente',Utente)" type="button" class="btn btn-primary">Cancella</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "UtentiCard",
    props:['Utente'],
    data() {
        return {
        }
    },
    methods: {
    }

}
</script>

<style scoped>

</style>