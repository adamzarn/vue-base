<template>
    <div class="col-12 profile-page-container">
        <div v-if="user" class="col-8 profile-container">
            <profile-header
                :profilePhotoUrl="profilePhotoUrl"
                :user="user"
                :loggedInUser="loggedInUser"
                @change="didUpdateUser">
            </profile-header>
            <profile-body 
                :user="user"
                :refresh="getUser">
            </profile-body>
            <div v-if="user" class="follows">
                <div class="col-6">
                    <page-title class="title" :text="followersTitle"></page-title>
                    <user-list :users="followers" :refresh="getFollowers" :showToggleFollowButton="false"></user-list>
                </div>
                <div class="col-6">
                    <page-title class="title" :text="followingTitle"></page-title>
                    <user-list :users="following" :refresh="getFollowing" :showToggleFollowButton="userIsLoggedInUser"></user-list>
                </div>
            </div>
        </div>
        <div class="col-4 posts-container">
            <page-title text="Posts"></page-title>
            <post-list :posts="posts"></post-list>
        </div>
    </div>
</template>

<script>
import network from '../../../network/network.js';
import UserList from '../../users/UserList.vue';
import PostList from '../../posts/PostList.vue';
import ProfileHeader from '../../profile/ProfileHeader.vue';
import ProfileBody from '../../profile/ProfileBody.vue';
import PageTitle from '../../base/PageTitle.vue';

export default {
    components: { ProfileHeader, ProfileBody, PageTitle, UserList, PostList },
    data() {
        return {
            followers: [],
            following: [],
            posts: [],
            user: null,
            loggedInUser: null,
            isFollowing: false,
            profilePhotoUrl: null,
        }
    },
    computed: {
        userIsLoggedInUser() {
            if (this.user == null) { return false; }
            return this.user.id == localStorage.user().id;
        },
        followersTitle() {
            return "Followers";
        },
        followingTitle() {
            return "Following";
        },
    },
    methods: {
        didUpdateUser(updatedUser) {
            this.loggedInUser = updatedUser
        },
        async getFollowers() {
            network.getFollows({
                urlParams: {
                    userId: this.$route.params.userId,
                    followType: "followers"
                },
                onSuccess: users => { 
                    this.followers = users
                    this.isFollowing = this.followers.filter((follower) => { 
                        return follower.id == localStorage.user().id
                    }).length > 0
                },
                onFailure: error => { 
                    alert(error.description);
                }
            })
        },
        async getFollowing() {
            network.getFollows({
                urlParams: {
                    userId: this.$route.params.userId,
                    followType: "following"
                },
                onSuccess: users => {
                    this.following = users.map((user) => {
                        let updatedUser = user
                        user.following = true
                        return updatedUser
                    })
                },
                onFailure: error => { 
                    alert(error.description); 
                }
            })
        },
        async getData() {
            this.getFollowers()
            this.getFollowing()
            this.getUser()
            this.getPosts()
        },
        getUser() {
            network.getUser({
                urlParams: {
                    userId: this.$route.params.userId
                },
                onSuccess: user => {
                    this.user = user;
                    this.profilePhotoUrl = this.getUniqueUrl(user.profilePhotoUrl);
                    if (user.id == localStorage.user().id) {
                        this.loggedInUser = user;
                    } else {
                        this.loggedInUser = localStorage.user();
                    }
                },
                onFailure: error => {
                    alert(error.description);
                }
            })
        },
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
        },
        getUniqueUrl(url) {
            if (url) {
                return `${url}#${new Date().getTime()}`
            } else {
                return null;
            }
        },
    },
    mounted() {
        if (localStorage.token != null) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    watch: {
        $route(to) {
            if (localStorage.token != null && to.name == "profile") {
                this.getData();
            }
        }
    }
}
</script>

<style scoped>
.menu-container {
    padding: var(--default-spacing);
}
.profile-page-container {
    display: flex;
}
.profile-container {
    display: flex;
    flex-direction: column;
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.posts-container {
    display: flex;
    flex-direction: column;
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.follows {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
}
@media only screen and (max-width: 768px) {
    .follows {
        flex-direction: column;
    }
    .container, .title-container, .buttons-container {
        flex-direction: column;
        row-gap: var(--default-spacing);
    }
}
@media only screen and (max-width: 480px) {
    .profile-page-container {
        flex-flow: column;
        row-gap: var(--default-spacing);
    }
}
</style>