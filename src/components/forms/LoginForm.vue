<template>
    <base-card>
        <form @submit.prevent="login">
            <page-title text="Login"></page-title>
            <base-input
                type="text"
                name="email"
                label="Email"
                :validate="validateEmail"
                v-model.trim="enteredEmail"
                @change="$emit('change', enteredEmail)">
            </base-input>
            <p class="validation" v-if="emailIsInvalid">You must provide a valid email</p>
            <base-input 
                type="password"
                name="password"
                label="Password"
                v-model="enteredPassword">
            </base-input>
            <div class="buttons">
                <router-link class="register-button" to='/register'>Register</router-link>
                <base-button class="login-button" type="submit">Login</base-button>
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
import network from '../../network/network.js';
import exceptions from '../../network/exceptions.js';
import EmailVerificationModal from '../modals/EmailVerificationModal.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { EmailVerificationModal, PageTitle },
    props: ['email'],
    emits: ['change'],
    data() {
        return {
            enteredEmail: this.email,
            enteredPassword: '',
            emailIsInvalid: false,
            shouldShowEmailVerificationModal: false,
            shouldShowAlertModal: false,
            alertTitle: '',
            alertMessage: ''
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
                    this.$router.push({ name: 'home' });
                },
                onFailure: error => {
                    if (error.exception === exceptions.emailIsNotVerified) {
                        this.shouldShowEmailVerificationModal = true
                    } else if (error.status === 401) {
                        this.alertTitle = "Oops..."
                        this.alertMessage = "Your email or password was incorrect."
                        this.shouldShowAlertModal = true;
                    } else {
                        this.alertTitle = "Oops..."
                        this.alertMessage = "Something went wrong."
                        this.shouldShowAlertModal = true;
                    }
                }
            })
        },
        dismissEmailVerificationModal() {
            this.shouldShowEmailVerificationModal = false;
        },
        validateEmail() {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            this.emailIsInvalid = !regex.test(this.enteredEmail)
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        },
        onSendEmailVerificationEmailSuccess(email) {
            this.alertTitle = "Success";
            this.alertMessage = `An email verification email has been sent to ${email}.`
            this.shouldShowAlertModal = true;
        },
        onSendEmailVerificationEmailFailure(error) {
            this.alertTitle = "Oops..."
            this.alertMessage = "There was a problem sending the email verification email. Please contact support.";
            if (error.exception == exceptions.userDoesNotExist) {
                this.alertMessage = "A user with that email does not exist.";
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
    margin-bottom: calc(var(--default-spacing)*2);
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