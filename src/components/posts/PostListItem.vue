<template>
    <base-card class="post-item-container">
        <div class="header">
            <profile-photo
                :profilePhotoUrl="user.profilePhotoUrl"
                :user="user"
                size="small">
            </profile-photo>
            <div class="header-text">
                <p class="name">{{ userName }}</p>
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
    props: ['post'],
    computed: {
        user() {
            return this.post.user
        },
        time() {
            let date = new Date(this.post.createdAt);
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let hours = date.getHours();
            let ampm = "AM"
            if (hours > 12) { 
                ampm = "PM"
                hours -= 12 
            }
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${date.getMinutes()} ${ampm}`;
        },
        userName() {
            return `${this.user.firstName} ${this.user.lastName}`
        }
    },
    methods: {
    }
}
</script>

<style scoped>
.post-item-container {
    padding: var(--default-spacing);
}
.name {
    font-weight: bold;
}
.time {
    font-size: calc(var(--default-font-size)*.8);
}
p {
    margin: 0;
}
img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}
.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: var(--default-spacing);
}
.text {
    margin-top: var(--default-spacing);
}
</style>