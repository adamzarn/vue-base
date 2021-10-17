<template>
    <base-card class="post-item-container">
        <div class="header">
            <profile-photo
                :profilePhotoUrl="user.profilePhotoUrl"
                :navigatesToProfile="true"
                :user="user"
                size="small">
            </profile-photo>
            <div class="header-text clickable" @click="navigateToProfile">
                <p class="name bold">{{ name }} <span class="username">{{ username }}</span></p>                
                <p class="time">{{ time }}</p>
            </div>
        </div>
        <p class="text">{{ post.text }}</p>
    </base-card>
</template>

<script>

Date.prototype.subtractHours = function(h) {
    this.setHours(this.getHours() - h);
    return this;
}

export default {
    components: { },
    props: ["post"],
    computed: {
        user() {
            return this.post.user
        },
        time() {
            let date = new Date(this.post.createdAt);
            let months = [
                this.$t('mmm_january'),
                this.$t('mmm_february'),
                this.$t('mmm_march'),
                this.$t('mmm_april'),
                this.$t('mmm_may'),
                this.$t('mmm_june'),
                this.$t('mmm_july'),
                this.$t('mmm_august'),
                this.$t('mmm_september'),
                this.$t('mmm_october'),
                this.$t('mmm_november'),
                this.$t('mmm_december')
            ];
            let hours = date.getHours();
            let ampm = this.$t('am');
            if (hours > 11) { ampm = this.$t('pm'); }
            if (hours > 12) { hours -= 12; }
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${this.getMinutes(date)} ${ampm}`;
        },
        name() {
            return `${this.user.firstName} ${this.user.lastName}`
        },
        username() {
            return `@${this.user.username}`;
        }

    },
    methods: {
        getMinutes(date) {
            let minutes = date.getMinutes()
            if (minutes.toString().length == 1) {
                return `0${minutes}`
            }
            return minutes
        },
        navigateToProfile() {
            this.$router.push({ name: "profile", params: { userId: this.user.id }})
        }
    }
}
</script>

<style scoped>
.post-item-container {
    padding: var(--default-spacing);
}
.name {
    font-weight: bold;
    font-size: var(--default-font-size);
}
.time {
    font-size: calc(var(--default-font-size)*.8);
}
p {
    margin: 0;
}
.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: var(--default-spacing);
}
.text {
    margin-top: var(--default-spacing);
    font-size: var(--default-font-size);
}
.username {
    font-size: calc(var(--default-font-size)*3/4);
}
</style>