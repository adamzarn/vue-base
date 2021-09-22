<template>
    <div class="container" v-if="user">
        <div class="col-8">
            <page-title class="title" text="Post"></page-title>
            <div>
                <user-list-item :user="user"></user-list-item>
                <div>
                    <textarea :placeholder="textAreaPlaceholder" v-model.trim="enteredPostText"></textarea>
                </div>
                <div class="submit-button-container">
                    <base-button @click="createPost">Submit</base-button>
                </div>
            </div>
            <page-title class="title" text="Feed"></page-title>
            <post-list 
                :posts="posts"
                :style="noPostResultsStyle"
                :noResultsMessage="noPostResultsMessage"
                :shouldShowNoResultsMessage="true">
            </post-list>
        </div>
        <div class="col-4">
            <base-input label="Find People to Follow" class="search-bar" v-model="enteredQuery" :onChange="findPeopleToFollow"></base-input>
            <user-list
                :users="users"
                :refresh="getData"
                :showToggleAdminButton="false"
                :showToggleFollowButton="true"
                :style="noUserResultsStyle"
                :noResultsMessage="noUserResultsMessage"
                :shouldShowNoResultsMessage="enteredQuery.length > 0">
            </user-list>
        </div>
    </div>
    <alert-modal
        :shouldShow="shouldShowAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        :dismiss="dismissAlertModal">
    </alert-modal>
</template>

<script>
import PageTitle from '../base/PageTitle.vue';
import network from '../../network/network.js';
import './../../local-storage-helper.js';
import UserList from '../../components/users/UserList.vue';
import UserListItem from '../../components/users/UserListItem.vue';
import PostList from '../posts/PostList.vue';

export default {
    components: {
        PageTitle,
        UserList,
        UserListItem,
        PostList
    },
    data() {
        return {
            posts: [],
            users: [],
            enteredQuery: '',
            enteredPostText: '',
            noUserResultsMessage: '',
            noUserResultsError: false,
            noPostResultsMessage: '',
            noPostResultsError: false,
            shouldShowAlertModal: false,
            alertTitle: '',
            alertMessage: ''
        }
    },
    computed: {
        user() {
            return localStorage.user();
        },
        firstName() {
            return this.user.firstName;
        },
        textAreaPlaceholder() {
            return `${this.firstName}, what's on your mind?`;
        },
        noUserResultsStyle() {
            return this.noUserResultsError ? "error" : ""
        },
        noPostResultsStyle() {
            return this.noPostResultsError ? "error" : ""
        }
    },
    methods: {
        findPeopleToFollow() {
            if (this.enteredQuery === '') {
                this.users = [];
                this.noUserResultsError = false;
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
                    this.noUserResultsError = false;
                    this.noUserResultsMessage = "No users you aren't currently following match your search."
                },
                onFailure: () => {
                    this.users = [];
                    this.noUserResultsError = true;
                    this.noUserResultsMessage = "There was a problem finding people to follow. Please try again later.";
                }
            })
        },
        getFeed() {
            network.getFeed({
                onSuccess: posts => {
                    this.posts = posts;
                    this.noPostResultsError = false;
                    this.noPostResultsMessage = "Neither you nor anyone you're following has posted anything yet."
                }, onFailure: () => {
                    this.posts = [];
                    this.noPostResultsError = true;
                    this.noPostResultsMessage = "There was a problem fetching your feed. Please try again later."
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
                }, onFailure: () => {
                    this.alertTitle = "Oops..."
                    this.alertMessage = "There was a problem submitting your post. Please try again later.";
                    this.shouldShowAlertModal = true;
                }
            })
        },
        dismissAlertModal() {
            this.shouldShowAlertModal = false;
        },
        getData() {
            this.findPeopleToFollow()
            this.getFeed()
        }
    },
    mounted() {
        if (localStorage.isLoggedIn()) {
            this.getFeed();
        }
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
.input-header {
    display: flex;
    column-gap: calc(var(--default-spacing));
    margin: calc(var(--default-spacing));
}
</style>