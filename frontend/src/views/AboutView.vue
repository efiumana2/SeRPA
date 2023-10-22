<script>
import {Modal} from "@kouts/vue-modal";
export default {
    name: "About",
    components: {
        Modal
    },
    data() {
        return {
            ShowModal: false,
        }
    },
    mounted() {
        this.ShowModal = true;
    },
    methods: {
        Chiudi() {
            this.ShowModal = false;
            this.$router.go(-1);
        }
    }
}

</script>

<template>
    <Modal v-model="ShowModal" @before-close="Chiudi" title="About">
    <div class="about">
        <h1>SCoPre</h1>
        <div class="mb-3">
            Sistema Conteggio Presenze
            By Enrico Fiumana
        </div>
        <div class="float-right">
            <button class="btn btn-primary" type="button" @click="this.ShowModal = false">Ok</button>
        </div>

    </div>
    </Modal>
</template>

<style>
/*@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/
</style>