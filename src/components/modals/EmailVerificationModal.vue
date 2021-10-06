<template>
    <base-modal v-if="shouldShow" title="Verify Email">
        <template #default>
            <p>You must verify your email to login. Follow the link from the email we sent you at registration or when you changed your email, or enter your email and we'll send you a new email verification email.</p>
            <base-input
                v-model.trim="email"
            ></base-input>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">Cancel</base-button>
                <base-button @click="sendEmail">Send</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import network from "../../network/network.js";
import ModalButtons from "../modals/ModalButtons.vue";

export default {
    components: { ModalButtons },
    props: ["shouldShow", "modelValue", "dismiss", "onSuccess", "onFailure"],
    computed: {
        email() {
            return this.modelValue;
        }
    },
    methods: {
        sendEmail() {
            this.dismiss()
            network.sendEmailVerificationEmail({
                body: {
                    email: this.email,
                    frontendBaseUrl: `${network.frontendBaseUrl()}/verifyEmail`
                },
                onSuccess: () => {
                    this.onSuccess(this.email);
                },
                onFailure: error => {
                    this.onFailure(error);
                }
            })
        },
    }
}
</script>

<style scoped>
</style>