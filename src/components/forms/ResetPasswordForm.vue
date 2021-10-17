<template>
    <base-card class="centered-card">
        <form @submit.prevent="resetPassword">
            <page-title class="title" :text="$t('reset_password_form_title')"></page-title>
            <base-input 
                type="password"
                name="password"
                :label="$t('reset_password_form_password_input_label')"
                :validate="validatePassword"
                v-model="enteredPassword">
            </base-input>
            <p class="validation" v-if="passwordIsInvalid">{{ invalidPasswordMessage }}</p>
            <base-input 
                type="password"
                name="confirmed-password"
                :label="$t('reset_password_form_confirm_password_input_label')"
                :validate="validateConfirmedPassword"
                v-model="enteredConfirmedPassword">
            </base-input>
            <p class="validation" v-if="confirmedPasswordIsInvalid">{{ invalidPasswordMessage }}</p>
            <p class="validation" v-if="!passwordsMatch">{{ $t('reset_password_form_password_mismatch_warning_message') }}</p>
            <div class="buttons">
                <router-link class="login-button" to="/login">{{ $t('reset_password_form_login_button_text') }}</router-link>
                <base-button type="submit">{{ $t('reset_password_form_submit_button_text') }}</base-button>
            </div>
        </form>
    </base-card>
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import network from "../../network/network.js";
import exceptions from "../../network/exceptions.js";
import PageTitle from "../base/PageTitle.vue";

export default {
    components: { PageTitle },
    data() {
        return {
            enteredPassword: "",
            enteredConfirmedPassword: "",
            passwordIsInvalid: false,
            confirmedPasswordIsInvalid: false,
            minPasswordLength: 6,
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: "",
            shouldNavigateBackToLogin: false
        }
    },
    computed: {
        passwordsMatch() {
            return this.enteredPassword === this.enteredConfirmedPassword;
        },
        invalidPasswordMessage() {
            return this.$t('reset_password_form_invalid_password_warning_message', { 'minPasswordLength': this.minPasswordLength })
        },
        formIsInvalid() {
            return this.passwordIsInvalid || this.confirmedPasswordIsInvalid || this.enteredPassword == "" || this.enteredConfirmedPassword === "";
        }
    },
    methods: {
        resetPassword() {
            if (this.formIsInvalid) {
                this.alertTitle = this.$t('alert_generic_error_title');
                this.alertMessage = this.$t('reset_password_form_invalid_password_message');
                this.shouldShowAlertModal = true;
                return
            }
            network.resetPassword({
                urlParams: {
                    tokenId: this.$route.params.tokenId
                },
                body: {
                    value: this.enteredPassword
                },
                onSuccess: () => {
                    this.alertTitle = this.$t('alert_generic_success_title');
                    this.alertMessage = this.$t('reset_password_form_success_message');
                    this.shouldNavigateBackToLogin = true;
                    this.shouldShowAlertModal = true;
                },
                onFailure: error => {
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.$t('reset_password_form_error_message');
                    this.shouldNavigateBackToLogin = false;
                    if (error.exception == exceptions.invalidToken) {
                        this.shouldNavigateBackToLogin = true;
                        this.alertMessage = this.$t('reset_password_form_expiration_message');
                    }
                    this.shouldShowAlertModal = true;
                }
            })
        },
        validatePassword() {
            this.passwordIsInvalid = this.enteredPassword.length < this.minPasswordLength
        },
        validateConfirmedPassword() {
            this.confirmedPasswordIsInvalid = this.enteredConfirmedPassword.length < this.minPasswordLength
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
            if (this.shouldNavigateBackToLogin) { 
                this.$router.push({ name: "login" });
            }
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
.login-button {
    padding: calc(var(--default-spacing)/2) var(--default-spacing);
}
.buttons {
    margin-top: calc(var(--default-spacing)*2);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
};
</style>