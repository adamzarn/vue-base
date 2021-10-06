<template>
    <register-form></register-form>
</template>

<script>
import RegisterForm from "../forms/RegisterForm.vue";
import "./../../local-storage-helper.js";

export default {
    components: { RegisterForm },
    mounted() {
        if (localStorage.isLoggedIn()) {
            this.$router.push({ name: "home" });
        }
    }
}
</script>