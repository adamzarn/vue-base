<template>
    <div class="container col-12" :class="classes" @click="profile">
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
    props: ['user', 'isFirst', 'isLast', 'refresh', 'showFollowButton'],
    computed: {
        classes() {
            return {
                'first': this.isFirst,
                'last': this.isLast
            }
        }
    },
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
    padding: var(--default-spacing);
}
.container:hover {
    background-color: var(--light-gray-color);
}
.first {
    border-top-left-radius: var(--default-corner-radius);
    border-top-right-radius: var(--default-corner-radius);
}
.last {
    border-bottom-left-radius: var(--default-corner-radius);
    border-bottom-right-radius: var(--default-corner-radius);
}
.separator {
    height: var(--default-spacing)/16;
    background-color: var(--light-gray-color);
}
@media only screen and (max-width: 480px) {
    .container {
        justify-content: center;
    }
}
</style>