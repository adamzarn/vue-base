<template>
    <button>
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    font: inherit;
    border: 1px solid var(--theme-dark-color);
    background-color: var(--theme-dark-color);
    color: white;
    padding: 0.5rem 2rem;
    cursor: pointer;
    border-radius: 8px;
}
button:hover,
button:active {
    background-color:var(--theme-light-color);
    border-color: var(--theme-light-color);
}
</style>