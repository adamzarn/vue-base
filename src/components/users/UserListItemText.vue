<template>
    <div class="text-container" :class="classes" @click="navigateToProfile">
        <p class="text bold">{{ fullName }} <span class="username">{{ username }}</span></p>
        <p class="text">{{ user.email }}</p>
    </div>
</template>

<script>
export default {
    props: ["user", "navigatesToProfile"],
    computed: {
        fullName() {
            return `${this.user.firstName} ${this.user.lastName}`
        },
        username() {
            return `@${this.user.username}`
        },
        classes() {
            return {
                "clickable": this.navigatesToProfile
            }
        }
    },
    methods: {
        navigateToProfile() {
            if (this.navigatesToProfile) {
                this.$router.push({ name: "profile", params: { userId: this.user.id }})
            }
        }
    }
}
</script>

<style scoped>
.text-container {
    display: flex;
    flex-direction: column;
}
.text {
    margin: 0;
    text-align: "center";
    font-size: var(--default-font-size);
}
.bold {
    font-weight: bold;
}
.username {
    font-size: calc(var(--default-font-size)*3/4);
}
.following-status {
    color: var(--theme-dark-color);
}
@media only screen and (max-width: 480px) {
    .admin-badge {
        margin: 0;
    }
    .text {
        width: 100%;
        text-align: center;
    }
}
</style>