<template>
    <div class="col-12 profile-page-container">
        <div v-if="user" class="col-8 profile-container">
            <div class="title-container">
                <div class="title-text-container">
                    <div class="image-container" :class="{ clickable: userIsLoggedInUser }" @click="didClickProfilePhoto">
                        <div class="image-placeholder">
                            <p v-if="profilePhotoUrl==null" class="initials">{{ user.firstName[0] + user.lastName[0] }}</p>
                        </div>
                        <img v-if="profilePhotoUrl" class="profile-photo" :src="profilePhotoUrl">
                        <input type="file" id="profile-photo-input" @change="handleProfilePhoto($event)"/>
                    </div>
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
            <base-card v-if="user">
                <profile-item v-if="userIsLoggedInUser" field="firstName" label="First Name" :currentValue="firstName" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['firstName']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
                <profile-item v-if="userIsLoggedInUser" field="lastName" label="Last Name" :currentValue="lastName" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['lastName']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
                <profile-item field="username" label="Username" :currentValue="username" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['username']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
                <profile-item field="email" label="Email" :showSeparator="userIsLoggedInUser" :currentValue="email" :update="updateUser" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['email']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
                <profile-item v-if="userIsLoggedInUser" field="password" label="Password" type="password" :showSeparator="false" :update="changePassword" :editable="userIsLoggedInUser" :beingChanged="changeStatuses['password']" :toggleBeingChanged="toggleBeingChanged"></profile-item>
            </base-card>
            <div v-if="user" class="follows">
                <div class="col-6">
                    <page-title class="title" :text="followersTitle"></page-title>
                    <user-list :users="followers" :refresh="getFollowers" :showToggleFollowButton="false"></user-list>
                </div>
                <div class="col-6">
                    <page-title class="title" :text="followingTitle"></page-title>
                    <user-list :users="following" :refresh="getFollowing" :showToggleFollowButton="userIsLoggedInUser"></user-list>
                </div>
            </div>
        </div>
        <div class="col-4 posts-container">
            <page-title text="Posts"></page-title>
            <post-list :posts="posts"></post-list>
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
    <base-modal v-if="shouldShowProfilePhotoModal" :title="profilePhotoUrl == null ? 'Upload Profile Photo' : 'Change Profile Photo'" :section="false">
        <template #actions>
            <div class="buttons-container">
                <base-button mode="light" @click="shouldShowProfilePhotoModal=false">Cancel</base-button>
                <base-button @click="openFileSelector">{{ profilePhotoUrl == null ? 'Choose Photo' : 'Choose New Photo' }}</base-button>
                <base-button v-if="profilePhotoUrl" @click="deleteProfilePhoto">Delete Photo</base-button>
            </div>
        </template>
    </base-modal>
</template>

<script>
import network from '../../../network/network.js';
import UserList from '../../UserList.vue';
import ProfileItem from '../../base/ProfileItem.vue';
import PageTitle from '../../base/PageTitle.vue';
import PostList from '../../PostList.vue';

