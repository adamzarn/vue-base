<template>
    <base-modal v-if="shouldShow" :title="title">
        <template #default>
            <p>{{ message }}</p>
        </template>
        <template #actions>
            <modal-buttons>
                <base-button @click="dismiss">OK</base-button>
            </modal-buttons>
        </template>
    </base-modal>
</template>

<script>
import ModalButtons from "./ModalButtons.vue";

export default {
    components: { ModalButtons },
    props: ["shouldShow", "title", "message", "dismiss"]
}
</script>

<style scoped>
</style>