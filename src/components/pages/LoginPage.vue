<template>
    <login-form :email="enteredEmail" @change="didUpdateEmail"></login-form>
    <div class="centered-link">
        <a @click="showForgotPasswordModal">Forgot Password?</a>
    </div>
    <forgot-password-modal
        :shouldShow="shouldShowForgotPasswordModal"
        v-model="enteredEmail"
        :dismiss="dismissForgotPasswordModal"
        :onSuccess="onSendForgotPasswordEmailSuccess"
        :onFailure="onSendForgotPasswordEmailFailure"
        :didUpdateEmail="didUpdateEmail">
    </forgot-password-modal>
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import LoginForm from '../forms/LoginForm.vue';
import './../../local-storage-helper.js';
import ForgotPasswordModal from '../modals/ForgotPasswordModal.vue';
import exceptions from '../../network/exceptions.js';

export default {
    components: { LoginForm, ForgotPasswordModal },
    data() {
        return {
            enteredEmail: '',
            shouldShowForgotPasswordModal: false,
            shouldShowAlertModal: false,
            alertTitle: '',
            alertMessage: ''
        }
    },
    methods: {
        didUpdateEmail(email) {
            this.enteredEmail = email;
        },
        showForgotPasswordModal() {
            this.shouldShowForgotPasswordModal = true;
        },
        dismissForgotPasswordModal() {
            this.shouldShowForgotPasswordModal = false;
        },
        onSendForgotPasswordEmailSuccess(email) {
            this.alertTitle = "Success"
            this.alertMessage = `A password reset email has been sent to ${email}`
            this.shouldShowAlertModal = true;
        },
        onSendForgotPasswordEmailFailure(error) {
            this.alertTitle = "Oops..."
            this.alertMessage = "Something went wrong"
            if (error.exception == exceptions.userDoesNotExist) {
                this.alertMessage = "A user with that email does not exist.";
            }
            this.shouldShowAlertModal = true;
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
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