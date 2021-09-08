<template>
    <div class="container col-12" :class="classes" @click="account">
        <div class="left-container">
            <profile-photo
                :profilePhotoUrl="user.profilePhotoUrl"
                :user="user"
                size="small">
            </profile-photo>
            <user-list-item-text :user="user"></user-list-item-text>
        </div>
        <user-list-item-buttons
            :user="user"
            :refresh="refresh"
            :showToggleFollowButton="showToggleFollowButton"
            :showToggleAdminButton="showToggleAdminButton"
            :showDeleteButton="showDeleteButton">
        </user-list-item-buttons>
    </div>
    <div v-if="isLast==false" class="separator"></div>
</template>

<script>
import UserListItemText from '../users/UserListItemText.vue';
import UserListItemButtons from '../users/UserListItemButtons';

export default {
    components: { UserListItemText, UserListItemButtons },
    props: ['user', 'isFirst', 'isLast', 'refresh', 'showToggleFollowButton', 'showToggleAdminButton', 'showDeleteButton'],
    computed: {
        classes() {
            return {
                'first': this.isFirst,
                'last': this.isLast
            }
        }
    },
    methods: {
        account() {
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
    column-gap: var(--default-spacing);
    row-gap: var(--default-spacing);
    cursor: pointer;
    padding: var(--default-spacing);
}
.left-container {
    display: flex;
    column-gap: var(--default-spacing);
    align-items: center;
}
.container:hover {
    background-color: var(--light-gray-color);
}
img {
    height: 50px;
    width: 50px;
    border-radius: calc(var(--default-corner-radius)/2);
    object-fit: cover;
}
.first {
    border-top-left-radius: var(--default-corner-radius);
    border-top-right-radius: var(--default-corner-radius);
}
.last {
    border-bottom-left-radius: var(--default-corner-radius);
    border-bottom-right-radius: var(--default-corner-radius);
}
@media only screen and (max-width: 480px) {
    .container {
        justify-content: center;
    }
}
</style>