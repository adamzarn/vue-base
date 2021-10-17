<template>
    <base-modal v-if="shouldShow" :title="$t('delete_user_confirmation_modal_title')">
        <template #default>
            <p>{{ message }}</p>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">{{ $t('delete_user_confirmation_modal_dismiss_button_text') }}</base-button>
                <base-button @click="deleteUser">{{ $t('delete_user_confirmation_modal_confirm_button_text') }}</base-button>
            </modal-buttons>
        </template>
    </base-modal>
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
import ModalButtons from "../modals/ModalButtons.vue";

export default {
    components: { ModalButtons },
    props: ["shouldShow", "user", "dismiss"],
    data() {
        return {
            shouldShowAlertModal: false,
            alertTitle: "",
            alertMessage: ""
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        fullName() {
            return `${this.user.firstName} ${this.user.lastName}`
        },
        possessiveFullName() {
            let lastChar = this.user.lastName[this.user.lastName.length - 1];
            return lastChar == "s" ?
                this.$t('possessive_name_ending_with_s', { 'name': this.fullName }) :
                this.$t('possessive_name', { 'name': this.fullName })
        },
        account() {
            if (this.userIsLoggedInUser) {
                return this.$t('delete_user_confirmation_modal_your_account');
            } else {
                return this.$t('delete_user_confirmation_modal_other_account', { 'possessiveFullName': this.possessiveFullName });
            }
        },
        message() {
            if (this.userIsLoggedInUser) {
                return this.$t('delete_user_confirmation_modal_delete_self_message', { 'account': this.account });
            } else {
                return this.$t('delete_user_confirmation_modal_delete_other_message', { 'account': this.account });
            }
        }
    },
    methods: {
        deleteUser() {
            this.dismiss();
            network.deleteUser({
                urlParams: {
                    userId: this.user.id
                },
                onSuccess: () => {
                    if (this.userIsLoggedInUser) {
                        localStorage.clear();
                        this.$router.push({ name: "login" });
                    } else {
                        this.$router.push({ name: "home" });
                    }
                },
                onFailure: error => { 
                    this.alertTitle = this.$t('alert_generic_error_title');
                    if (error.status === 401) {
                        this.alertMessage = this.$t('delete_user_confirmation_modal_auth_error_message');
                    } else  {
                        this.alertMessage = this.$t('delete_user_confirmation_modal_error_message');
                    }
                    this.shouldShowAlertModal = true;
                }
            });
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        }
    }
}
</script>

<style scoped>
</style>