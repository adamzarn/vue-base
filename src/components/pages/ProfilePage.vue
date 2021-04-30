<template>
    <div class="col-12 container">
        <page-title text="Profile"></page-title>
        <base-card>
            <profile-item label="Name" :value="fullName"></profile-item>
            <profile-item label="Email" :value="email"></profile-item>
            <password-profile-item></password-profile-item>
        </base-card>
    </div>
    <div class="container follows">
        <div class="col-6">
            <page-title text="Followers"></page-title>
            <user-list :users="followers" :refresh="getData"></user-list>
        </div>
        <div class="col-6">
            <page-title text="Following"></page-title>
            <user-list :users="following" :refresh="getData"></user-list>
        </div>
    </div>
</template>

<script>
import network from '../../layers/network.js';
import UserList from '../UserList.vue';
import ProfileItem from '../base/ProfileItem.vue';
import PasswordProfileItem from '../base/PasswordProfileItem.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { UserList, ProfileItem, PasswordProfileItem, PageTitle },
    data() {
        return {
            followers: [],
            following: []
        }
    },
    computed: {
        fullName() {
            return localStorage.user().firstName + ' ' + localStorage.user().lastName;
        },
        email() {
            return localStorage.user().email;
        }
    },
    methods: {
        getData() {
            network.getUsersAndFollows({
                onSuccess: users => {
                    this.followers = users.filter(user => {
                        return user.followingYou == true;
                    });
                    this.following = users.filter(user => {
                        return user.following == true;
                    })
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
    padding: 1rem;
}
.follows {
    display: flex;
}
@media only screen and (max-width: 768px) {
    .follows {
        flex-direction: column;
    }
}
</style>