<template>
    <page-title text="Posts"></page-title>
    <post-list 
        :posts="posts"
        :style="noPostResultsStyle"
        :noResultsMessage="noPostResultsMessage"
        :shouldShowNoResultsMessage="true">
    </post-list>
</template>

<script>
import network from "../../network/network.js";
import PageTitle from "../base/PageTitle.vue";
import PostList from "../posts/PostList.vue";

export default {
    components: { PageTitle, PostList },
    props: ["user"],
    data() {
        return {
            posts: [],
            noPostResultsMessage: "",
            noPostResultsError: false
        }
    },
    computed: {
        noPostResultsStyle() {
            return this.noPostResultsError ? "error" : ""
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
                    this.noPostResultsError = false;
                    this.noPostResultsMessage = "Neither you nor anyone you're following has posted anything yet."
                }, onFailure: () => {
                    this.posts = [];
                    this.noPostResultsError = true;
                    this.noPostResultsMessage = "There was a problem fetching your posts. Please try again later."
                }
            })
        }
    },
    mounted() {
        this.getPosts()
    }
}
</script>
