<template>
    <base-card v-if="users.length > 0">
        <user-list-item
            v-for="(user, index) in users"
            :key="user.id"
            :user="user"
            :isFirst="index==0"
            :isLast="index==users.length-1"
            :selectable="true"
            :refresh="refresh"
            :showToggleFollowButton="showToggleFollowButton"
            :showToggleAdminButton="showToggleAdminButton"
            :showDeleteButton="showDeleteButton">
        </user-list-item>
    </base-card>
    <p v-if="users.length == 0 && shouldShowNoResultsMessage" :class="style">{{ noResultsMessage }}</p>
</template>

<script>
import UserListItem from '../users/UserListItem.vue'

export default {
    components: {
        UserListItem
    },
    props: {
        users: {
            type: Array,
            required: true
        },
        refresh: {
            type: Function,
            required: true
        },
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
        },
        style: String,
        noResultsMessage: String,
        shouldShowNoResultsMessage: Boolean
    }
}
</script>

<style scoped>
p {
    margin-top: var(--default-spacing);
    margin-left: calc(var(--default-spacing)*2);
    margin-right: calc(var(--default-spacing)*2);
    font-size: var(--default-font-size);
    font-weight: lighter;
}
.error {
    color: var(--invalid-color);
}
</style>