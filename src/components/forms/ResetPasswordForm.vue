<template>
    <base-card>
        <form @submit.prevent="resetPassword">
            <h2>Reset Password</h2>
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
                <base-button type="submit">Submit</base-button>
            </div>
        </form>
    </base-card>
</template>

<script>
import network from '../../network/network.js';

export default {
    data() {
        return {
            enteredPassword: '',
            enteredConfirmedPassword: '',
            passwordIsInvalid: false,
            confirmedPasswordIsInvalid: false,
            minPasswordLength: 6
        }
    },
    computed: {
        passwordsMatch() {
            return this.enteredPassword === this.enteredConfirmedPassword;
        },
        invalidPasswordMessage() {
            return `Your password must have at least ${this.minPasswordLength} characters`;
        },
        formIsInvalid() {
            return this.passwordIsInvalid || this.confirmedPasswordIsInvalid || this.enteredPassword == '' || this.enteredConfirmedPassword === '';
        }
    },
    methods: {
        resetPassword() {
            if (this.formIsInvalid) {
                alert("Please enter and confirm a valid password.")
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
                    alert("Your password was successfully reset. You will now be redirected to the login page.")
                    this.$router.push({ name: 'login' });
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        validatePassword() {
            this.passwordIsInvalid = this.enteredPassword.length < this.minPasswordLength
        },
        validateConfirmedPassword() {
            this.confirmedPasswordIsInvalid = this.enteredConfirmedPassword.length < this.minPasswordLength
        },
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
};
</style>