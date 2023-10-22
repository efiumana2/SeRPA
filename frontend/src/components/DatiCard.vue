<template>
    <div class="container" >
        <div class="row">
            <div class="col-5">Data: {{Dato.data}}</div>
            <div class="col-5">Presenze: {{Dato.presenze}}</div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default {
    name: "DatiCard",
    props:['Dato'],
}
</script>

<style scoped>

</style>