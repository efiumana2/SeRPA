<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "NavButton",
    props:['routeName','routePath'],
    data(){
        return {
        }
    },
    methods:{
    }
})
</script>

<template>
    <li class="nav-item">
        <RouterLink class="nav-link" :to="routePath">{{ routeName }}</RouterLink>
    </li>
</template>

<style scoped>

</style>