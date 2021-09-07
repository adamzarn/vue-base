<template>
    <base-modal v-if="shouldShow" title="Change Email">
        <template #default>
            <p>If you change your email, you will be automatically logged out and an email verification link will be sent to your new email. You will be required to verify your new email before you can login again.</p>
        </template>
        <template #actions>
            <div class="buttons-container">
                <base-button @click="dismiss">Cancel</base-button>
                <base-button @click="allowEmailUpdate">Continue</base-button>
            </div>
        </template>
    </base-modal>
</template>

<script>
export default {
    props: ['shouldShow', 'allowEmailUpdate', 'dismiss']
}
</script>

<style scoped>
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
</style>