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
            <profile-follows
                :user="user">
            </profile-follows>
        </div>
        <div class="col-4 posts-container">
            <profile-posts :key="postsKey"></profile-posts>
        </div>
    </div>
</template>

<script>
import network from '../../../network/network.js';
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
            postsKey: '',
            headerKey: ''
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
            this.profilePhotoUrl = this.getUniqueUrl(updatedUser.profilePhotoUrl);
            this.postsKey = new Date().getTime();
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
                    this.profilePhotoUrl = this.getUniqueUrl(user.profilePhotoUrl);
                },
                onFailure: error => {
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
@media only screen and (max-width: 768px) {
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