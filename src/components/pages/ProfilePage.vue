<template>
    <div class="col-12 container">
        <div class="title-container">
            <page-title :text="fullName"></page-title>
            <div class="buttons-container">
                <base-button v-if="userIsLoggedInUser == false" @click="toggleFollowingStatus()">{{ toggleFollowButtonText }}</base-button>
                <base-button v-if="loggedInUserIsAdmin" mode="light" @click="toggleAdminStatus()">{{ toggleAdminButtonText }}</base-button>
                <img v-if="loggedInUserIsAdmin || userIsLoggedInUser" class="svg delete-button" src="/delete.svg" @click="deleteUser()">
            </div>
        </div>
        <base-card v-if="user">
            <profile-item v-if="userIsLoggedInUser" field="firstName" label="First Name" :currentValue="firstName" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['firstName']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item v-if="userIsLoggedInUser" field="lastName" label="Last Name" :currentValue="lastName" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['lastName']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item field="username" label="Username" :currentValue="username" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['username']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item field="email" label="Email" :currentValue="email" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['email']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            <profile-item v-if="userIsLoggedInUser" field="password" label="Password" type="password" :showSeparator="false" :update="changePassword" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['password']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
        </base-card>
    </div>
    <div class="container follows">
        <div class="col-6">
            <page-title class="title" :text="followersTitle"></page-title>
            <user-list :users="followers" :refresh="getFollowers" :showToggleFollowButton="false"></user-list>
        </div>
        <div class="col-6">
            <page-title class="title" :text="followingTitle"></page-title>
            <user-list :users="following" :refresh="getFollowing" :showToggleFollowButton="userIsLoggedInUser"></user-list>
        </div>
    </div>
    <base-modal v-if="shouldShowChangeEmailNotificationModal" title="Change Email">
        <template #default>
            <p>If you change your email, you will be automatically logged out and an email verification link will be sent to your new email. You will be required to verify your new email before you can login again.</p>
        </template>
        <template #actions>
            <div class="buttons-container">
                <base-button @click="dismissChangeEmailNotificationModal">Cancel</base-button>
                <base-button @click="allowEmailUpdate">Continue</base-button>
            </div>
        </template>
    </base-modal>
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
                'email': false,
                'password': false
            },
            toggleFollowButtonText: '',
            toggleAdminButtonText: '',
            isFollowing: false,
            shouldShowChangeEmailNotificationModal: false
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
        fullName() {
            return `${this.firstName} ${this.lastName}`
        },
        username() {
            if (this.user == null) { return ''; }
            return this.user.username;
        },
        userIsLoggedInUser() {
            if (this.user == null) { return false; }
            return this.user.id == localStorage.user().id;
        },
        loggedInUserIsAdmin() {
            if (localStorage.user() == null) { return false; }
            return localStorage.user().isAdmin;
        },
        followersTitle() {
            return this.userIsLoggedInUser ? "Following You" : `Following ${this.firstName}`
        },
        followingTitle() {
            return this.userIsLoggedInUser ? "You're Following" : `${this.firstName}'s Following`
        }
    },
    methods: {
        async getFollowers() {
            network.getFollows({
                urlParams: {
                    userId: this.$route.params.userId,
                    followType: "followers"
                },
                onSuccess: users => { 
                    this.followers = users
                    this.isFollowing = this.followers.filter((follower) => { 
                        return follower.id == localStorage.user().id
                    }).length > 0
                    this.toggleFollowButtonText = this.isFollowing ? "Unfollow" : "Follow"
                },
                onFailure: error => { alert(error.description) }
            })
        },
        async getFollowing() {
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
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                urlParams: {
                    userId: localStorage.user().id
                },
                body: {
                    otherUserId: this.user.id,
                    follow: !this.isFollowing
                },
                onSuccess: this.getData,
                onFailure: error => { alert(error.description) }
            })
        },
        toggleAdminStatus() {
            network.toggleAdminStatus({
                urlParams: {
                    userId: this.user.id
                },
                body: {
                    loggedInUserIsAdmin: !this.user.loggedInUserIsAdmin
                },
                onSuccess: () => {
                    if (this.user.id == localStorage.user().id) {
                        let updatedUser = localStorage.user();
                        updatedUser.loggedInUserIsAdmin = !updatedUser.loggedInUserIsAdmin;
                        localStorage.setObject('user', updatedUser);
                    }
                    this.getData()
                },
                onFailure: error => { alert(error.description) }
            });
        },
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
                onFailure: error => { alert(error.description) }
            });
        },
        updateUser(field, value) {
            network.updateUser({
                body: {
                    [field]: value
                },
                onSuccess: () => {
                    if (field === 'email' && network.requireEmailVerification) {
                        this.sendEmailVerificationEmail(value)
                    } else {
                        this.changeStatuses[field] = false;
                        this.getUser();
                    }
                },
                onFailure: error => {
                    this.changeStatuses[field] = false;
                    alert(error.description);
                }
            })
        },
        sendEmailVerificationEmail(email) {
            network.sendEmailVerificationEmail({
                body: {
                    email: '',
                    password: '',
                    frontendBaseUrl: `${network.frontendBaseUrl()}/verifyEmail`
                },
                onSuccess: () => {
                    this.logout(email)
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        logout(email) {
            network.logout({
                onSuccess: () => {
                    alert(`You will now be logged out and an email verification email was sent to ${email}.`)
                    this.$router.push({ name: 'login' });
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        dismissChangeEmailNotificationModal() {
            this.shouldShowChangeEmailNotificationModal = false
        },
        allowEmailUpdate() {
            this.shouldShowChangeEmailNotificationModal = false
            this.changeStatuses['email'] = true
        },
        changePassword(field, value) {
            network.resetPassword({
                urlParams: {
                    tokenId: localStorage.tokenId,
                },
                body: {
                    value: value
                },
                onSuccess: () => {
                    this.changeStatuses[field] = false;
                    alert("Your password was changed successfully!")
                    this.passwordBeingChanged = false
                    this.getUser()
                },
                onFailure: error => {
                    this.changeStatuses[field] = false;
                    alert(error.description);
                }
            })
        },
        toggleBeingChanged(field) {
            if (field === 'email' && this.changeStatuses['email'] === false && network.requireEmailVerification) {
                this.shouldShowChangeEmailNotificationModal = true
            } else {
                this.changeStatuses[field] = !this.changeStatuses[field]
            }
        },
        async getData() {
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
                    this.toggleAdminButtonText = user.loggedInUserIsAdmin ? 'Revoke Admin Access' : 'Give Admin Access'
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
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
    align-items: center;
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
    .title-container, .buttons-container {
        flex-direction: column;
        row-gap: var(--default-spacing);
    }
}
</style>