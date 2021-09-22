<template>
    <div v-if="posts.length > 0" class="post-list-container">
        <post-list-item
            v-for="(post) in posts"
            :key="post.id"
            :post="post">
        </post-list-item>
    </div>
    <p v-if="posts.length == 0 && shouldShowNoResultsMessage" :class="style">{{ noResultsMessage }}</p>
</template>

<script>
import PostListItem from '../posts/PostListItem.vue';

export default {
    components: {
        PostListItem
    },
    props: {
        posts: {
            type: Array,
            required: true
        },
        style: String,
        noResultsMessage: String,
        shouldShowNoResultsMessage: Boolean
    }
}
</script>

<style scoped>
.post-list-container {
    display: flex;
    flex-direction: column;
    row-gap: var(--default-spacing);
    padding: 0px;
}
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