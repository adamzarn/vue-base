<template>
    <base-card class="centered-horizontally">
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
import api from '../../constants/api.js';

export default {
    data() {
        return {
            enteredEmail: '',
            enteredPassword: '',
            emailIsInvalid: false
        }
    },
    computed: {
        authorization() {
            return "Basic " + btoa(this.enteredEmail + ':' + this.enteredPassword)
        }
    },
    methods: {
        login() {
            fetch(api.baseUrl + '/auth/login', {
                method: 'POST',
                headers: {
                    'Authorization': this.authorization
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                localStorage.token = data.token;
                localStorage.firstName = data.user.firstName;
                localStorage.lastName = data.user.lastName;
                this.$router.push('/home');
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
h2 {
    margin: 0px;
    margin-bottom: 30px;
}
.register-button {
    padding: 0.5rem 1rem;
}
.buttons {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
};

</style>