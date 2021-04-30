<template>
    <div class="container">
        <h1 style="padding-left:1rem">Users</h1>
        <user-list :users="users" :refresh="getData"></user-list>
    </div>
</template>

<script>
import UserList from '../UserList.vue';
import network from '../../layers/network.js';

export default {
    components: {
        UserList
    },
    computed: {
        fullName() {
            return localStorage.getObject('user').firstName + ' ' + localStorage.getObject('user').lastName;
        }
    },
    data() {
        return {
            users: []
        }
    },
    methods: {
        getData() {
            network.getUsersAndFollows({
                onSuccess: users => {
                    this.users = users.filter(user => {
                        return user.you == false;
                    });
                },
                onFailure: error => {
                    alert(error);
                }
            })
        }
    },
    mounted() {
        if (localStorage.token != null) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    }
}
</script>

<style scoped>
.container {
    display: block;
    padding: 16px;
}
h3 {
    text-align: center;
}
</style>