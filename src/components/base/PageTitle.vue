<template>
    <h1 class="page-title">{{ text }}</h1>
</template>

<script>
export default {
    props: ['text']
}
</script>

<style scoped>
.page-title {
    padding-left: var(--default-spacing);
    font-weight: bold;
    margin: 0;
}
</style>