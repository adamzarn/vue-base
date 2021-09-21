<template>
    <base-modal v-if="shouldShow" title="Change Email">
        <template #default>
            <p>If you change your email, you will be automatically logged out and an email verification link will be sent to your new email. You will be required to verify your new email before you can login again.</p>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">Cancel</base-button>
                <base-button @click="allowEmailUpdate">Continue</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import ModalButtons from '../modals/ModalButtons.vue';

export default {
    components: { ModalButtons },
    props: ['shouldShow', 'allowEmailUpdate', 'dismiss']
}
</script>

<style scoped>
</style>