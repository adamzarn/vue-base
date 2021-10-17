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
                <p v-if="loggedInUserIsAdmin" class="badge">{{ badgeText }}</p>
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
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import network from "../../network/network.js";
import "./../../local-storage-helper.js";
import PageTitle from "../base/PageTitle.vue";
import DeleteUserConfirmationModal from "../modals/DeleteUserConfirmationModal.vue";

export default {
    components: { PageTitle, DeleteUserConfirmationModal },
    props: ["profilePhotoUrl", "user"],
    emits: ["didUpdateUser", "didUpdateFollowingStatus"],
    data() {
        return {
            followStatus: null,
            shouldShowDeleteUserConfirmationModal: false,
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: ""
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
        badgeText() {
            return this.user.isAdmin ?
                this.$t('profile_header_admin_badge_text') :
                this.$t('profile_header_user_badge_text');
        },
        isFollowing() {
            if (this.userIsLoggedInUser) { return false; }
            if (this.followStatus == null) { return false; }
            return this.followStatus.loggedInUserIsFollowingOtherUser;
        },
        toggleFollowButtonText() {
            if (this.followStatus == null) { return "" }
            return this.isFollowing ?
                this.$t('profile_header_unfollow_button_text') :
                this.$t('profile_header_follow_button_text');
        },
        toggleAdminButtonText() {
            return this.user.isAdmin ?
                this.$t('profile_header_revoke_admin_access') :
                this.$t('profile_header_give_admin_access');
        },
        toggleFollowErrorMessage() {
            return this.isFollowing ?
                this.$t('profile_header_unfollowing_error_message', { 'name': this.user.firstName }) :
                this.$t('profile_header_following_error_message', { 'name': this.user.firstName });
        },
        toggleAdminErrorMessage() {
            return this.$t('profile_header_toggle_admin_error_message', { 'possessiveName': this.possessiveFirstName });
        },
        possessiveFirstName() {
            let lastChar = this.user.firstName[this.user.firstName.length - 1];
            return lastChar == "s" ?
                this.$t('possessive_name_ending_with_s', { 'name': this.user.firstName }) :
                this.$t('possessive_name', { 'name': this.user.firstName })
        }
    },
    methods: {
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                urlParams: {
                    action: this.isFollowing ? "unfollow" : "follow",
                    userId: this.user.id
                },
                onSuccess: () => {
                    this.getFollowStatus()
                    this.$emit("didUpdateFollowingStatus");
                },
                onFailure: () => {
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.toggleFollowErrorMessage;
                    this.shouldShowAlertModal = true;
                }
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
                        localStorage.setUser(updatedUser);
                        this.$emit("didUpdateUser", updatedUser)
                        this.$router.go()
                    } else {
                        let updatedUser = this.user;
                        updatedUser.isAdmin = !updatedUser.isAdmin;
                        this.$emit("didUpdateUser", updatedUser)
                    }
                },
                onFailure: () => { 
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.toggleAdminErrorMessage;
                    this.shouldShowAlertModal = true;
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
                    this.$emit("didUpdateUser", updatedUser);
                },
                onFailure: () => {
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.$t('profile_header_upload_photo_error_message');
                    this.shouldShowAlertModal = true;
                }
            })
        },
        didDeletePhoto() {
            let updatedUser = localStorage.user();
            updatedUser.profilePhotoUrl = null;
            this.$emit("didUpdateUser", updatedUser);
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
                onFailure: () => {
                    this.followStatus = null;
                }
            });
        },
        showDeleteUserConfirmationModal() {
            this.shouldShowDeleteUserConfirmationModal = true;
        },
        dismissDeleteUserConfirmationModal() {
            this.shouldShowDeleteUserConfirmationModal = false;
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
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