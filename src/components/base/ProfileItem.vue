<template>
    <div class="profile-item-container">
        <p class="content light">{{ label }}</p>
        <p class="content bold">{{ value }}</p>
    </div>
    <div v-show="showSeparator" class="separator"></div>
</template>

<script>
export default {
    props: {
        label: String,
        value: String,
        showSeparator: {
            type: Boolean,
            required: false,
            default: true
        }
    }
}
</script>

<style scoped>
.profile-item-container {
    padding: var(--default-spacing);
}
.bold {
    font-weight: bold;
}
.light {
    font-weight: lighter;
}
.content {
    margin: 0;
}
.separator {
    height: calc(var(--default-spacing)/16);
    background-color: var(--light-gray-color);
}
</style>