<template>
    <the-header></the-header>
    <register-form class="centered-card"></register-form>
</template>

<script>
import RegisterForm from '../forms/RegisterForm.vue';
export default {
    components: { RegisterForm }
}
</script>

<style scoped>
.centered-card {
    margin: 48px auto;
}
</style>