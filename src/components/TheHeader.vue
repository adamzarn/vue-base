<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <a href="/home" class="brand"><img src="logo.svg" alt="brand"></a>
            <nav class="nav">
                <base-button v-if="$route.name!=='login'" @click="logout">Logout</base-button>
            </nav>
        </div>
    </header>
</template>

<script>
import api from '../constants/api.js';

export default {
    computed: {
        authorization() {
            return "Bearer " + localStorage.token;
        }
    },
    methods: {
        logout() {
            fetch(api.baseUrl + '/auth/logout', {
                method: 'DELETE',
                headers: {
                    'Authorization': this.authorization
                }
            }).then(response => {
                if (response.ok) {
                    localStorage.clear();
                    this.$router.push('/login');
                } else {
                    console.log(response);
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
.site-header__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    background-color: var(--theme-dark-color);
}
button {
    color: var(--theme-light-color);
    background-color: var(--theme-light-color);
    margin-right: 16px;
    color: white;
}
</style>