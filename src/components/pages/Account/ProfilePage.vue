<template>
    <div class="col-12 profile-page-container">
        <div v-if="user" class="col-9 profile-container">
            <profile-header
                :profilePhotoUrl="profilePhotoUrl"
                :user="user"
                @didUpdateUser="didUpdateUser"
                @didUpdateFollowingStatus="didUpdateFollowingStatus"></profile-header>
            <profile-body :user="user" :refresh="getUser"></profile-body>
            <profile-follows :user="user"></profile-follows>
        </div>
        <div v-else class="col-9 profile-container">
            We're having trouble fetching your profile right now.
        </div>
        <div class="col-3 posts-container">
            <profile-posts :key="postsKey"></profile-posts>
        </div>
    </div>
</template>

<script>
import network from '../../../network/network.js';
import './../../../local-storage-helper.js';
import ProfileHeader from '../../profile/ProfileHeader.vue';
import ProfileBody from '../../profile/ProfileBody.vue';
import ProfileFollows from '../../profile/ProfileFollows.vue';
import ProfilePosts from '../../profile/ProfilePosts.vue'

export default {
    components: { ProfileHeader, ProfileBody, ProfileFollows, ProfilePosts },
    data() {
        return {
            user: null,
            profilePhotoUrl: null,
            postsKey: ''
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        loggedInUser() {
            return localStorage.user();
        }
    },
    methods: {
        didUpdateUser(updatedUser) {
            this.profilePhotoUrl = updatedUser.profilePhotoUrl;
            this.postsKey = new Date().getTime();
        },
        didUpdateFollowingStatus() {
            this.followsKey = new Date().getTime();
        },
        async getData() {
            this.getUser()
        },
        getUser() {
            network.getUser({
                urlParams: {
                    userId: this.$route.params.userId
                },
                onSuccess: user => {
                    this.user = user;
                    this.postsKey = new Date().getTime();
                    this.profilePhotoUrl = user.profilePhotoUrl;
                },
                onFailure: () => {}
            })
        }
    },
    mounted() {
        if (localStorage.isLoggedIn()) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    watch: {
        $route(to) {
            if (localStorage.isLoggedIn() && to.name == "profile") {
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
@media only screen and (max-width: 1000px) {
    .container, .title-container, .buttons-container {
        flex-direction: column;
        row-gap: var(--default-spacing);
    }
    .profile-page-container {
        flex-flow: column;
    }
    [class*="col-"] {
        width: 100%;
    }
}
</style>