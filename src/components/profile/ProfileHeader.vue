<template>
    <div class="title-container" v-if="user">
        <div class="title-text-container">
            <profile-photo
                :profilePhotoUrl="profilePhotoUrl"
                :user="passedInUser"
                size="medium"
                :editable="true"
                @change="handleNewProfilePhoto($event)"
                @didDeletePhoto="didDeletePhoto">
            </profile-photo>
            <div>
                <page-title :text="fullName"></page-title>
                <p v-if="loggedInUserIsAdmin" class="badge">{{ adminBadgeText }}</p>
            </div>
        </div>
        <div class="title-buttons-container">
            <base-button v-if="userIsLoggedInUser == false && followStatus != null" @click="toggleFollowingStatus()">{{ toggleFollowButtonText }}</base-button>
            <base-button v-if="loggedInUserIsAdmin" mode="light" @click="toggleAdminStatus()">{{ toggleAdminButtonText }}</base-button>
            <img v-if="loggedInUserIsAdmin || userIsLoggedInUser" class="svg delete-button" src="/delete.svg" @click="showDeleteUserConfirmationModal">
        </div>
    </div>
    <delete-user-confirmation-modal
        :shouldShow="shouldShowDeleteUserConfirmationModal"
        :user="passedInUser"
        :dismiss="dismissDeleteUserConfirmationModal">
    </delete-user-confirmation-modal>
</template>

<script>
import network from '../../network/network.js';
import PageTitle from '../base/PageTitle.vue';
import DeleteUserConfirmationModal from '../modals/DeleteUserConfirmationModal.vue';

export default {
    components: { PageTitle, DeleteUserConfirmationModal },
    props: ['profilePhotoUrl', 'user'],
    emits: ['didUpdateUser', 'didUpdateFollowingStatus'],
    data() {
        return {
            followStatus: null,
            shouldShowDeleteUserConfirmationModal: false
        }
    },
    computed: {
        passedInUser() {
            return this.user
        },
        firstName() {
            return this.user.firstName
        },
        lastName() {
            return this.user.lastName
        },
        fullName() {
            return `${this.firstName} ${this.lastName}`
        },
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        loggedInUserIsAdmin() {
            return localStorage.user().isAdmin;
        },
        adminBadgeText() {
            return this.user.isAdmin ? 'ADMIN' : 'USER';
        },
        isFollowing() {
            if (this.userIsLoggedInUser) { return false; }
            if (this.followStatus == null) { return false; }
            return this.followStatus.loggedInUserIsFollowingOtherUser;
        },
        toggleFollowButtonText() {
            if (this.followStatus == null) { return '' }
            return this.isFollowing ? 'Unfollow' : 'Follow';
        },
        toggleAdminButtonText() {
            return this.user.isAdmin ? 'Revoke Admin Access' : 'Give Admin Access';
        }
    },
    methods: {
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                urlParams: {
                    action: this.isFollowing ? 'unfollow' : 'follow',
                    userId: this.user.id
                },
                onSuccess: () => {
                    this.getFollowStatus()
                    this.$emit('didUpdateFollowingStatus');
                },
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
                    if (this.userIsLoggedInUser) {
                        let updatedUser = localStorage.user();
                        updatedUser.isAdmin = !updatedUser.isAdmin;
                        localStorage.setObject('user', updatedUser);
                        this.$emit('didUpdateUser', updatedUser)
                        this.$router.go()
                    } else {
                        let updatedUser = this.user;
                        updatedUser.isAdmin = !updatedUser.isAdmin;
                        this.$emit('didUpdateUser', updatedUser)
                    }
                },
                onFailure: error => { 
                    alert(error.description); 
                }
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
                    let updatedUser = localStorage.user()
                    updatedUser.profilePhotoUrl = data.url;
                    this.$emit('didUpdateUser', updatedUser);
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        didDeletePhoto() {
            let updatedUser = localStorage.user();
            updatedUser.profilePhotoUrl = null;
            this.$emit('didUpdateUser', updatedUser);
        },
        getFollowStatus() {
            if (this.userIsLoggedInUser) {
                this.followStatus = null;
                return;
            }
            network.getFollowStatus({
                urlParams: {
                    userId: this.user.id
                },
                onSuccess: (followStatus) => {
                    this.followStatus = followStatus;
                },
                onFailure: error => { alert(error.description); }
            });
        },
        showDeleteUserConfirmationModal() {
            this.shouldShowDeleteUserConfirmationModal = true;
        },
        dismissDeleteUserConfirmationModal() {
            this.shouldShowDeleteUserConfirmationModal = false;
        }
    },
    mounted() {
        this.getFollowStatus();
    },
    watch: {
        user() {
            this.getFollowStatus();
        }
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
.badge {
    font-weight: bold;
    color: var(--theme-dark-color);
    margin: 0;
    font-size: var(--default-font-size);
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