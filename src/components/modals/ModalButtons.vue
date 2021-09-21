<template>
    <div class="modal-buttons-container">
        <slot></slot>
    </div>
</template>

<style scoped>
.modal-buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
}
</style>