export default {
    components: { UserList, ProfileItem, PageTitle, PostList },
    data() {
        return {
            followers: [],
            following: [],
            posts: [],
            user: null,
            loggedInUser: null,
            changeStatuses: {
                'firstName': false,
                'lastName': false,
                'username': false,
                'email': false,
                'password': false
            },
            isFollowing: false,
            shouldShowChangeEmailNotificationModal: false,
            profilePhotoUrl: null,
            shouldShowProfilePhotoModal: false
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
            if (this.loggedInUser == null) { return false; }
            return this.loggedInUser.isAdmin;
        },
        adminBadgeText() {
            if (this.user == null) { return ''; }
            return this.user.isAdmin ? 'ADMIN' : 'USER';
        },
        followersTitle() {
            return "Followers";
        },
        followingTitle() {
            return "Following";
        },
        toggleFollowButtonText() {
            return this.isFollowing ? "Unfollow" : "Follow";
        },
        toggleAdminButtonText() {
            if (this.user == null) { return ''; }
            return this.user.isAdmin ? 'Revoke Admin Access' : 'Give Admin Access';
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
                },
                onFailure: error => { 
                    alert(error.description);
                }
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
                onFailure: error => { 
                    alert(error.description); 
                }
            })
        },
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
                        this.loggedInUser = updatedUser
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
        updateUser(field, value) {
            network.updateUser({
                body: {
                    [field]: value
                },
                onSuccess: (updatedUser) => {
                    if (field === 'email' && updatedUser.isEmailVerified == false) {
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
                    email: email,
                    frontendBaseUrl: `${network.frontendBaseUrl()}/verifyEmail`
                },
                onSuccess: () => {
                    this.logout(email)
                },
                onFailure: error => {
                    this.
                    alert(error.description);
                }
            })
        },
        logout(email) {
            network.logout({
                onSuccess: () => {
                    alert(`You will now be logged out. An email verification email was sent to ${email}.`)
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
            if (field === 'email' && this.changeStatuses['email'] === false) {
                network.getSettings({
                    onSuccess: (settings) => {
                        if (settings.emailVerificationIsRequired) {
                            this.shouldShowChangeEmailNotificationModal = true
                        } else {
                            this.changeStatuses[field] = !this.changeStatuses[field]
                        }
                    }, onFailure: () => {
                        this.changeStatuses[field] = !this.changeStatuses[field]
                    }
                })
            } else {
                this.changeStatuses[field] = !this.changeStatuses[field]
            }
        },
        async getData() {
            this.getFollowers()
            this.getFollowing()
            this.getUser()
            this.getPosts()
        },
        getUser() {
            network.getUser({
                urlParams: {
                    userId: this.$route.params.userId
                },
                onSuccess: user => {
                    this.user = user;
                    this.profilePhotoUrl = this.getUniqueUrl(user.profilePhotoUrl);
                    if (user.id == localStorage.user().id) {
                        this.loggedInUser = user;
                    } else {
                        this.loggedInUser = localStorage.user();
                    }
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        didClickProfilePhoto() {
            if (this.userIsLoggedInUser) {
                this.shouldShowProfilePhotoModal = true;
            }
        },
        openFileSelector() {
            this.shouldShowProfilePhotoModal = false;
            document.getElementById('profile-photo-input').click();
        },
        handleProfilePhoto(event) {
            this.shouldShowProfilePhotoModal = false;
            let file = event.target.files[0];
            if (file) {
                this.uploadProfilePhoto(file)
            }
        },
        uploadProfilePhoto(file) {
            network.uploadProfilePhoto({
                body: {
                    file: file
                },
                onSuccess: (data) => {
                    this.profilePhotoUrl = this.getUniqueUrl(data.url);
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
                    this.profilePhotoUrl = null
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
        getPosts() {
            network.getPosts({
                urlParams: {
                    userId: this.$route.params.userId
                },
                onSuccess: (posts) => {
                    this.posts = posts;
                }, onFailure: error => {
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
.menu-container {
    padding: var(--default-spacing);
}
.profile-page-container {
    display: flex;
}
.profile-container {
    display: flex;
    flex-direction: column;
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.posts-container {
    display: flex;
    flex-direction: column;
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.title-buttons-container {
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
.badge {
    font-weight: bold;
    color: var(--theme-dark-color);
    margin: 0;
}
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
.delete-button {
    cursor: pointer;
    width: calc(var(--default-spacing)*2);
    height: calc(var(--default-spacing)*2);
    filter: invert(9%) sepia(82%) saturate(1981%) hue-rotate(282deg) brightness(89%) contrast(120%);
}
.delete-button:hover {
    filter: invert(7%) sepia(86%) saturate(3809%) hue-rotate(294deg) brightness(109%) contrast(104%);
}
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
.initials {
    font-size: calc(var(--default-font-size)*3);
    font-weight: bold;
    text-align: center;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    margin: 0;
}
@media only screen and (max-width: 768px) {
    .follows {
        flex-direction: column;
    }
    .container, .title-container, .buttons-container {
        flex-direction: column;
        row-gap: var(--default-spacing);
    }
}
img[src=""] {
    display: none;
}
img[src] {
    display: block;
}
.image-container {
    width: 120px;
    height: 120px;
    position: relative;
}
.clickable {
    cursor: pointer;
}
input {
    opacity: 0;
    pointer-events: none;
}
.profile-photo, input, .image-placeholder {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: var(--default-corner-radius);
}
.profile-photo {
    object-fit: cover;
}
.image-placeholder {
    background-color: var(--light-gray-color);
}
@media only screen and (max-width: 480px) {
    .profile-page-container {
        flex-flow: column;
        row-gap: var(--default-spacing);
    }
}
</style>