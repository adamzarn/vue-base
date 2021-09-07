<template>
    <base-modal v-if="shouldShow" title="Verify Email">
        <template #default>
            <p>You must verify your email to login. Follow the link from the email we sent you at registration or when you changed your email, or enter your email and we'll send you a new email verification email.</p>
            <base-input
                v-model.trim="email"
            ></base-input>
        </template>
        <template #actions>
            <div class="buttons-container">
                <base-button @click="dismiss">Cancel</base-button>
                <base-button @click="sendEmail">Send</base-button>
            </div>
        </template>
    </base-modal>
</template>

<script>
export default {
    props: ['shouldShow', 'modelValue', 'dismiss', 'sendEmail'],
    computed: {
        email() {
            return this.modelValue;
        }
    }
}
</script>

<style scoped>
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
</style>