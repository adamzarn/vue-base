<template>
    <base-modal v-if="shouldShow" :title="$t('password_reset_modal_title')">
        <template #default>
            <p>{{ $t('password_reset_modal_message') }}</p>
            <base-input
                v-model.trim="email"
            ></base-input>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">{{ $t('passsword_reset_modal_dismiss_button_text') }}</base-button>
                <base-button @click="sendEmail">{{ $t('password_reset_modal_confirm_button_text') }}</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import network from "../../network/network.js";
import ModalButtons from "./ModalButtons.vue";

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