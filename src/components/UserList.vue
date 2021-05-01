<template>
    <base-card v-if="users.length > 0" class="centered-horizontally">
        <user-list-item
            v-for="(user, index) in users"
            :key="user.id"
            :user="user"
            :isLast="index==users.length-1"
            :refresh="refresh"
            :showFollowButton="showFollowButton">
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
        showFollowButton: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<style scoped>
</style>