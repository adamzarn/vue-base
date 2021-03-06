<template>
    <base-card class="centered-horizontally">
        <form @submit.prevent="register">
            <h2>Register</h2>
            <base-input
                type="text"
                name="first-name"
                label="First Name"
                :validate="validateFirstName"
                v-model.trim="enteredFirstName">
            </base-input>
            <p class="validation" v-if="firstNameIsInvalid">You must provide a first name</p>
            <base-input 
                type="text"
                name="last-name"
                label="Last Name"
                :validate="validateLastName"
                v-model.trim="enteredLastName">
            </base-input>
            <p class="validation" v-if="lastNameIsInvalid">You must provide a last name</p>
            <base-input
                type="text"
                name="username"
                label="Username"
                v-model.trim="enteredUsername">
            </base-input>
            <base-input
                type="text"
                name="email"
                label="Email"
                :validate="validateEmail"
                :confirm="checkIfUserAlreadyExists"
                v-model.trim="enteredEmail">
            </base-input>
            <p class="validation" v-if="emailIsInvalid">You must provide a valid email</p>
            <p class="validation" v-if="emailAlreadyExists">A user with that email already exists</p>
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
            <p class="validation" v-if="!passwordsMatch">Passwords don't match</p>
            <div class="buttons">
                <router-link class="login-button" to='/login'>Login</router-link>
                <base-button class="register-button" type="submit">Register</base-button>
            </div>
        </form>
    </base-card>
</template>

<script>
import network from '../../network/network.js';
import exceptions from '../../network/exceptions.js';

export default {
    data() {
        return {
            enteredFirstName: '',
            enteredLastName: '',
            enteredUsername: '',
            enteredEmail: '',
            enteredPassword: '',
            enteredConfirmedPassword: '',
            firstNameIsInvalid: false,
            lastNameIsInvalid: false,
            emailIsInvalid: false,
            passwordIsInvalid: false,
            confirmedPasswordIsInvalid: false,
            minPasswordLength: 6,
            emailAlreadyExists: false
        }
    },
    computed: {
        passwordsMatch() {
            return this.enteredPassword === this.enteredConfirmedPassword;
        },
        invalidPasswordMessage() {
            return `Your password must have at least ${this.minPasswordLength} characters`;
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
                    this.$router.push({ name: 'home' });
                },
                onFailure: error => {
                    if (error.exception === exceptions.emailIsNotVerified) {
                        this.sendEmailVerificationEmail();
                    } else {
                        alert(error.description);
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
                    alert(`An email verification email was sent to ${this.enteredEmail}.`)
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        validateFirstName() {
            this.firstNameIsInvalid = this.enteredFirstName === '';
        },
        validateLastName() {
            this.lastNameIsInvalid = this.enteredLastName === '';
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
                onFailure: error => {
                    alert(error.description);
                }
            })    
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
.login-button {
    padding: calc(var(--default-spacing)/2) var(--default-spacing);
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