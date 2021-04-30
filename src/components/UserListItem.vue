<template>
    <div class="container col-12">
        <div>
            <div>
                <h3 class="text" style="display:inline-block;">{{ fullName }}</h3>
                <p v-show="user.isAdmin" class="text admin-badge">ADMIN</p>
            </div>
            <p class="text">{{ user.email }}</p>
            <p class="text following-status">{{ followingStatus + " | " + followingYouStatus }}</p>
        </div>
        <div class="buttons-container">
            <base-button v-show="loggedInUserIsAdmin" class="admin-button" @click="toggleAdminStatus()">{{ toggleAdminStatusButtonText }}</base-button>
            <base-button class="follow-button" @click="toggleFollowingStatus()">{{ toggleFollowingStatusButtonText }}</base-button>
        </div>
    </div>
    <div v-if="isLast==false" class="separator"></div>
</template>

<script>
import network from '../layers/network.js';

export default {
    props: ['user', 'isLast', 'refresh'],
    computed: {
        loggedInUserIsAdmin() {
            return localStorage.getObject('user').isAdmin;
        },
        fullName() {
            return this.user.firstName + " " + this.user.lastName;
        },
        followingYouStatus() {
            return this.user.followingYou ? "Following you" : "Not following you";
        },
        followingStatus() {
            return this.user.following ? "Following" : "Not following"
        },
        toggleAdminStatusButtonText() {
            return this.user.isAdmin ? "Make User" : "Make Admin"
        },
        toggleFollowingStatusButtonText() {
            return this.user.following ? "Unfollow" : "Follow"
        }
    },
    methods: {
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                otherUser: this.user,
                onSuccess: () => {
                    this.refresh();
                },
                onFailure: error => {
                    alert(error)
                }
            })
        },
        toggleAdminStatus() {
            network.toggleAdminStatus({
                user: this.user,
                onSuccess: () => {
                    this.refresh();
                },
                onFailure: error => {
                    alert(error)
                }
            })
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
}
.buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.following-status {
    color: var(--theme-dark-color);
}
.follow-button, .admin_button {
    display: inline-block;
    margin-left: 10px;
}
.text {
    margin: 0px;
}
.admin-badge {
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: var(--theme-dark-color);
}
.separator {
    height: 1px;
    background-color: var(--light-gray-color);
    margin-top: 10px;
    margin-bottom: 10px;
}
@media only screen and (max-width: 480px) {
    .container {
        display: block;
        justify-content: space-between;
    }
    .buttons-container {
        display: block;
    }
    .text {
        text-align: center;
    }
    .follow-button, .admin-button {
        margin-left: 0px;
        width: 100%;
        margin-top: 10px;
    }
}
</style>