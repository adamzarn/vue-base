<template>
    <p class="page-title">{{ text }}</p>
</template>

<script>
export default {
    props: ["text"]
}
</script>

<style scoped>
.page-title {
    font-weight: bold;
    margin: 0;
    font-size: calc(var(--default-font-size)*2);
}
</style>