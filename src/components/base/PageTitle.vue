<template>
    <h1 class="title">{{ text }}</h1>
</template>

<script>
export default {
    props: ['text']
}
</script>

<style scoped>
.title {
    padding-left: 1rem;
    font-weight: bold;
    margin: 0px;
}
</style>