<template>
    <base-card class="centered-card">        
        <form @submit.prevent="register">
            <page-title class="title" text="Register"></page-title>
            <base-input
                type="text"
                name="first-name"
                :label="$t('register_form_first_name_input_label')"
                :validate="validateFirstName"
                v-model.trim="enteredFirstName">
            </base-input>
            <p class="validation" v-if="firstNameIsInvalid">{{ $t('register_form_invalid_first_name_warning_message') }}</p>
            <base-input 
                type="text"
                name="last-name"
                :label="$t('register_form_last_name_input_label')"
                :validate="validateLastName"
                v-model.trim="enteredLastName">
            </base-input>
            <p class="validation" v-if="lastNameIsInvalid">{{ $t('register_form_invalid_last_name_warning_message') }}</p>
            <base-input
                type="text"
                name="username"
                :label="$t('register_form_username_input_label')"
                v-model.trim="enteredUsername">
            </base-input>
            <base-input
                type="text"
                name="email"
                :label="$t('register_form_email_input_label')"
                :validate="validateEmail"
                :confirm="checkIfUserAlreadyExists"
                v-model.trim="enteredEmail">
            </base-input>
            <p class="validation" v-if="emailIsInvalid">{{ $t('register_form_invalid_email_warning_message') }}</p>
            <p class="validation" v-if="emailAlreadyExists">{{ $t('register_form_email_taken_warning_message') }}</p>
            <base-input 
                type="password"
                name="password"
                label="Password"
                :validate="validatePassword"
                v-model="enteredPassword">
            </base-input>
            <p class="validation" v-if="passwordIsInvalid">{{ invalidPasswordMessage }}</p>
            <base-input 
                type="password"
                name="confirmed-password"
                label="Confirm Password"
                :validate="validateConfirmedPassword"
                v-model="enteredConfirmedPassword">
            </base-input>
            <p class="validation" v-if="confirmedPasswordIsInvalid">{{ invalidPasswordMessage }}</p>
            <p class="validation" v-if="!passwordsMatch">{{ $t('register_form_password_mismatch_warning_message') }}</p>
            <div class="buttons">
                <router-link class="login-button" to="/login">{{ $t('register_form_login_link_text') }}</router-link>
                <base-button class="register-button" type="submit">{{ $t('register_form_register_button_text') }}</base-button>
            </div>
        </form>
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
import PageTitle from "../base/PageTitle.vue";

export default {
    components: { PageTitle }, 
    data() {
        return {
            enteredFirstName: "",
            enteredLastName: "",
            enteredUsername: "",
            enteredEmail: "",
            enteredPassword: "",
            enteredConfirmedPassword: "",
            firstNameIsInvalid: false,
            lastNameIsInvalid: false,
            emailIsInvalid: false,
            passwordIsInvalid: false,
            confirmedPasswordIsInvalid: false,
            minPasswordLength: 6,
            emailAlreadyExists: false,
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: ""
        }
    },
    computed: {
        passwordsMatch() {
            return this.enteredPassword === this.enteredConfirmedPassword;
        },
        invalidPasswordMessage() {
            return this.$t('register_form_invalid_password_warning_message', { 'minPasswordLength': this.minPasswordLength })
        }
    },
    methods: {
        register() {
            network.register({
                body: {
                    firstName: this.enteredFirstName,
                    lastName: this.enteredLastName,
                    username: this.enteredUsername,
                    email: this.enteredEmail,
                    password: this.enteredPassword
                },
                onSuccess: () => {
                    this.$router.push({ name: "home" });
                },
                onFailure: error => {
                    if (error.exception === exceptions.emailIsNotVerified) {
                        this.sendEmailVerificationEmail();
                    } else if (error.status === 400) {
                        this.showAlertModal(this.$t('alert_generic_error_title'), error.reason);
                    } else {
                        this.showGenericAlertModal();
                    }
                }
            })
        },
        sendEmailVerificationEmail() {
            network.sendEmailVerificationEmail({
                body: {
                    email: this.enteredEmail,
                    frontendBaseUrl: `${network.frontendBaseUrl()}/verifyEmail`
                },
                onSuccess: () => {
                    this.showAlertModal(
                        this.$t('alert_modal_email_verification_required_title'),
                        this.$t('alert_modal_email_verification_required_message', { 'email': this.enteredEmail })
                    );
                },
                onFailure: () => {
                    this.showGenericAlertModal();
                }
            })
        },
        validateFirstName() {
            this.firstNameIsInvalid = this.enteredFirstName === "";
        },
        validateLastName() {
            this.lastNameIsInvalid = this.enteredLastName === "";
        },
        validateEmail() {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            this.emailIsInvalid = !regex.test(this.enteredEmail)
            this.emailAlreadyExists = false
        },
        validatePassword() {
            this.passwordIsInvalid = this.enteredPassword.length < this.minPasswordLength
        },
        validateConfirmedPassword() {
            this.confirmedPasswordIsInvalid = this.enteredConfirmedPassword.length < this.minPasswordLength
        },
        checkIfUserAlreadyExists() {
            const viewModel = this;
            network.getUserStatus({
                queryParams: {
                    email: this.enteredEmail
                },
                onSuccess: userStatus => {
                    viewModel.emailAlreadyExists = userStatus.exists;
                },
                onFailure: () => {
                    this.showGenericAlertModal();
                }
            })    
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        },
        showAlertModal(title, message) {
            this.alertTitle = title;
            this.alertMessage = message;
            this.shouldShowAlertModal = true;
        },
        showGenericAlertModal() {
            this.showAlertModal(
                this.$t('alert_generic_error_title'), 
                this.$t('alert_generic_error_message')
            );
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
    font-size: var(--default-font-size);
}
.buttons {
    margin-top: calc(var(--default-spacing)*2);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    column-gap: calc(var(--default-spacing)/2);
};
</style>