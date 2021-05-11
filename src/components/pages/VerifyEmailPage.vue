<template>
    <h1>{{ message }}</h1>
    <base-button v-show="success" @click="showLogin">Login</base-button>
    <base-button v-show="failure" @click="resendEmailVerificationEmail">Resend Email Verification Email</base-button>
</template>

<script>
import network from '../../layers/network.js';

export default {
    data() {
        return {
            success: false,
            failure: false,
            message: ''
        }
    },
    methods: {
        verifyEmail() {
            network.verifyEmail({
                tokenId: this.$route.params.tokenId,
                onSuccess: () => {
                    this.success = true;
                    this.message = "Your email was successfully verified.";
                }, onFailure: error => {
                    this.failure = true;
                    this.message = error;
                }
            });
        },
        showLogin() {
            this.$router.push({ name: 'login' });
        },
        resendEmailVerificationEmail() {
            console.log("Resend")
        }
    },
    mounted() {
        this.verifyEmail();
    }
}
</script>

<style scoped>
</style>