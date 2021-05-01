<template>
    <div class="col-12 container">
        <div class="title-container">
            <page-title text="Profile"></page-title>
            <img class="svg delete-button" src="/delete.svg" @click="deleteUser()">
        </div>
        <base-card>
            <profile-item label="Name" :value="fullName"></profile-item>
            <profile-item label="Email" :value="email" :showSeparator="isYou"></profile-item>
            <password-profile-item v-if="isYou"></password-profile-item>
        </base-card>
    </div>
    <div class="container follows">
        <div class="col-6">
            <page-title text="Followers"></page-title>
            <user-list :users="followers" :refresh="getData" :showFollowButton="isYou"></user-list>
        </div>
        <div class="col-6">
            <page-title text="Following"></page-title>
            <user-list :users="following" :refresh="getData" :showFollowButton="isYou"></user-list>
        </div>
    </div>
</template>

<script>
import network from '../../layers/network.js';
import UserList from '../UserList.vue';
import ProfileItem from '../base/ProfileItem.vue';
import PasswordProfileItem from '../base/PasswordProfileItem.vue';
import PageTitle from '../base/PageTitle.vue';

export default {
    components: { UserList, ProfileItem, PasswordProfileItem, PageTitle },
    data() {
        return {
            followers: [],
            following: [],
            user: null,
        }
    },
    computed: {
        fullName() {
            if (this.user == null) { return ''; }
            return this.user.firstName + ' ' + this.user.lastName;
        },
        email() {
            if (this.user == null) { return ''; }
            return this.user.email;
        },
        isYou() {
            if (this.user == null) { return false; }
            return this.user.you;
        }
    },
    methods: {
        getData() {
            network.getUsersAndFollows({
                userId: this.$route.params.userId,
                onSuccess: users => {
                    this.followers = users.filter(user => {
                        return user.followingYou == true;
                    });
                    this.following = users.filter(user => {
                        return user.following == true;
                    })
                    var matchingUsers = users.filter(user => {
                        return user.id == this.$route.params.userId
                    })
                    if (matchingUsers.length > 0) {
                        this.user = matchingUsers[0];
                    }
                },
                onFailure: error => {
                    alert(error);
                }
            })
        },
        deleteUser() {
            network.deleteUser({
                userId: this.user.id,
                onSuccess: () => {
                    if (this.isYou) {
                        localStorage.clear();
                        this.$router.push({ name: 'login' });
                    } else {
                        this.$router.push({ name: 'home' });
                    }
                },
                onFailure: error => { alert(error) }
            });
        }
    },
    mounted() {
        if (localStorage.token != null) {
            this.getData();
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    watch: {
        $route() {
            this.getData();
        }
    } 
}
</script>

<style scoped>
.container {
    padding: 1rem;
}
.follows {
    display: flex;
}
.title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--default-spacing);
}
.delete-button {
    cursor: pointer;
    width: 32x;
    height: 32px;
    filter: invert(9%) sepia(82%) saturate(1981%) hue-rotate(282deg) brightness(89%) contrast(120%);
}
.delete-button:hover {
    filter: invert(7%) sepia(86%) saturate(3809%) hue-rotate(294deg) brightness(109%) contrast(104%);
}
@media only screen and (max-width: 768px) {
    .follows {
        flex-direction: column;
    }
}
</style>