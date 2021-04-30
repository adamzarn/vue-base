<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <a href="/home" class="brand"><img src="/logo.svg" alt="brandy"></a>
            <nav v-if="shouldShowButtons" class="buttons-container">
                <base-button @click="home">Home</base-button>
                <base-button @click="profile">Profile</base-button>
                <base-button @click="logout">Logout</base-button>
            </nav>
        </div>
        <div class="separator"></div>
    </header>
</template>

<script>
import network from '../layers/network.js';

export default {
    computed: {
        shouldShowButtons() {
            return !['login', 'register', 'resetPassword'].includes(this.$route.name);
        }
    },
    methods: {
        home() {
            this.$router.push({ name: 'home' });
        },
        profile() {
            this.$router.push({ name: 'profile', params: { userId: localStorage.user().id }});
        },
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
        validateEmail() {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            this.emailIsInvalid = !regex.test(this.enteredEmail)
        }
    }
}
</script>

<style scoped>
.site-header__wrapper {
    margin: 16px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}
.buttons-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 16px;
}
button {
    color: var(--theme-light-color);
    background-color: var(--theme-light-color);
    color: white;
}
.separator {
    background-color: var(--light-gray-color);
    height: 1px;
}
@media only screen and (max-width: 480px) {
    .site-header__wrapper, img, .buttons-container, button {
        flex-flow: column;
        align-items: stretch;
        justify-content: center;
        row-gap: 16px;
    }
    .buttons-container {
        flex-flow: column;
    }
}
</style>