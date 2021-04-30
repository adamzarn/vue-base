<template>
    <div class="container">
        <page-title text="Users"></page-title>
        <user-list :users="users" :refresh="getData"></user-list>
    </div>
</template>

<script>
import UserList from '../UserList.vue';
import network from '../../layers/network.js';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: {
        UserList,
        PageTitle
    },
    computed: {
        fullName() {
            return localStorage.user().firstName + ' ' + localStorage.user().lastName;
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
    padding: var(--default-spacing);
}
h3 {
    text-align: center;
}
</style>