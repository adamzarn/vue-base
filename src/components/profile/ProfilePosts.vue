<template>
    <page-title text="Posts"></page-title>
    <post-list :posts="posts"></post-list>
</template>

<script>
import network from '../../network/network.js';
import PageTitle from '../base/PageTitle.vue';
import PostList from '../posts/PostList.vue';

export default {
    components: { PageTitle, PostList },
    props: ["user"],
    data() {
        return {
            posts: [],
        }
    },
    methods: {
        getPosts() {
            network.getPosts({
                urlParams: {
                    userId: this.$route.params.userId
                },
                onSuccess: (posts) => {
                    this.posts = posts;
                }, onFailure: error => {
                    alert(error.description);
                }
            })
        }
    },
    mounted() {
        this.getPosts()
    }
}
</script>
