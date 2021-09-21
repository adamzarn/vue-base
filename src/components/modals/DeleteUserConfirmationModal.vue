<template>
    <base-modal v-if="shouldShow" title="Delete User">
        <template #default>
            <p>{{ message }}</p>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">Cancel</base-button>
                <base-button @click="deleteUser">Continue</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import network from '../../network/network.js';
import './../../local-storage-helper.js';
import ModalButtons from '../modals/ModalButtons.vue';

export default {
    components: { ModalButtons },
    props: ['shouldShow', 'user', 'dismiss'],
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        fullName() {
            return `${this.user.firstName} ${this.user.lastName}`
        },
        possessiveFullName() {
            var lastChar = this.user.lastName[this.user.lastName.length - 1];
            return (lastChar === 's') ? `${this.fullName}'` : `${this.fullName}'s`
        },
        message() {
            if (this.userIsLoggedInUser) {
                return `Are you sure you want to delete your account? You will be logged out and all of your data will be deleted.`
            } else {
                return `Are you sure you want to delete ${this.possessiveFullName} account? This will delete all of his or her data and you will be returned to the home page.`
            }
        }
    },
    methods: {
        deleteUser() {
            network.deleteUser({
                urlParams: {
                    userId: this.user.id
                },
                onSuccess: () => {
                    if (this.userIsLoggedInUser) {
                        localStorage.clear();
                        this.$router.push({ name: 'login' });
                    } else {
                        this.$router.push({ name: 'home' });
                    }
                },
                onFailure: error => { alert(error.description); }
            });
        }
    }
}
</script>

<style scoped>
</style>