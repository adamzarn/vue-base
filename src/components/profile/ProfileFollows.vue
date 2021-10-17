<template>
    <div v-if="user" class="follows">
        <div class="col-12">
            <page-title class="title" :text="$t('profile_follows_followers_title')"></page-title>
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
            <page-title class="title" :text="$t('profile_follows_following_title')"></page-title>
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
import network from "../../network/network.js";
import "./../../local-storage-helper.js";
import UserList from "../users/UserList.vue";
import PageTitle from "../base/PageTitle.vue";

export default {
    components: { UserList, PageTitle },
    props: ["user"],
    data() {
        return {
            followers: [],
            following: [],
            noFollowersMessage: "",
            noFollowersError: false,
            noFollowingMessage: "",
            noFollowingError: false
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        _noFollowersMessage() {
            return this.userIsLoggedInUser ?
                this.$t('profile_follows_logged_in_user_no_followers_message') :
                this.$t('profile_follows_other_user_no_followers_message', { 'subject': this.user.firstName });
        },
        _noFollowingMessage() {
            return this.userIsLoggedInUser ?
                this.$t('profile_follows_logged_in_user_no_following_message') :
                this.$t('profile_follows_other_user_no_following_message', { 'subject': this.user.firstName });
        },
        noFollowersErrorMessage() {
            if (this.userIsLoggedInUser) {
                return this.$t('profile_follows_logged_in_user_followers_error_message');
            } else {
                let lastChar = this.user.firstName[this.user.firstName.length - 1];
                let subject = lastChar == "s" ?
                    this.$t('possessive_name_ending_with_s', { 'name': this.user.firstName }) :
                    this.$t('possessive_name', { 'name': this.user.firstName })
                return this.$t('profile_follows_other_user_followers_error_message', { 'subject': subject });
            }
        },
        noFollowingErrorMessage() {
            return this.userIsLoggedInUser ? 
                this.$t('profile_follows_logged_in_user_following_error_message') :
                this.$t('profile_follows_other_user_following_error_message', { 'subject': this.user.firstName });
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
                        this.noFollowersMessage = this._noFollowersMessage;
                        this.noFollowersError = false;
                    } else {
                        this.following = users.map((user) => {
                            let updatedUser = user
                            user.following = true
                            return updatedUser
                        })
                        this.noFollowingMessage = this._noFollowingMessage;
                        this.noFollowingError = false;
                    }
                },
                onFailure: () => { 
                    if (followType == "followers") {
                        this.followers = [];
                        this.noFollowersMessage = this.noFollowersErrorMessage;
                        this.noFollowersError = true;
                    } else {
                        this.following = [];
                        this.noFollowingMessage = this.noFollowingErrorMessage;
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