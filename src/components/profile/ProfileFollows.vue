<template>
    <div v-if="user" class="follows">
        <div class="col-12" v-if="followers.length > 0">
            <page-title class="title" text=Followers></page-title>
            <user-list :users="followers" :refresh="getFollowers" :showToggleFollowButton="false"></user-list>
        </div>
        <div class="col-12" v-if="following.length > 0">
            <page-title class="title" text="Following"></page-title>
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
    props: ['key', 'user'],
    data() {
        return {
            followers: [],
            following: [],
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        }
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
    },
    watch: {
        key() {
            this.getData();
        },
        $route(to) {
            if (localStorage.token != null && to.name == "profile") {
                this.getData();
            }
        }
    }
}
</script>

<style scoped>
.follows {
    display: flex;
    column-gap: calc(var(--default-spacing)*2);
    row-gap: var(--default-spacing);
    flex-direction: column;
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