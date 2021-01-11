<template>
    <the-header></the-header>
    <h1>Welcome to the Home Page {{ fullName }}!</h1>
    <user-list></user-list>
</template>

<script>
import UserList from '../UserList.vue';

export default {
    components: {
        UserList
    },
    computed: {
        fullName() {
            return localStorage.firstName + ' ' + localStorage.lastName;
        }
    }    
}
</script>

<style scoped>
h1 {
    text-align: center;
}
</style>