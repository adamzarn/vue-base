<template>
    <div class="container">
        <div class="col-8">
            <page-title class="title" text="Feed"></page-title>
            <post-list :posts="posts"></post-list>
        </div>
        <div class="col-4">
            <base-input label="Find People to Follow" class="search-bar" v-model="enteredQuery" :onChange="findPeopleToFollow"></base-input>
            <user-list :users="users" :refresh="getData" :showToggleAdminButton="false" :showToggleFollowButton="true"></user-list>
        </div>
    </div>
</template>

<script>
import PageTitle from '../base/PageTitle.vue';
import network from '../../network/network.js';
import UserList from '../../components/UserList.vue';
import PostList from '../PostList.vue';

export default {
    components: {
        PageTitle,
        UserList,
        PostList
    },
    data() {
        return {
            posts: [],
            users: [],
            enteredQuery: ''
        }
    },
    methods: {
        findPeopleToFollow() {
            if (this.enteredQuery === '') {
                this.users = [];
                return
            }
            network.searchUsers({
                queryParams: {
                    query: this.enteredQuery,
                    start: 0,
                    end: 50,
                    isFollowing: "no"
                },
                onSuccess: users => {
                    this.users = users
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
        getFeed() {
            network.getFeed({
                onSuccess: posts => {
                    this.posts = posts;
                }, onFailure: error => {
                    alert(error.description);
                }
            })
        },
        getData() {
            this.findPeopleToFollow()
            this.getFeed()
        }
    },
    mounted() {
        this.getFeed();
    }
}
</script>

<style scoped>
.container {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.title {
    margin-bottom: var(--default-spacing);
}
.search-bar {
    margin: var(--default-spacing);
}
</style>