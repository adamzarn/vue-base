<template>
    <div class="container col-12" @click="profile">
        <user-list-item-text :user="user"></user-list-item-text>
        <user-list-item-buttons :user="user" :refresh="refresh" :showFollowButton="showFollowButton"></user-list-item-buttons>
    </div>
    <div v-if="isLast==false" class="separator"></div>
</template>

<script>
import UserListItemText from '../components/UserListItemText.vue';
import UserListItemButtons from '../components/UserListItemButtons';

export default {
    components: { UserListItemText, UserListItemButtons },
    props: ['user', 'isLast', 'refresh', 'showFollowButton'],
    methods: {
        profile() {
            this.$router.push({ name: "profile", params: { userId: this.user.id }})
        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: var(--default-spacing);
    cursor: pointer;
}
.container:hover {
    background-color: var(--light-gray-color);
}
.separator {
    height: 1px;
    background-color: var(--light-gray-color);
    margin-top: var(--default-spacing);
    margin-bottom: var(--default-spacing);
}
@media only screen and (max-width: 480px) {
    .container {
        justify-content: center;
    }
}
</style>