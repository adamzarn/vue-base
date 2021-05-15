<template>
    <div class="container">
        <div class="col-6">
            <page-title class="title" text="Admins"></page-title>
            <user-list :users="admins" :refresh="getData" :showToggleAdminButton="true"></user-list>
        </div>
        <div class="col-6">
            <base-input label="Search Users" class="search-bar" v-model="enteredQuery" :onChange="getUsers"></base-input>
            <user-list :users="users" :refresh="getData" :showToggleAdminButton="true"></user-list>
        </div>
    </div>
</template>

<script>
import UserList from '../UserList.vue';
import network from '../../network/network.js';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: {
        UserList,
        PageTitle
    },
    data() {
        return {
            admins: [],
            users: [],
            enteredQuery: ''
        }
    },
    methods: {
        getAdmins() {
            network.searchUsers({
                queryParams: {
                    isAdmin: "yes"
                },
                onSuccess: admins => {
                    let adminIds = admins.map((admin) => {
                        return admin.id;
                    });
                    if (adminIds.includes(localStorage.user().id) == false) {
                        this.$router.push({ name: 'home' });
                    } else {
                        this.admins = admins
                    }
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        getUsers() {
            if (this.enteredQuery === '') {
                this.users = [];
                return
            }
            network.searchUsers({
                queryParams: {
                    query: this.enteredQuery,
                    start: 0,
                    end: 50,
                    isAdmin: "no"
                },
                onSuccess: users => {
                    this.users = users
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        getData() {
            this.getAdmins()
            this.getUsers()
        }
    },
    mounted() {
        if (localStorage.user() != null) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.title {
    margin-bottom: var(--default-spacing);
}
h3 {
    text-align: center;
}
.search-bar {
    margin: var(--default-spacing);
}
@media only screen and (max-width: 768px) {
    .container {
        flex-direction: column;
    }
}
</style>