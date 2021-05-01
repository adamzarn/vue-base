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
        }
    },
    methods: {
        login() {
            const viewModel = this;
            network.login({
                email: viewModel.enteredEmail,
                password: viewModel.enteredPassword,
                onSuccess: () => {
                    viewModel.$router.push({ name: 'home' });
                },
                onFailure: error => {
                    alert(error);
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
};
</style>