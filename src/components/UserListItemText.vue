<template>
    <div class="text-container">
        <h3 class="text">{{ fullName }} <span class="username">{{ username }}</span></h3>
        <p class="text">{{ user.email }}</p>
    </div>
</template>

<script>
export default {
    props: ['user'],
    computed: {
        fullName() {
            let name = `${this.user.firstName} ${this.user.lastName}`
            if (localStorage.user().id == this.user.id) {
                return `${name} (You)`
            }
            return name
        },
        username() {
            return `@${this.user.username}`
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
    text-align: 'center'
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