<template>
    <base-card class="centered-card">        
        <form @submit.prevent="login">
            <page-title class="title" :text="$t('login_form_title')"></page-title>
            <base-input
                type="text"
                name="email"
                :label="$t('login_form_email_input_label')"
                v-model.trim="enteredEmail"
                @change="$emit('change', enteredEmail)">
            </base-input>
            <base-input 
                type="password"
                name="password"
                :label="$t('login_form_password_input_label')"
                v-model="enteredPassword">
            </base-input>
            <div class="buttons">
                <router-link class="register-button" to="/register">{{ $t('login_form_register_link_text') }}</router-link>
                <base-button class="login-button" type="submit">{{ $t('login_form_login_button_text') }}</base-button>
            </div>
        </form>
        <email-verification-modal
            :shouldShow="shouldShowEmailVerificationModal"
            v-model="enteredEmail"
            :dismiss="dismissEmailVerificationModal"
            :onSuccess="onSendEmailVerificationEmailSuccess"
            :onFailure="onSendEmailVerificationEmailFailure">
        </email-verification-modal>
        <alert-modal
            :shouldShow="shouldShowAlertModal"
            :title="alertTitle"
            :message="alertMessage"
            :dismiss="dismissAlertModal">
        </alert-modal>
    </base-card>
</template>

<script>
import network from "../../network/network.js";
import exceptions from "../../network/exceptions.js";
import EmailVerificationModal from "../modals/EmailVerificationModal.vue";
import PageTitle from "../base/PageTitle.vue";

export default {
    components: { EmailVerificationModal, PageTitle },
    props: ["email"],
    emits: ["change"],
    data() {
        return {
            enteredEmail: this.email,
            enteredPassword: "",
            shouldShowEmailVerificationModal: false,
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: ""
        }
    },
    methods: {
        login() {
            network.login({
                headerParams: {
                    email: this.enteredEmail,
                    password: this.enteredPassword
                },
                onSuccess: () => {
                    this.$router.push({ name: "home" });
                },
                onFailure: error => {
                    if (error.exception === exceptions.emailIsNotVerified) {
                        this.shouldShowEmailVerificationModal = true
                    } else if (error.status === 401) {
                        this.alertTitle = this.$t('alert_generic_error_title');
                        this.alertMessage = this.$t('incorrect_email_or_password_message');
                        this.shouldShowAlertModal = true;
                    } else {
                        this.alertTitle = this.$t('alert_generic_error_title');
                        this.alertMessage = this.$t('alert_generic_error_message');
                        this.shouldShowAlertModal = true;
                    }
                }
            })
        },
        dismissEmailVerificationModal() {
            this.shouldShowEmailVerificationModal = false;
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        },
        onSendEmailVerificationEmailSuccess(email) {
            this.alertTitle = this.$t('alert_generic_success_title');
            this.alertMessage = this.$t('alert_modal_email_verification_required_message', { 'email': email });
            this.shouldShowAlertModal = true;
        },
        onSendEmailVerificationEmailFailure(error) {
            this.alertTitle = this.$t('alert_generic_error_title');
            this.alertMessage = this.$t('send_email_verification_error_message');
            if (error.exception == exceptions.userDoesNotExist) {
                this.alertMessage = this.$t('user_with_email_does_not_exist_message');
            }
            this.shouldShowAlertModal = true;
        }
    },
    watch: {
        email() {
            this.enteredEmail = this.email;
        }
    }
}
</script>

<style scoped>
form {
    padding: var(--default-spacing);
}
.title {
    margin: 0;
    margin-bottom: var(--default-spacing);
}
.register-button {
    padding: calc(var(--default-spacing)/2) var(--default-spacing);
    font-size: var(--default-font-size);
}
.buttons {
    margin-top: calc(var(--default-spacing)*2);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    column-gap: calc(var(--default-spacing)/2);
}
</style>