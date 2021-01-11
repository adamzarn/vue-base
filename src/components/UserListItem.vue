<template>
    <h2>{{ name }}</h2>
    <p>{{ email }}</p>
</template>

<script>
export default {
    props: ['name', 'email']
}
</script>

<style scoped>
</style>