<template>
    <base-modal v-if="shouldShow" :title="$t('email_verification_modal_title')">
        <template #default>
            <p>{{ $t('email_verification_modal_message') }}</p>
            <base-input
                v-model.trim="email"
            ></base-input>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">{{ $t('email_verification_modal_dismiss_button_text') }}</base-button>
                <base-button @click="sendEmail">{{ $t('email_verification_modal_confirm_button_text') }}</base-button>
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