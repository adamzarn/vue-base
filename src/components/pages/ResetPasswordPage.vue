<template>
    <reset-password-form class="centered-card"></reset-password-form>
</template>

<script>
import ResetPasswordForm from '../forms/ResetPasswordForm.vue';

export default {
    components: { ResetPasswordForm }
}
</script>

<style scoped>
.centered-card {
    margin: 48px auto;
    max-width: 400px;
}
</style>