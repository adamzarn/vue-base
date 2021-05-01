<template>
    <div class="container">
        <page-title class="title" text="Users"></page-title>
        <user-list :users="users" :refresh="getData" :showFollowButton="true"></user-list>
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
        },
        userId() {
            return localStorage.user().id;
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
                userId: this.userId,
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
        if (localStorage.token != null && this.userId != null) {
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
.title {
    margin-bottom: var(--default-spacing);
}
h3 {
    text-align: center;
}
</style>