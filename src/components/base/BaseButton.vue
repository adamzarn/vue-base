<template>
    <button :class="classes">
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        mode: {
            type: String,
            required: false,
            default: 'dark'
        }
    },
    computed: {
        classes() {
            return {
                'button-dark': this.mode === 'dark',
                'button-light': this.mode === 'light',
            };
        },
    }
}
</script>

<style scoped>
button {
    font: inherit;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
}
.button-dark {
    border: 1px solid var(--theme-dark-color);
    background-color: var(--theme-dark-color);
    color: white;
}
.button-light {
    border: 1px solid var(--theme-dark-color);
    background-color: white;
    color: var(--theme-dark-color);
}
.button-dark:hover,
.button-dark:active {
    background-color:var(--theme-light-color);
    border-color: var(--theme-light-color);
}
.button-light:hover,
.button-light:active {
    color:var(--theme-light-color);
    border-color: var(--theme-light-color);
}
</style>