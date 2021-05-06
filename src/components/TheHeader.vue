<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <a href="/home" class="brand"><img src="/logo.svg" alt="brandy"></a>
            <nav v-if="shouldShowButtons" class="buttons-container">
                <base-button @click="home">Home</base-button>
                <base-button v-if="isAdmin" @click="manageUsers">Manage Users</base-button>
                <base-button @click="profile">My Profile</base-button>
                <base-button @click="logout">Logout</base-button>
            </nav>
        </div>
        <div class="separator"></div>
    </header>
</template>

<script>
import network from '../layers/network.js';

export default {
    data() {
        return {
            isAdmin: false
        }
    },
    computed: {
        shouldShowButtons() {
            return !['login', 'register', 'resetPassword'].includes(this.$route.name);
        }
    },
    methods: {
        home() {
            this.$router.push({ name: 'home' });
        },
        manageUsers() {
            this.$router.push({ name: 'manageUsers' });
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
    },
    watch: {
        $route() {
            if (localStorage.user() !== null) {
                this.isAdmin = localStorage.user().isAdmin;
            }
        }
    }
}
</script>

<style scoped>
.site-header__wrapper {
    margin: var(--default-spacing);
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
}
.buttons-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: var(--default-spacing);
}
button {
    color: var(--theme-light-color);
    background-color: var(--theme-light-color);
    color: white;
}
.separator {
    background-color: var(--light-gray-color);
    height: calc(var(--default-spacing)/16);
}
@media only screen and (max-width: 480px) {
    .site-header__wrapper, img, .buttons-container, button {
        flex-flow: column;
        align-items: stretch;
        justify-content: center;
        row-gap: var(--default-spacing);
    }
    .buttons-container {
        flex-flow: column;
    }
}
</style>