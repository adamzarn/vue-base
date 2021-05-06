<template>
    <div class="col-12 container">
        <div class="title-container">
            <page-title text="Profile"></page-title>
            <img class="svg delete-button" src="/delete.svg" @click="deleteUser()">
        </div>
        <base-card v-if="user">
            <profile-item label="Email" :currentValue="email" :editable="false"></profile-item>
            <profile-item field="firstName" label="First Name" :currentValue="firstName" :update="updateUser" :editable="isYou" :beingChanged="changeStatuses['firstName']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item field="lastName" label="Last Name" :currentValue="lastName" :update="updateUser" :editable="isYou" :beingChanged="changeStatuses['lastName']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item field="username" label="Username" :currentValue="username" :update="updateUser" :editable="isYou" :beingChanged="changeStatuses['username']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item v-if="isYou" field="password" label="Password" type="password" :showSeparator="false" :update="changePassword" :editable="isYou" :beingChanged="changeStatuses['password']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
        </base-card>
    </div>
    <div class="container follows">
        <div class="col-6">
            <page-title class="title" text="Followers"></page-title>
            <user-list :users="followers" :refresh="getData" :showFollowButton="isYou"></user-list>
        </div>
        <div class="col-6">
            <page-title class="title" text="Following"></page-title>
            <user-list :users="following" :refresh="getData" :showFollowButton="isYou"></user-list>
        </div>
    </div>
</template>

<script>
import network from '../../layers/network.js';
import UserList from '../UserList.vue';
import ProfileItem from '../base/ProfileItem.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { UserList, ProfileItem, PageTitle },
    data() {
        return {
            followers: [],
            following: [],
            user: null,
            changeStatuses: {
                'firstName': false,
                'lastName': false,
                'username': false,
                'password': false
            }
        }
    },
    computed: {
        email() {
            if (this.user == null) { return ''; }
            return this.user.email;
        },
        firstName() {
            if (this.user == null) { return ''; }
            return this.user.firstName
        },
        lastName() {
            if (this.user == null) { return ''; }
            return this.user.lastName
        },
        username() {
            if (this.user == null) { return ''; }
            return this.user.username;
        },
        isYou() {
            if (this.user == null) { return false; }
            return this.user.you;
        }
    },
    methods: {
        getData() {
            network.getUsersAndFollows({
                userId: this.$route.params.userId,
                onSuccess: users => {
                    this.followers = users.filter(user => {
                        return user.followingYou == true;
                    });
                    this.following = users.filter(user => {
                        return user.following == true;
                    })
                    var matchingUsers = users.filter(user => {
                        return user.id == this.$route.params.userId
                    })
                    if (matchingUsers.length > 0) {
                        this.user = matchingUsers[0];
                    }
                },
                onFailure: error => {
                    alert(error);
                }
            })
        },
        deleteUser() {
            network.deleteUser({
                userId: this.user.id,
                onSuccess: () => {
                    if (this.isYou) {
                        localStorage.clear();
                        this.$router.push({ name: 'login' });
                    } else {
                        this.$router.push({ name: 'home' });
                    }
                },
                onFailure: error => { alert(error) }
            });
        },
        updateUser(field, value) {
            network.updateUser({
                [field]: value,
                onSuccess: () => {
                    this.changeStatuses[field] = false;
                    this.getData();
                },
                onFailure: error => {
                    this.changeStatuses[field] = false;
                    alert(error);
                }
            })
        },
        changePassword(field, value) {
            network.resetPassword({
                [field]: value,
                tokenId: localStorage.tokenId,
                onSuccess: () => {
                    alert("Your password was changed successfully!")
                    this.passwordBeingChanged = false
                    this.getData();
                },
                onFailure: error => {
                    alert(error);
                }
            })
        },
        toggleBeingChanged(field) {
            this.changeStatuses[field] = !this.changeStatuses[field]
        }
    },
    mounted() {
        if (localStorage.token != null) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    watch: {
        $route() {
            this.getData();
        }
    } 
}
</script>

<style scoped>
.container {
    padding: var(--default-spacing);
}
.follows {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
}
.title {
    margin-bottom: var(--default-spacing);
}
.title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--default-spacing);
}
.delete-button {
    cursor: pointer;
    width: calc(var(--default-spacing)*2);
    height: calc(var(--default-spacing)*2);
    filter: invert(9%) sepia(82%) saturate(1981%) hue-rotate(282deg) brightness(89%) contrast(120%);
}
.delete-button:hover {
    filter: invert(7%) sepia(86%) saturate(3809%) hue-rotate(294deg) brightness(109%) contrast(104%);
}
@media only screen and (max-width: 768px) {
    .follows {
        flex-direction: column;
    }
}
</style>