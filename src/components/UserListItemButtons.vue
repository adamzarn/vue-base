<template>
    <div class="buttons-container">
        <base-button class="follow-button" @click="toggleFollowingStatus()">{{ toggleFollowingStatusButtonText }}</base-button>
        <div v-show="loggedInUserIsAdmin" class="admin-buttons">
            <base-button mode="light" class="admin-button" @click="toggleAdminStatus()">{{ toggleAdminStatusButtonText }}</base-button>
            <img class="svg delete-button" src="/delete.svg" @click="deleteUser()">
        </div>
    </div>
</template>

<script>
import network from '../layers/network.js';

export default {
    props: ['user', 'refresh'],
    computed: {
        loggedInUserIsAdmin() {
            return localStorage.user().isAdmin;
        },
        toggleAdminStatusButtonText() {
            return this.user.isAdmin ? "Revoke Admin Access" : "Give Admin Access"
        },
        toggleFollowingStatusButtonText() {
            return this.user.following ? "Unfollow" : "Follow"
        }
    },
    methods: {
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                otherUser: this.user,
                onSuccess: this.refresh,
                onFailure: error => { alert(error) }
            })
        },
        toggleAdminStatus() {
            network.toggleAdminStatus({
                user: this.user,
                onSuccess: this.refresh,
                onFailure: error => { alert(error) }
            });
        },
        deleteUser() {
            network.deleteUser({
                userId: this.user.id,
                onSuccess: this.refresh,
                onFailure: error => { alert(error) }
            });
        }
    }
}
</script>

<style scoped>
.buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    row-gap: 16px;
    column-gap: 16px;
}
.follow-button, .admin-button {
    cursor: pointer;
}
.delete-button {
    cursor: pointer;
    width: 32x;
    height: 32px;
    filter: invert(9%) sepia(82%) saturate(1981%) hue-rotate(282deg) brightness(89%) contrast(120%);
}
.delete-button:hover {
    filter: invert(7%) sepia(86%) saturate(3809%) hue-rotate(294deg) brightness(109%) contrast(104%);
}
.admin-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 16px;
}
@media only screen and (max-width: 480px) {
    .buttons-container {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>