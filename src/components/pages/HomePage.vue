<template>
    <div class="container"> 
        <page-title class="title" text="Home"></page-title>
    </div>
</template>

<script>
import PageTitle from '../base/PageTitle.vue';

export default {
    components: {
        PageTitle
    }
}
</script>

<style scoped>
.container {
    padding: var(--default-spacing);
}
.title {
    margin-bottom: var(--default-spacing);
}
</style>