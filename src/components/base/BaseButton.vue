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
    padding-left: calc(var(--default-spacing)*2);
    padding-right: calc(var(--default-spacing)*2);
    padding-top: calc(var(--default-spacing)/2);
    padding-bottom: calc(var(--default-spacing)/2);
    text-align: center;
    cursor: pointer;
    border-radius: var(--default-corner-radius);
    font-size: var(--default-font-size);
}
.button-dark {
    border: calc(var(--default-spacing)/16) solid var(--theme-dark-color);
    background-color: var(--theme-dark-color);
    color: white;
}
.button-light {
    border: calc(var(--default-spacing)/16) solid var(--theme-dark-color);
    background-color: white;
    color: var(--theme-dark-color);
}
.button-dark:hover,
.button-dark:active {
    background-color: var(--theme-light-color);
    border-color: var(--theme-light-color);
}
.button-light:hover,
.button-light:active {
    color: var(--theme-light-color);
    border-color: var(--theme-light-color);
}
</style>