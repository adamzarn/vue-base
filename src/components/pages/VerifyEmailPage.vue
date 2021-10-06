<template>
    <div class="verify-email-container">
        <h3>{{ message }}</h3>
        <base-button v-show="completed" @click="showLogin">Login</base-button>
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
                    this.message = "Your email was successfully verified.";
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