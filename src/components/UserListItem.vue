<template>
    <div class="container col-12">
        <user-list-item-text :user="user"></user-list-item-text>
        <user-list-item-buttons :user="user" :refresh="refresh"></user-list-item-buttons>
    </div>
    <div v-if="isLast==false" class="separator"></div>
</template>

<script>
import UserListItemText from '../components/UserListItemText.vue';
import UserListItemButtons from '../components/UserListItemButtons';

export default {
    components: { UserListItemText, UserListItemButtons },
    props: ['user', 'isLast', 'refresh']
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 16px;
}
.separator {
    height: 1px;
    background-color: var(--light-gray-color);
    margin-top: 16px;
    margin-bottom: 16px;
}
@media only screen and (max-width: 480px) {
    .container {
        justify-content: center;
    }
}
</style>