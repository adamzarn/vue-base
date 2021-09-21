<template>
    <login-form @change="emailDidChange" class="centered-card"></login-form>
    <div class="centered-link">
        <a @click="showForgotPasswordModal">Forgot Password?</a>
    </div>
    <forgot-password-modal
        :shouldShow="shouldShowForgotPasswordModal"
        v-model="passwordResetEmail"
        :dismiss="dismissForgotPasswordModal"
        :sendEmail="sendForgotPasswordEmail">
    </forgot-password-modal>
</template>

<script>
import LoginForm from '../forms/LoginForm.vue';
import network from '../../network/network.js';
import './../../local-storage-helper.js';
import ForgotPasswordModal from '../modals/ForgotPasswordModal.vue';

export default {
    components: { LoginForm, ForgotPasswordModal },
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
                    url: `${network.frontendBaseUrl()}/resetPassword`
                },
                onSuccess: () => {
                    alert(`A password reset email was sent to ${this.passwordResetEmail}.`);
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        emailDidChange(newEmail) {
            this.passwordResetEmail = newEmail;
        }
    }, 
    mounted() {
        if (localStorage.isLoggedIn()) {
            this.$router.push({ name: 'home' });
        }
    }
}
</script>

<style scoped>
.centered-link {
    margin: calc(var(--default-spacing)*3) auto;
    text-align: center;
    font-size: var(--default-font-size);
}
</style>