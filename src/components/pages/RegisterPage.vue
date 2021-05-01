<template>
    <register-form class="centered-card"></register-form>
</template>

<script>
import RegisterForm from '../forms/RegisterForm.vue';

export default {
    components: { RegisterForm },
    mounted() {
        if (localStorage.token != null) {
            this.$router.push({ name: 'home' });
        }
    }
}
</script>

<style scoped>
.centered-card {
    margin: calc(var(--default-spacing)*3) auto;
    max-width: calc(var(--default-spacing)*24);
}
</style>