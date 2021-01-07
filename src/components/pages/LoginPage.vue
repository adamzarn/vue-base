<template>
    <the-header></the-header>
    <login-form class="centered-card"></login-form>
</template>

<script>
import LoginForm from '../forms/LoginForm.vue';
import TheHeader from '../TheHeader.vue';
export default {
    components: { LoginForm, TheHeader }
}
</script>

<style scoped>
.centered-card {
    margin: 48px auto;
}
</style>