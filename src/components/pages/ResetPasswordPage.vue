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
    margin: calc(var(--default-spacing)*3) auto;
    max-width: calc(var(--default-spacing)*24);
}
</style>