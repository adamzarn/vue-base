<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <a href="/home" class="brand"><img src="logo.svg" alt="brand"></a>
            <nav class="nav">
                <base-button class="header-button" v-if="shouldShowAccountButton" @click="account">Account</base-button>
                <base-button class="header-button" v-if="shouldShowLogoutButton" @click="logout">Logout</base-button>
            </nav>
        </div>
        <div class="separator"></div>
    </header>
</template>

<script>
import network from '../layers/network.js';

export default {
    computed: {
        shouldShowLogoutButton() {
            return this.$route.name !== 'login' && this.$route.name !== 'register'
        },
        shouldShowAccountButton() {
            return this.$route.name !== 'login' && this.$route.name !== 'register'
        }
    },
    methods: {
        logout() {
            network.logout({
                onSuccess: () => {
                    this.$router.push({ name: 'login' });
                },
                onFailure: error => {
                    alert(error);
                }
            })
        },
        account() {
            this.$router.push({ name: 'account' });
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
}
button {
    color: var(--theme-light-color);
    background-color: var(--theme-light-color);
    margin-right: 16px;
    color: white;
}
.header-button {
    padding: 0.5rem;
}
.separator {
    background-color: var(--light-gray-color);
    height: 1px;
}
</style>