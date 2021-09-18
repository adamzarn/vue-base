<template>
    <div class="account-container col-12">
        <div v-if="userIsLoggedInUser" class="col-2 menu-container">
            <base-card>
                <div class="menu-item dark first" :class="{ selected: selectedPage == 'profile'}" @click="account('profile')">
                    <p class="text">Profile</p>
                </div>
                <div v-if="true" class="separator"></div>
                <div class="menu-item light last" :class="{ selected: selectedPage == 'history'}" @click="account('history')">
                    <p class="text">History</p>
                </div>
                <div v-if="false" class="separator"></div>
            </base-card>
        </div>
        <div :class="contentClass">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedPage: 'profile'
        }
    },
    computed: {
        userIsLoggedInUser() {
            return localStorage.user().id == this.$route.params.userId;
        },
        contentClass() {
            return this.userIsLoggedInUser ? "col-10" : "col-12"
        }
    },
    methods: {
        account(page) {
            this.selectedPage = page;
            this.$router.push({ name: page, params: { userId: this.$route.params.userId }})
        }
    }
} 
</script>

<style scoped>
.account-container {
    display: flex;
    column-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.menu-container {
    padding: var(--default-spacing);
}
.menu-item {
    background-color: white;
    color: var(--theme-dark-color);
    cursor: pointer;
    height: calc(var(--default-spacing)*4);
    padding: auto var(--default-spacing);
    position: relative;
    font-size: var(--default-font-size);
}
.selected {
    background-color: var(--theme-dark-color);
    color: white;
}
.first {
    border-top-left-radius: var(--default-corner-radius);
    border-top-right-radius: var(--default-corner-radius);
}
.last {
    border-bottom-left-radius: var(--default-corner-radius);
    border-bottom-right-radius: var(--default-corner-radius);
}
.text {
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    margin: 0 var(--default-spacing);
}
@media only screen and (max-width: 1000px) {
    .account-container {
        flex-flow: column;
    }
    [class*="col-"] {
        width: 100%;
    }
}
</style>