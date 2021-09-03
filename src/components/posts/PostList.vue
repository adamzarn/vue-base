<template>
    <div v-if="posts.length > 0" class="post-list-container">
        <post-list-item
            v-for="(post) in posts"
            :key="post.id"
            :post="post">
        </post-list-item>
    </div>
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
        }
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
</style>