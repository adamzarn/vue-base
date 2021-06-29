<template>
    <div v-if="posts.length > 0" class="posts-container">
        <post-list-item
            v-for="(post) in posts"
            :key="post.id"
            :post="post">
        </post-list-item>
    </div>
</template>

<script>
import PostListItem from '../components/PostListItem.vue';

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
.posts-container {
    display: flex;
    flex-direction: column;
    row-gap: var(--default-spacing);
    padding: 0px;
}
</style>