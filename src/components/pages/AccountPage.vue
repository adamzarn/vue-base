<template>
    <div>
        <div class="col-12 content-container">
            <h1 style="padding-left:1rem;" class="content bold">Account</h1>
            <div style="height:20px"></div>
            <base-card>
                <p class="content light">Email</p>
                <p class="content bold">{{ email }}</p>
                <div class="separator"></div>
                <p class="content light">{{ passwordBeingChanged ? "New Password" : "Password" }}</p>
                <div v-if="passwordBeingChanged" class="inline">
                    <base-input style="display:inline-block;flex:1" class="content" type="password" v-model="newPassword">></base-input>
                    <div>
                        <base-button style="display:inline-block; margin-left:10px" @click="passwordBeingChanged=false">Cancel</base-button>
                        <base-button style="display:inline-block; margin-left:10px" @click="changePassword">Submit</base-button>
                    </div>
                </div>
                <div v-else class="inline">
                    <p style="display:inline-block;" class="content bold">*****************</p>
                    <base-button style="display:inline-block;" @click="passwordBeingChanged=true">Change</base-button>
                </div>
            </base-card>
        </div>

        <div class="col-6 content-container">
            <h1 style="padding-left:1rem;" class="content bold">Followers</h1>
            <div style="height:20px"></div>
            <user-list :users="followers" :refresh="getData"></user-list>
        </div>
        <div class="col-6 content-container">
            <h1 style="padding-left:1rem;" class="content bold">Following</h1>
            <div style="height:20px"></div>
            <user-list :users="following" :refresh="getData"></user-list>
        </div>
    </div>
</template>

<script>
import network from '../../layers/network.js';
import UserList from '../UserList.vue';

export default {
    components: { UserList },
    data() {
        return {
            passwordBeingChanged: false,
            newPassword: '',
            followers: [],
            following: []
        }
    },
    computed: {
        email() {
            return localStorage.user().email;
        },
        fullName() {
            return localStorage.user().firstName + ' ' + localStorage.user().lastName;
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
        getData() {
            network.getUsersAndFollows({
                onSuccess: users => {
                    this.followers = users.filter(user => {
                        return user.followingYou == true;
                    });
                    this.following = users.filter(user => {
                        return user.following == true;
                    })
                },
                onFailure: error => {
                    alert(error);
                }
            })
        }
    },
    mounted() {
        if (localStorage.token != null) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    }
}
</script>

<style scoped>
.primary {
    background-color: purple;
}
.content-container {
    padding: 16px;
    border-width: 1px;
    display: inline-block;
    vertical-align: top;
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
.line {
    height: 40px;
}
.inline {
    display: flex;
    justify-content: space-between;
}
.separator {
    height: 1px;
    background-color: var(--light-gray-color);
    margin-top: 16px;
    margin-bottom: 16px;
}
</style>