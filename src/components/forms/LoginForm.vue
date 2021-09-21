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
            :sendEmail="sendEmailVerificationEmail">
        </email-verification-modal>
        <error-modal
            :shouldShow="shouldShowErrorModal"
            :title="errorTitle"
            :message="errorMessage"
            :dismiss="dismissErrorModal">
        </error-modal>
    </base-card>
</template>

<script>
import network from '../../network/network.js';
import exceptions from '../../network/exceptions.js';
import EmailVerificationModal from '../modals/EmailVerificationModal.vue';
import ErrorModal from '../modals/ErrorModal.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { EmailVerificationModal, ErrorModal, PageTitle },
    emits: ['change'],
    data() {
        return {
            enteredEmail: '',
            enteredPassword: '',
            emailIsInvalid: false,
            shouldShowEmailVerificationModal: false,
            shouldShowErrorModal: false,
            errorTitle: '',
            errorMessage: ''
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
                        this.errorTitle = "Oops..."
                        this.errorMessage = "Your email or password was incorrect."
                        this.shouldShowErrorModal = true;
                    } else {
                        alert(error.description);
                    }
                }
            })
        },
        dismissEmailVerificationModal() {
            this.shouldShowEmailVerificationModal = false;
        },
        sendEmailVerificationEmail() {
            this.shouldShowEmailVerificationModal = false;
            network.sendEmailVerificationEmail({
                body: {
                    email: this.enteredEmail,
                    frontendBaseUrl: `${network.frontendBaseUrl()}/verifyEmail`
                },
                onSuccess: () => {
                    alert(`An email verification email was sent to ${this.enteredEmail}.`)
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        validateEmail() {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            this.emailIsInvalid = !regex.test(this.enteredEmail)
        },
        dismissErrorModal() {
            this.shouldShowErrorModal = false;
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