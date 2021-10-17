<template>
    <login-form :email="enteredEmail" @change="didUpdateEmail"></login-form>
    <div class="centered-link">
        <a @click="showForgotPasswordModal">{{ $t('login_page_forgot_password_link_text') }}</a>
    </div>
    <password-reset-modal
        :shouldShow="shouldShowForgotPasswordModal"
        v-model="enteredEmail"
        :dismiss="dismissForgotPasswordModal"
        :onSuccess="onSendForgotPasswordEmailSuccess"
        :onFailure="onSendForgotPasswordEmailFailure"
        :didUpdateEmail="didUpdateEmail">
    </password-reset-modal>
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import LoginForm from "../forms/LoginForm.vue";
import "./../../local-storage-helper.js";
import PasswordResetModal from "../modals/PasswordResetModal.vue";
import exceptions from "../../network/exceptions.js";

export default {
    components: { LoginForm, PasswordResetModal },
    data() {
        return {
            enteredEmail: "",
            shouldShowForgotPasswordModal: false,
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: ""
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
            this.alertTitle = this.$t('alert_generic_success_title');
            this.alertMessage = this.$t('login_page_password_reset_message', { 'email': email });
            this.shouldShowAlertModal = true;
        },
        onSendForgotPasswordEmailFailure(error) {
            this.alertTitle = this.$t('alert_generic_error_title');
            this.alertMessage = this.$t('alert_generic_error_message');
            if (error.exception == exceptions.userDoesNotExist) {
                this.alertMessage = this.$t('user_with_email_does_not_exist_message');
            }
            this.shouldShowAlertModal = true;
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        }
    }, 
    mounted() {
        if (localStorage.isLoggedIn()) {
            this.$router.push({ name: "home" });
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