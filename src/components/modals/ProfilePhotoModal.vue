<template>
    <base-modal v-if="shouldShow" :title="title" :section="false">
        <template #actions>
            <modal-buttons>
                <base-button mode="light" @click="dismiss">{{ $t('profile_photo_modal_dismiss_button_text') }}</base-button>
                <base-button @click="didSelectChooseNewPhoto">{{ chooseButtonTitle }}</base-button>
                <base-button v-if="profilePhotoUrl" @click="didSelectDeletePhoto">{{ $t('profile_photo_modal_delete_photo_button_text') }}</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import ModalButtons from "../modals/ModalButtons.vue";

export default {
    components: { ModalButtons },
    props: ["shouldShow", "profilePhotoUrl", "dismiss", "didSelectChooseNewPhoto", "didSelectDeletePhoto"],
    computed: {
        title() {
            return this.profilePhotoUrl == null ? 
                this.$t('profile_photo_modal_upload_photo_title') :
                this.$t('profile_photo_modal_change_profile_photo_title');
        },
        chooseButtonTitle() {
            return this.profilePhotoUrl == null ? 
                this.$t('profile_photo_modal_choose_photo_button_text') :
                this.$t('profile_photo_modal_choose_new_photo_button_text');
        }
    }
}
</script>

<style scoped>
</style>