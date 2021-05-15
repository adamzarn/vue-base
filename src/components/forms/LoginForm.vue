<template>
    <base-card>
        <form @submit.prevent="login">
            <h2>Login</h2>
            <base-input
                type="text"
                name="email"
                label="Email"
                :validate="validateEmail"
                v-model.trim="enteredEmail">
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
        <base-modal v-if="shouldShowVerifyEmailModal" title="Verify Email">
            <template #default>
                <p>You must verify your email to login. Follow the link from the email we sent you at registration, or enter your email and we'll send you a new email verification email.</p>
                <base-input
                    v-model.trim="enteredEmail"
                ></base-input>
            </template>
            <template #actions>
                <div class="buttons-container">
                    <base-button @click="dismissEmailVerificationModal">Cancel</base-button>
                    <base-button @click="sendEmailVerificationEmail">Send</base-button>
                </div>
            </template>
        </base-modal>
    </base-card>
</template>

<script>
import network from '../../layers/network.js';

export default {
    data() {
        return {
            enteredEmail: '',
            enteredPassword: '',
            emailIsInvalid: false,
            shouldShowVerifyEmailModal: false
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
                    if (error.identifier === 'emailIsNotVerified') {
                        this.shouldShowVerifyEmailModal = true
                    } else {
                        alert(error.description);
                    }
                }
            })
        },
        dismissEmailVerificationModal() {
            this.shouldShowVerifyEmailModal = false;
        },
        sendEmailVerificationEmail() {
            this.shouldShowVerifyEmailModal = false;
            network.sendEmailVerificationEmail({
                email: this.enteredEmail,
                password: this.enteredPassword,
                onSuccess: () => {
                    alert(`An email verification email was sent to ${this.enteredEmail}`)
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        validateEmail() {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            this.emailIsInvalid = !regex.test(this.enteredEmail)
        }
    }
}
</script>

<style scoped>
form {
    padding: var(--default-spacing);
}
h2 {
    margin: 0;
    margin-bottom: calc(var(--default-spacing)*2);
}
.register-button {
    padding: calc(var(--default-spacing)/2) var(--default-spacing);
}
.buttons {
    margin-top: calc(var(--default-spacing)*2);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    column-gap: calc(var(--default-spacing)/2);
}
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
</style>