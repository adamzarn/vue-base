<template>
    <base-modal v-if="shouldShow" :title="$t('change_email_modal_title')">
        <template #default>
            <p>{{ $t('change_email_modal_message') }}</p>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">{{ $t('change_email_modal_dismiss_button_text') }}</base-button>
                <base-button @click="allowEmailUpdate">{{ $t('change_email_modal_confirm_button_text') }}</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import ModalButtons from "../modals/ModalButtons.vue";

export default {
    components: { ModalButtons },
    props: ["shouldShow", "allowEmailUpdate", "dismiss"]
}
</script>

<style scoped>
</style>