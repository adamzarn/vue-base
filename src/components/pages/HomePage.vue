<template>
    <div class="container">
        <div class="col-8">
            <page-title class="title" text="Post"></page-title>
            <div>
                <div>
                    <textarea :placeholder="textAreaPlaceholder" v-model.trim="enteredPostText"></textarea>
                </div>
                <div class="submit-button-container">
                    <base-button @click="createPost">Submit</base-button>
                </div>
            </div>
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
import UserList from '../../components/users/UserList.vue';
import PostList from '../posts/PostList.vue';

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
            enteredQuery: '',
            enteredPostText: ''
        }
    },
    computed: {
        firstName() {
            return localStorage.user().firstName;
        },
        textAreaPlaceholder() {
            return `${this.firstName}, what's on your mind?`;
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
                    isFollowing: "no",
                    excludeMe: "yes"
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
        createPost() {
            if (this.enteredPostText.length == 0) { return; }
            network.createPost({
                body: {
                    text: this.enteredPostText
                },
                onSuccess: () => {
                    this.enteredPostText = '';
                    this.getFeed()
                }, onFailure: error => {
                    alert(error.description)
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
.submit-button-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--default-spacing);
}
textarea {
    height: 100px;
    width: 100%;
    resize: none;
    padding: var(--default-spacing);
    font-size: calc(var(--default-font-size)*1.25);
}
</style>