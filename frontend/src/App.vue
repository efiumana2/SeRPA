<script>

import {defineComponent} from "vue";
import { mapState } from 'pinia'
import NavBar from "@/components/NavBar.vue";
import { useUserStore } from "@/stores/user.js";

export default defineComponent({
    name: 'app',
    components: {NavBar},
    data() {
        return {
        }
    },
    methods: {
    },
    computed: {
        ...mapState(useUserStore,['UserID'])
    },
})
</script>

<template>
  <NavBar v-if="this.UserID !==0" ></NavBar>
  <RouterView></RouterView>
</template>

<style scoped>

</style>

