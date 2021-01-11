<template>
    <base-card class="centered-horizontally">
        <h2>Users</h2>
        <div :v-if="users.length > 0">
            <user-list-item 
                v-for="user in users"
                :key="user.id"
                :name="user.firstName + ' ' + user.lastName"
                :email="user.email">
            </user-list-item>
        </div>
    </base-card>
</template>

<script>
import network from '../layers/network.js';
import UserListItem from '../components/UserListItem.vue';

export default {
    components: {
        UserListItem
    },
    data() {
        return {
            users: []
        }
    },
    methods: {
        getUsers() {
            const viewModel = this;
            network.getUsers({
                onSuccess: users => {
                    viewModel.users = users;
                },
                onFailure: error => {
                    alert(error);
                }
            })
        }
    },
    mounted() {
        this.getUsers()
    }
}
</script>

<style scoped>
</style>