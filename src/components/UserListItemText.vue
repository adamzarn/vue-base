<template>
    <div class="text-container">
        <h3 class="text">{{ fullName }} <span class="username">{{ "@" + user.username }}</span></h3>
        <p v-show="user.isAdmin" class="text admin-badge">ADMIN</p>
        <p class="text">{{ user.email }}</p>
        <p class="text following-status">{{ followingStatuses }}</p>
    </div>
</template>

<script>
export default {
    props: ['user'],
    computed: {
        fullName() {
            return this.user.firstName + " " + this.user.lastName;
        },
        followingYouStatus() {
            return this.user.followingYou ? "Following you" : "Not following you";
        },
        followingStatus() {
            return this.user.following ? "Following" : "Not following";
        },
        followingStatuses() {
            return this.followingStatus + " | " + this.followingYouStatus;
        }
    }
}
</script>

<style scoped>
.text-container {
    display: flex;
    flex-direction: column;
}
.text {
    margin: 0;
    text-align: 'center'
}
.username {
    font-size: calc(var(--default-font-size)*3/4);
}
.following-status {
    color: var(--theme-dark-color);
}
.admin-badge {
    font-size: var(--default-font-size);
    font-weight: bold;
    color: var(--theme-dark-color);
}
@media only screen and (max-width: 480px) {
    .admin-badge {
        margin: 0;
    }
    .text {
        width: 100%;
        text-align: center;
    }
}
</style>