<template>
    <base-modal v-if="shouldShow" :title="profilePhotoUrl == null ? 'Upload Profile Photo' : 'Change Profile Photo'" :section="false">
        <template #actions>
            <div class="buttons-container">
                <base-button mode="light" @click="dismiss">Cancel</base-button>
                <base-button @click="didSelectChooseNewPhoto">{{ profilePhotoUrl == null ? 'Choose Photo' : 'Choose New Photo' }}</base-button>
                <base-button v-if="profilePhotoUrl" @click="didSelectDeletePhoto">Delete Photo</base-button>
            </div>
        </template>
    </base-modal>
</template>

<script>
export default {
    props: ['shouldShow', 'profilePhotoUrl', 'dismiss', 'didSelectChooseNewPhoto', 'didSelectDeletePhoto']
}
</script>

<style scoped>
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
</style>