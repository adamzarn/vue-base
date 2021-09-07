<template>
    <div class="title-container">
        <div class="title-text-container">
            <profile-photo
                :profilePhotoUrl="profilePhotoUrl"
                :user="user"
                size="medium"
                :editable="true"
                :deleteProfilePhoto="deleteProfilePhoto"
                @change="handleNewProfilePhoto($event)">
            </profile-photo>
            <div>
                <page-title :text="fullName"></page-title>
                <p v-if="loggedInUserIsAdmin" class="badge">{{ adminBadgeText }}</p>
            </div>
        </div>
        <div class="title-buttons-container">
            <base-button v-if="userIsLoggedInUser == false" @click="toggleFollowingStatus()">{{ toggleFollowButtonText }}</base-button>
            <base-button v-if="loggedInUserIsAdmin" mode="light" @click="toggleAdminStatus()">{{ toggleAdminButtonText }}</base-button>
            <img v-if="loggedInUserIsAdmin || userIsLoggedInUser" class="svg delete-button" src="/delete.svg" @click="deleteUser()">
        </div>
    </div>
</template>

<script>
import network from '../../network/network.js';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { PageTitle },
    props: ['profilePhotoUrl', 'passedInUser', 'loggedInUser'],
    emits: ['change'],
    computed: {
        user() {
            return this.passedInUser
        },
        firstName() {
            if (this.passedInUser == null) { return ''; }
            return this.passedInUser.firstName
        },
        lastName() {
            if (this.passedInUser == null) { return ''; }
            return this.passedInUser.lastName
        },
        fullName() {
            return `${this.firstName} ${this.lastName}`
        },
        userIsLoggedInUser() {
            if (this.passedInUser == null) { return false; }
            return this.passedInUser.id == localStorage.user().id;
        },
        loggedInUserIsAdmin() {
            if (this.loggedInUser == null) { return false; }
            return this.loggedInUser.isAdmin;
        },
        adminBadgeText() {
            if (this.passedInUser == null) { return ''; }
            return this.passedInUser.isAdmin ? 'ADMIN' : 'USER';
        },
        toggleFollowButtonText() {
            return this.isFollowing ? "Unfollow" : "Follow";
        },
        toggleAdminButtonText() {
            if (this.passedInUser == null) { return ''; }
            return this.passedInUser.isAdmin ? 'Revoke Admin Access' : 'Give Admin Access';
        }
    },
    methods: {
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                urlParams: {
                    action: this.isFollowing ? 'unfollow' : 'follow',
                    userId: this.user.id
                },
                onSuccess: this.getData,
                onFailure: error => { alert(error.description); }
            })
        },
        toggleAdminStatus() {
            network.updateUser({
                urlParams: {
                    userId: this.user.id
                },
                body: {
                    isAdmin: !this.user.isAdmin
                },
                onSuccess: () => {
                    if (this.user.id == this.loggedInUser.id) {
                        let updatedUser = this.loggedInUser;
                        updatedUser.isAdmin = !updatedUser.isAdmin;
                        localStorage.setObject('user', updatedUser);
                        this.$emit('change', updatedUser)
                        this.$router.go()
                    } else {
                        this.user.isAdmin = !this.user.isAdmin
                    }
                },
                onFailure: error => { 
                    alert(error.description); 
                }
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
                onFailure: error => { alert(error.description); }
            });
        },
        handleNewProfilePhoto(event) {
            this.shouldShowProfilePhotoModal = false;
            let file = event.target.files[0];
            if (file) {
                this.uploadNewProfilePhoto(file)
            }
        },
        uploadNewProfilePhoto(file) {
            network.uploadProfilePhoto({
                body: {
                    file: file
                },
                onSuccess: (data) => {
                    localStorage.user().profilePhotoUrl = this.getUniqueUrl(data.url);
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        deleteProfilePhoto() {
            this.shouldShowProfilePhotoModal = false;
            network.deleteProfilePhoto({
                onSuccess: () => {
                    localStorage.user().profilePhotoUrl = null
                }, onFailure: error => {
                    alert(error.description);
                }
            })
        },
        getUniqueUrl(url) {
            if (url) {
                return `${url}#${new Date().getTime()}`
            } else {
                return null;
            }
        },
    }
}
</script>

<style scoped>
.title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.title-text-container {
    display: flex;
    align-items: center;
    column-gap: var(--default-spacing);
}
.title-buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
    align-items: center;
}
.title {
    margin-bottom: var(--default-spacing);
}
.badge {
    font-weight: bold;
    color: var(--theme-dark-color);
    margin: 0;
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
</style>