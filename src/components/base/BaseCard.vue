<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
div {
  border-radius: var(--default-corner-radius);
  box-shadow: 0 calc(var(--default-corner-radius)/6) calc(var(--default-corner-radius)*2/3) rgba(0, 0, 0, 0.26);
}
</style>