<template>
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
</template>

<script>
import network from '../../network/network.js';
import UserList from '../users/UserList.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { UserList, PageTitle },
    props: ['user'],
    data() {
        return {
            followers: [],
            following: [],
            isFollowing: false,
        }
    },
    computed: {
        userIsLoggedInUser() {
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
        }
    },
    mounted() {
        this.getData();
    }
}
</script>

<style scoped>
.follows {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
}
.title {
    margin-bottom: var(--default-spacing);
}
@media only screen and (max-width: 768px) {
    .follows {
        flex-direction: column;
    }
}
</style>