<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <a href="/home" class="brand"><img src="/logo.svg" alt="brandy"></a>
            <nav class="buttons-container">
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
            return !['login', 'register', 'resetPassword'].includes(this.$route.name);
        },
        shouldShowAccountButton() {
            return !['login', 'register', 'resetPassword'].includes(this.$route.name);
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
.buttons-container {
    display: inline-block;
    margin-right: 16px;
}
button {
    color: var(--theme-light-color);
    background-color: var(--theme-light-color);
    color: white;
    display: inline-block;
    margin-left: 16px;
}
.separator {
    background-color: var(--light-gray-color);
    height: 1px;
}
@media only screen and (max-width: 480px) {
    .site-header__wrapper, img, .buttons-container, button {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .site-header__wrapper {
        width: 100%;
    }
    button {
        margin-bottom: 16px;
    }
}
</style>