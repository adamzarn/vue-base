<template>
    <div class="parent-container">
        <div class="text-container">
            <p class="content light">{{ passwordLabel }}</p>
            <base-input v-if="passwordBeingChanged" class="content" type="password" v-model="newPassword">></base-input>
            <p v-else class="content bold">***********</p>
        </div>
        <div class="buttons-container">
            <base-button v-if="passwordBeingChanged" class="change-password-button" @click="passwordBeingChanged=false">Cancel</base-button>
            <base-button v-if="passwordBeingChanged" class="change-password-button" @click="changePassword">Submit</base-button>
            <base-button v-if="!passwordBeingChanged" class="change-password-button" @click="passwordBeingChanged=true">Change</base-button>
        </div>
    </div>
</template>

<script>
import network from '../../layers/network.js';

export default {
    props: {
        showSeparator: {
            type: Boolean,
            required: false,
            defaultValue: true
        }
    },
    data() {
        return {
            newPassword: '',
            passwordBeingChanged: false
        }
    },
    computed: {
        passwordLabel() {
            return this.passwordBeingChanged ? "New Password" : "Password";
        }
    },
    methods: {
        changePassword() {
            network.resetPassword({
                tokenId: localStorage.tokenId,
                password: this.newPassword,
                onSuccess: () => {
                    alert("Your password was changed successfully!")
                    this.passwordBeingChanged = false;
                    this.newPassword = '';
                },
                onFailure: error => {
                    alert(error);
                    this.passwordBeingChanged = false;
                    this.newPassword = '';
                }
            })
        },
    }
}
</script>

<style scoped>
.parent-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    column-gap: 16px;
}
.text-container {
    flex: 1;
    min-width: 200px;
}
.buttons-container {
    display: flex;
    column-gap: 16px;
    margin-top: 16px;
    margin-bottom: 16px;
}
.bold {
    font-weight: bold;
}
.light {
    font-weight: lighter;
}
.content {
    margin: 0px;
}
.separator {
    height: 1px;
    background-color: var(--light-gray-color);
    margin-top: 16px;
    margin-bottom: 16px;
}
@media only screen and (max-width: 480px) {
    .parent-container {
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
    }
    .text-container {
        width: 100%;
    }
    .buttons-container {
        flex-direction: column;
        column-gap: 0px;
    }
    .change-password-button {
        margin-top: 16px;
    }
}
</style>