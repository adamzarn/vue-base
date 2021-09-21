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
import ModalButtons from '../modals/ModalButtons.vue';

export default {
    components: { ModalButtons },
    props: ['shouldShow', 'modelValue', 'dismiss', 'sendEmail'],
    computed: {
        email() {
            return this.modelValue;
        }
    }
}
</script>

<style scoped>
</style>