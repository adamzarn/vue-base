<template>
    <base-card class="centered">
        <form @submit.prevent="login">
            <h2>Login</h2>
            <base-input
                type="text"
                name="email"
                label="Email"
                v-model="enteredEmail">
            </base-input>
            <base-input 
                type="password"
                name="password"
                label="Password" 
                v-model="enteredPassword">
            </base-input>
            <base-button class="login-button" type="submit">Login</base-button>
        </form>
    </base-card>
</template>

<script>

export default {
    data() {
        return {
            enteredEmail: '',
            enteredPassword: '',
        }
    },
    computed: {
        authorization() {
            const auth = "Basic " + btoa(this.enteredEmail + ':' + this.enteredPassword)
            return auth
        }
    },
    methods: {
        login() {
            fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': this.authorization
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
            })
        }
    }
}
</script>

<style scoped>
h2 {
    margin: 0px;
    margin-bottom: 30px;
}
.login-button {
    display: flex;
    margin-left: auto;
    margin-top: 30px;
}
</style>