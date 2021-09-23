<template>
    <div v-if="user" class="follows">
        <div class="col-12">
            <page-title class="title" text=Followers></page-title>
            <user-list
                :users="followers"
                :refresh="getFollowers"
                :showToggleFollowButton="false"
                :style="noFollowersStyle"
                :noResultsMessage="noFollowersMessage"
                :shouldShowNoResultsMessage="true">
            </user-list>
        </div>
        <div class="col-12">
            <page-title class="title" text="Following"></page-title>
            <user-list
                :users="following"
                :refresh="getFollowing"
                :showToggleFollowButton="userIsLoggedInUser"
                :style="noFollowingStyle"
                :noResultsMessage="noFollowingMessage"
                :shouldShowNoResultsMessage="true">
            </user-list>
        </div>
    </div>
</template>

<script>
import network from '../../network/network.js';
import './../../local-storage-helper.js';
import UserList from '../users/UserList.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { UserList, PageTitle },
    props: ['user'],
    data() {
        return {
            followers: [],
            following: [],
            noFollowersMessage: '',
            noFollowersError: false,
            noFollowingMessage: '',
            noFollowingError: false
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        noFollowersSubject() {
            return this.userIsLoggedInUser ? "You don't" : `${this.user.firstName} doesn't`;
        },
        noFollowingSubject() {
            return this.userIsLoggedInUser ? "You aren't" : `${this.user.firstName} isn't`;
        },
        noFollowersErrorSubject() {
            if (this.userIsLoggedInUser) {
                return  "your"
            } else {
                var lastChar = this.user.firstName[this.user.firstName.length - 1];
                return lastChar == "s" ? `${this.user.firstName}'` : `${this.user.firstName}'s`
            }
        },
        noFollowingErrorSubject() {
            return this.userIsLoggedInUser ? "you're" : `${this.user.firstName} is`;
        },
        noFollowersStyle() {
            return this.noFollowersError ? "error" : "";
        },
        noFollowingStyle() {
            return this.noFollowingError ? "error" : "";
        }
    },
    methods: {
        async getFollows(followType) {
            network.getFollows({
                urlParams: {
                    userId: this.$route.params.userId,
                    followType: followType
                },
                onSuccess: users => { 
                    if (followType == "followers") {
                        this.followers = users;
                        this.noFollowersMessage = `${this.noFollowersSubject} have any followers yet.`;
                        this.noFollowersError = false;
                    } else {
                        this.following = users.map((user) => {
                            let updatedUser = user
                            user.following = true
                            return updatedUser
                        })
                        this.noFollowingMessage = `${this.noFollowingSubject} following anyone yet.`;
                        this.noFollowingError = false;
                    }
                },
                onFailure: () => { 
                    if (followType == "followers") {
                        this.followers = [];
                        this.noFollowersMessage = `There was a problem fetching ${this.noFollowersErrorSubject} followers.`;
                        this.noFollowersError = true;
                    } else {
                        this.following = [];
                        this.noFollowingMessage = `There was a problem fetching the users ${this.noFollowingErrorSubject} following.`;
                        this.noFollowingError = true;
                    }
                }
            })
        },
        async getFollowers() {
            this.getFollows("followers");
        },
        async getFollowing() {
            this.getFollows("following");
        },
        async getData() {
            this.getFollows("followers")
            this.getFollows("following")
        }
    },
    mounted() {
        this.getData();
    },
    watch: {
        key() {
            this.getData();
        },
        user() {
            this.getData();
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