<template>
    <div class="form-control">
        <label class="light" :for="name">{{ label }}</label>
        <input 
            :type="type" 
            :id="name" 
            :name="name" 
            :value="modelValue" 
            @input="updateModelValue"
            @blur="confirm"
        />
    </div>
</template>

<script>
export default {
    props: {
        validate: {
            type: Function,
            required: false
        },
        confirm: {
            type: Function,
            required: false
        },
        name: String,
        type: String,
        label: String,
        modelValue: String
    },
    emits: ['update:modelValue'],
    methods: {
        updateModelValue() {
            this.$emit('update:modelValue', event.target.value);
            if (this.validate) {
                this.validate()
            }
        }
    }
}
</script>

<style scoped>
.form-control {
    margin-top: calc(var(--default-spacing)/2);
}
input {
    width: 100%;
    border-width: calc(var(--default-spacing)/16);
    border-radius: calc(var(--default-corner-radius)*2/3);
    height: calc(var(--default-spacing)*2);
    border-color: var(--light-gray-color);
    font-size: var(--default-font-size);
    padding: var(--default-spacing);
}
.light {
    font-weight: lighter;
}
</style>