<template>
    <base-modal v-if="shouldShow" :title="profilePhotoUrl == null ? "Upload Profile Photo" : "Change Profile Photo"" :section="false">
        <template #actions>
            <modal-buttons>
                <base-button mode="light" @click="dismiss">Cancel</base-button>
                <base-button @click="didSelectChooseNewPhoto">{{ profilePhotoUrl == null ? "Choose Photo" : "Choose New Photo" }}</base-button>
                <base-button v-if="profilePhotoUrl" @click="didSelectDeletePhoto">Delete Photo</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import ModalButtons from "../modals/ModalButtons.vue";

export default {
    components: { ModalButtons },
    props: ["shouldShow", "profilePhotoUrl", "dismiss", "didSelectChooseNewPhoto", "didSelectDeletePhoto"]
}
</script>

<style scoped>
</style>