<template>
    <div class="buttons-container">
        <base-button v-if="showToggleFollowButton" class="follow-button" @click.stop="toggleFollowingStatus()">{{ toggleFollowingStatusButtonText }}</base-button>
        <div v-if="loggedInUserIsAdmin && (showToggleAdminButton || showDeleteButton)" class="admin-buttons">
            <base-button v-if="showToggleAdminButton" mode="light" class="admin-button" @click.stop="toggleAdminStatus()">{{ toggleAdminStatusButtonText }}</base-button>
            <img v-if="showDeleteButton" class="svg delete-button" src="/delete.svg" @click.stop="deleteUser()">
        </div>
    </div>
</template>

<script>
import network from '../network/network.js';

export default {
    props: {
        user: Object,
        refresh: Function,
        showToggleFollowButton: {
            type: Boolean,
            required: false,
            default: false
        },
        showToggleAdminButton: {
            type: Boolean,
            required: false,
            default: false
        },
        showDeleteButton: {
            type: Boolean,
            required: false,
            default: false
        }
    },
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
                urlParams: {
                    userId: localStorage.user().id
                },
                body: {
                    otherUserId: this.user.id,
                    follow: !this.user.following
                },
                onSuccess: this.refresh,
                onFailure: error => { alert(error.description) }
            })
        },
        toggleAdminStatus() {
            network.toggleAdminStatus({
                urlParams: {
                    userId: this.user.id
                },
                body: {
                    isAdmin: !this.user.isAdmin
                },
                onSuccess: () => {
                    if (this.user.id == localStorage.user().id) {
                        let updatedUser = localStorage.user();
                        updatedUser.isAdmin = !updatedUser.isAdmin;
                        localStorage.setObject('user', updatedUser);
                    }
                    this.refresh()
                },
                onFailure: error => { alert(error.description) }
            });
        },
        deleteUser() {
            network.deleteUser({
                urlParams: {
                    userId: this.user.id
                },
                onSuccess: this.refresh,
                onFailure: error => { alert(error.description) }
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
    row-gap: var(--default-spacing);
    column-gap: var(--default-spacing);
}
.follow-button, .admin-button {
    cursor: pointer;
}
.delete-button {
    cursor: pointer;
    width: calc(var(--default-spacing)*2);
    height: calc(var(--default-spacing)*2);
    filter: invert(9%) sepia(82%) saturate(1981%) hue-rotate(282deg) brightness(89%) contrast(120%);
}
.delete-button:hover {
    filter: invert(7%) sepia(86%) saturate(3809%) hue-rotate(294deg) brightness(109%) contrast(104%);
}
.admin-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: var(--default-spacing);
}
@media only screen and (max-width: 480px) {
    .buttons-container {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>