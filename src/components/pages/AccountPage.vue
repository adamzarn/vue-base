<template>
    <the-header></the-header>
    <v-container>
        <v-layout row>
            <v-flex md6>
                <v-btn outline block class="primary">1</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import TheHeader from '../TheHeader.vue';
export default {
    components: { TheHeader },
    computed: {
        fullName() {
            return localStorage.firstName + ' ' + localStorage.lastName;
        }
    }  
}
</script>

<style scoped>
.primary {
    background-color: purple;
}
</style>