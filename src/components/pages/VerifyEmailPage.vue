<template>
    <div class="verify-email-container">
        <h3>{{ message }}</h3>
        <base-button v-show="completed" @click="showLogin">{{ $t('verify_email_page_login_button_text') }}</base-button>
    </div>
</template>

<script>
import network from "../../network/network.js";

export default {
    data() {
        return {
            completed: false,
            message: ""
        }
    },
    methods: {
        verifyEmail() {
            network.verifyEmail({
                urlParams: {
                    tokenId: this.$route.params.tokenId
                },
                onSuccess: () => {
                    this.completed = true;
                    this.message = this.$t('verify_email_page_success_message');
                }, onFailure: error => {
                    this.completed = true;
                    this.message = error.reason;
                }
            });
        },
        showLogin() {
            this.$router.push({ name: "login" });
        }
    },
    mounted() {
        this.verifyEmail();
    }
}
</script>

<style scoped>
.verify-email-container {
    margin: var(--default-spacing);
}
</style>