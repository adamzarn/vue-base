<template>
    <base-modal v-if="shouldShow" title="Password Reset">
        <template #default>
            <p>Enter your email and we'll send you a password reset link.</p>
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
    props: ["shouldShow", "modelValue", "dismiss", "onSuccess", "onFailure", "didUpdateEmail"],
    data() {
        return {
            email: this.modelValue
        }
    },
    watch: {
        email() {
            this.didUpdateEmail(this.email);
        },
        modelValue() {
            this.email = this.modelValue;
        }
    },
    methods: {
        sendEmail() {
            this.dismiss();
            network.sendPasswordResetEmail({
                body: {
                    email: this.email,
                    frontendBaseUrl: `${network.frontendBaseUrl()}/resetPassword`
                },
                onSuccess: () => {
                    this.onSuccess(this.email);
                },
                onFailure: error => {
                    this.onFailure(error);
                }
            })
        }
    }
}
</script>

<style scoped>
</style>