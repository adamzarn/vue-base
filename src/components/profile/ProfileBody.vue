<template>
    <base-card v-if="user">
        <profile-item v-if="userIsLoggedInUser" 
            field="firstName" label="First Name" 
            :currentValue="firstName" :update="updateUser" :editable="userIsLoggedInUser" 
            :beingChanged="changeStatuses['firstName']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item v-if="userIsLoggedInUser"
            field="lastName" label="Last Name"
            :currentValue="lastName" :update="updateUser" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['lastName']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item
            field="username" label="Username"
            :currentValue="username" :update="updateUser" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['username']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item
            field="email" label="Email"
            :showSeparator="userIsLoggedInUser" :currentValue="email" :update="updateUser" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['email']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item v-if="userIsLoggedInUser"
            field="password" label="Password" type="password"
            :showSeparator="false" :update="changePassword" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['password']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
    </base-card>
    <change-email-modal
        :shouldShow="shouldShowChangeEmailNotificationModal"
        :allowEmailUpdate="allowEmailUpdate"
        :dismiss="dismissChangeEmailNotificationModal">
    </change-email-modal>
</template>

<script>
import network from '../../network/network.js';
import ProfileItem from '../base/ProfileItem.vue';
import ChangeEmailModal from '../modals/ChangeEmailModal.vue';

export default {
    components: { ProfileItem, ChangeEmailModal },
    props: ['user', 'refresh'],
    data() {
        return {
            shouldShowChangeEmailNotificationModal: false,
            changeStatuses: {
                'firstName': false,
                'lastName': false,
                'username': false,
                'email': false,
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
        }
    },
    methods: {
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
                        this.refresh();
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
                    this.refresh()
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
        dismissChangeEmailNotificationModal() {
            this.shouldShowChangeEmailNotificationModal = false
        },
        allowEmailUpdate() {
            this.shouldShowChangeEmailNotificationModal = false
            this.changeStatuses['email'] = true
        },
    }
}
</script>

<style scoped>
</style>