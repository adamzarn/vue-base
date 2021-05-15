<template>
    <base-card v-if="users.length > 0" class="centered-horizontally">
        <user-list-item
            v-for="(user, index) in users"
            :key="user.id"
            :user="user"
            :isFirst="index==0"
            :isLast="index==users.length-1"
            :refresh="refresh"
            :showToggleFollowButton="showToggleFollowButton"
            :showToggleAdminButton="showToggleAdminButton"
            :showDeleteButton="showDeleteButton">
        </user-list-item>
    </base-card>
</template>

<script>
import UserListItem from '../components/UserListItem.vue';

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
        }
    }
}
</script>

<style scoped>
</style>