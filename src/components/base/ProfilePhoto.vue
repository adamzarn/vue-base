<template>
    <div v-if="user" @click="navigateToProfile">
        <input v-if="editable" class="profile-photo-input" type="file" id="profile-photo-input" @change="$emit('change', $event)"/>
        <div class="image-container" :class="{ clickable: userIsLoggedInUser && editable || navigatesToProfile, small: small, medium: medium }" @click="didClick">
            <div class="image-placeholder">
                <p v-if="profilePhotoUrl==null && user != null" class="initials">{{ user.firstName[0] + user.lastName[0] }}</p>
            </div>
            <img v-if="profilePhotoUrl" class="profile-photo" :src="profilePhotoUrl">
        </div>
        <profile-photo-modal
            :shouldShow="shouldShowModal" 
            :profilePhotoUrl="profilePhotoUrl"
            :dismiss="didSelectCancel"
            :didSelectChooseNewPhoto="openFileSelector"
            :didSelectDeletePhoto="deleteProfilePhoto">
    </profile-photo-modal>
    </div>
</template>

<script>
import network from '../../network/network.js';
import ProfilePhotoModal from '../modals/ProfilePhotoModal.vue';

export default {
    components: { ProfilePhotoModal },
    props: {
        profilePhotoUrl: String,
        user: Object,
        size: {
            type: String,
            default: "small"
        },
        editable: {
            type: Boolean,
            default: false
        },
        navigatesToProfile: Boolean
    },
    emits: ['change', 'didDeletePhoto'],
    data() {
        return {
            shouldShowModal: false
        }
    },
    methods: {
        didClick() {
            if (this.userIsLoggedInUser && this.editable) {
                this.shouldShowModal = true;
            }
        },
        didSelectCancel() {
            this.shouldShowModal = false;
        },
        openFileSelector() {
            this.shouldShowModal = false;
            document.getElementById('profile-photo-input').click();
        },
        deleteProfilePhoto() {
            this.shouldShowModal = false;
            network.deleteProfilePhoto({
                onSuccess: () => {
                    localStorage.user().profilePhotoUrl = null
                    this.$emit('didDeletePhoto');
                }, onFailure: error => {
                    alert(error.description);
                }
            })
        },
        navigateToProfile() {
            if (this.navigatesToProfile) {
                this.$router.push({ name: "profile", params: { userId: this.user.id }})
            }
        }
    },
    computed: {
        userIsLoggedInUser() {
            return this.user.id == localStorage.user().id;
        },
        small() {
            return this.size == "small"
        },
        medium() {
            return this.size == "medium"
        }
    }
}
</script>

<style scoped>
.profile-photo-input {
    width: 0px;
    height: 0px;
}
img[src=""] {
    display: none;
}
img[src] {
    display: block;
}
.image-container {
    position: relative;
}
.small {
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    font-size: calc(var(--default-font-size)*1.5);
}
.medium {
    width: 120px;
    height: 120px;
    min-width: 120px;
    min-height: 120px;
    font-size: calc(var(--default-font-size)*3);
}
input {
    opacity: 0;
    pointer-events: none;
}
.profile-photo, input, .image-placeholder {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 15%;
}
.profile-photo {
    object-fit: cover;
}
.image-placeholder {
    background-color: var(--light-gray-color);
}
.initials {
    font-weight: bold;
    text-align: center;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    margin: 0;
}
</style>