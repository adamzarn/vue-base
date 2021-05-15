<template>
    <login-form class="centered-card"></login-form>
    <div class="centered-link">
        <a @click="showForgotPasswordModal">Forgot Password?</a>
    </div>
    <base-modal v-if="shouldShowForgotPasswordModal" title="Password Reset">
        <template #default>
            <p>Enter your email and we'll send you a password reset link.</p>
            <base-input
                v-model.trim="passwordResetEmail"
            ></base-input>
        </template>
        <template #actions>
            <div class="buttons-container">
                <base-button @click="dismissForgotPasswordModal">Cancel</base-button>
                <base-button @click="sendForgotPasswordEmail">Send</base-button>
            </div>
        </template>
    </base-modal>
</template>

<script>
import LoginForm from '../forms/LoginForm.vue';
import network from '../../layers/network.js';

export default {
    components: { LoginForm },
    data() {
        return {
            passwordResetEmail: '',
            shouldShowForgotPasswordModal: false
        }
    },
    methods: {
        showForgotPasswordModal() {
            this.shouldShowForgotPasswordModal = true;
        },
        dismissForgotPasswordModal() {
            this.shouldShowForgotPasswordModal = false;
        },
        sendForgotPasswordEmail() {
            this.shouldShowForgotPasswordModal = false;
            network.sendPasswordResetEmail({
                body: {
                    email: this.passwordResetEmail,
                    url: network.frontendBaseUrl() + "/resetPassword/"
                },
                onSuccess: () => {
                    alert("A password reset email was sent to " + this.passwordResetEmail);
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        }
    }, 
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
.centered-link {
    margin: calc(var(--default-spacing)*3) auto;
    text-align: center;
}
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
</style>