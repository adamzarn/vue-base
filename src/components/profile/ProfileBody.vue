<template>
    <base-card v-if="user">
        <profile-item v-if="userIsLoggedInUser" 
            field="firstName" :label="$t('profile_body_first_name_input_label')"
            :currentValue="firstName" :update="updateUser" :editable="userIsLoggedInUser" 
            :beingChanged="changeStatuses['firstName']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item v-if="userIsLoggedInUser"
            field="lastName" :label="$t('profile_body_last_name_input_label')"
            :currentValue="lastName" :update="updateUser" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['lastName']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item
            field="username" :label="$t('profile_body_username_input_label')"
            :currentValue="username" :update="updateUser" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['username']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item
            field="email" :label="$t('profile_body_email_input_label')"
            :showSeparator="userIsLoggedInUser" :currentValue="email" :update="updateUser" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['email']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
        <profile-item v-if="userIsLoggedInUser"
            field="password" :label="$t('profile_body_password_input_label')" type="password"
            :showSeparator="false" :update="changePassword" :editable="userIsLoggedInUser"
            :beingChanged="changeStatuses['password']" :toggleBeingChanged="toggleBeingChanged">
        </profile-item>
    </base-card>
    <change-email-modal
        :shouldShow="shouldShowChangeEmailNotificationModal"
        :allowEmailUpdate="allowEmailUpdate"
        :dismiss="dismissChangeEmailNotificationModal">
    </change-email-modal>
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import network from "../../network/network.js";
import exceptions from "../../network/exceptions.js";
import "./../../local-storage-helper.js";
import ProfileItem from "../base/ProfileItem.vue";
import ChangeEmailModal from "../modals/ChangeEmailModal.vue";

export default {
    components: { ProfileItem, ChangeEmailModal },
    props: ["user", "refresh"],
    data() {
        return {
            shouldShowChangeEmailNotificationModal: false,
            changeStatuses: {
                "firstName": false,
                "lastName": false,
                "username": false,
                "email": false,
                "password": false
            },
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: "",
            shouldNavigateBackToLogin: false
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        firstName() {
            return this.user.firstName;
        },
        lastName() {
            return this.user.lastName;
        },
        username() {
            return this.user.username;
        },
        email() {
            return this.user.email;
        }
    },
    methods: {
        updateUser(field, value) {
            network.updateUser({
                body: {
                    [field]: value
                },
                onSuccess: (updatedUser) => {
                    if (field === "email" && updatedUser.isEmailVerified == false) {
                        this.sendEmailVerificationEmail(value)
                    } else {
                        this.changeStatuses[field] = false;
                        this.refresh();
                    }
                },
                onFailure: error => {
                    this.changeStatuses[field] = false;
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.$t('profile_body_update_profile_error_message');
                    if (error.exception == exceptions.userAlreadyExists) {
                        this.alertMessage = this.$t('profile_body_email_taken_error_message');
                    }
                    this.shouldNavigateBackToLogin = false;
                    this.shouldShowAlertModal = true;
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
                onFailure: () => {
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.$t('profile_body_email_verification_error_message');
                    this.shouldNavigateBackToLogin = false;
                    this.shouldShowAlertModal = true;
                }
            })
        },
        logout(email) {
            network.logout({
                onSuccess: () => {
                    this.alertTitle = this.$t('alert_generic_success_title');
                    this.alertMessage = this.$t('profile_body_email_verification_message', { 'email': email });
                    this.shouldNavigateBackToLogin = true;
                    this.shouldShowAlertModal = true;
                },
                onFailure: () => {
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.$t('profile_body_logout_error_message');
                    this.shouldNavigateBackToLogin = false;
                    this.shouldShowAlertModal = true;
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
                    this.alertTitle = this.$t('alert_generic_success_title');
                    this.alertMessage = this.$t('profile_body_change_password_success_message');
                    this.shouldNavigateBackToLogin = false;
                    this.shouldShowAlertModal = true;
                    this.passwordBeingChanged = false;
                    this.refresh()
                },
                onFailure: () => {
                    this.changeStatuses[field] = false;
                    this.alertTitle = this.$t('alert_generic_error_title');
                    this.alertMessage = this.$t('profile_body_change_password_error_message');
                    this.shouldNavigateBackToLogin = false;
                    this.shouldShowAlertModal = true;
                }
            })
        },
        toggleBeingChanged(field) {
            if (field === "email" && this.changeStatuses["email"] === false) {
                // Check if email verification is required before allowing email change
                network.getSettings({
                    onSuccess: (settings) => {
                        if (settings.emailVerificationIsRequired) {
                            this.shouldShowChangeEmailNotificationModal = true
                        } else {
                            this.toggleChangeStatus(field);
                        }
                    }, onFailure: () => {
                        this.toggleChangeStatus(field);
                    }
                })
            } else {
                this.toggleChangeStatus(field);
            }
        },
        toggleChangeStatus(field) {
            this.changeStatuses[field] = !this.changeStatuses[field];
        },
        dismissChangeEmailNotificationModal() {
            this.shouldShowChangeEmailNotificationModal = false
        },
        allowEmailUpdate() {
            this.shouldShowChangeEmailNotificationModal = false
            this.changeStatuses["email"] = true
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
            if (this.shouldNavigateBackToLogin) {
                this.$router.push({ name: "login" });
            }
        }
    }
}
</script>