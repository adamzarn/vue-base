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
            <user-list :users="followers" :refresh="getFollowers" :showToggleFollowButton="false"></user-list>
        </div>
        <div class="col-6">
            <page-title class="title" text="Following"></page-title>
            <user-list :users="following" :refresh="getFollowing" :showToggleFollowButton="isYou"></user-list>
        </div>
    </div>
</template>

<script>
import network from '../../network/network.js';
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
            return this.user.id == localStorage.user().id;
        }
    },
    methods: {
        getFollowers() {
            network.getFollows({
                urlParams: {
                    userId: this.$route.params.userId,
                    followType: "followers"
                },
                onSuccess: users => { 
                    this.followers = users
                },
                onFailure: error => { alert(error.description) }
            })
        },
        getFollowing() {
            network.getFollows({
                urlParams: {
                    userId: this.$route.params.userId,
                    followType: "following"
                },
                onSuccess: users => {
                    this.following = users.map((user) => {
                        let updatedUser = user
                        user.following = true
                        return updatedUser
                    })
                },
                onFailure: error => { alert(error.description) }
            })
        },
        deleteUser() {
            network.deleteUser({
                urlParams: {
                    userId: this.user.id
                },
                onSuccess: () => {
                    if (this.isYou) {
                        localStorage.clear();
                        this.$router.push({ name: 'login' });
                    } else {
                        this.$router.push({ name: 'home' });
                    }
                },
                onFailure: error => { alert(error.description) }
            });
        },
        updateUser(field, value) {
            network.updateUser({
                body: {
                    [field]: value
                },
                onSuccess: () => {
                    this.changeStatuses[field] = false;
                    this.getData();
                },
                onFailure: error => {
                    this.changeStatuses[field] = false;
                    alert(error.description);
                }
            })
        },
        changePassword(field, value) {
            network.resetPassword({
                urlParams: {
                    tokenId: localStorage.tokenId,
                },
                body: {
                    [field]: value
                },
                onSuccess: () => {
                    alert("Your password was changed successfully!")
                    this.passwordBeingChanged = false
                    this.getUser()
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        toggleBeingChanged(field) {
            this.changeStatuses[field] = !this.changeStatuses[field]
        },
        getData() {
            this.getFollowers()
            this.getFollowing()
            this.getUser()
        },
        getUser() {
            network.getUser({
                urlParams: {
                    userId: this.$route.params.userId
                },
                onSuccess: user => {
                    this.user = user;
                    if (user.id == localStorage.user().id) {
                        this.user.you = true;
                    }
                },
                onFailure: error => {
                    alert(error.description);
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
    },
    watch: {
        $route(to) {
            if (localStorage.token != null && to.name == "profile") {
                this.getData();
            }
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