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