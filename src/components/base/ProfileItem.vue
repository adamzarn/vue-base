<template>
    <p class="content light">{{ label }}</p>
    <p class="content bold">{{ value }}</p>
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
.bold {
    font-weight: bold;
}
.light {
    font-weight: lighter;
}
.content {
    margin: 0px;
}
.separator {
    height: 1px;
    background-color: var(--light-gray-color);
    margin-top: 16px;
    margin-bottom: 16px;
}
</style>