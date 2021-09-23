<template>
    <div class="buttons-container">
        <base-button v-if="showToggleFollowButton" class="follow-button" @click.stop="toggleFollowingStatus()">{{ toggleFollowingStatusButtonText }}</base-button>
    </div>
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import network from '../../network/network.js';
import './../../local-storage-helper.js';

export default {
    props: {
        user: Object,
        refresh: Function,
        showToggleFollowButton: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            shouldShowAlertModal: false,
            alertTitle: '',
            alertMessage: ''
        }
    },
    computed: {
        toggleFollowingStatusButtonText() {
            return this.user.following ? "Unfollow" : "Follow"
        },
        toggleFollowingAction() {
            return this.isFollowing ? 'unfollowing' : 'following';
        },
    },
    methods: {
        toggleFollowingStatus() {
            network.toggleFollowingStatus({
                urlParams: {
                    action: this.user.following ? 'unfollow' : 'follow',
                    userId: this.user.id
                },
                onSuccess: this.refresh,
                onFailure: () => {
                    this.alertTitle = "Oops...";
                    this.alertMessage = `There was a problem ${this.toggleFollowingAction} ${this.user.firstName}.`;
                    this.shouldShowAlertModal = true;
                }
            })
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        }
    },
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