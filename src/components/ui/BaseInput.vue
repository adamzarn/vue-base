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
    margin-top: 0.5rem;
}
input {
    display: block;
    width: 100%;
    border-width: 1px;
    border-radius: 4px;
    height: 32px;
    border-color: var(--light-gray-color);
    font-size: 16px;
    padding: 8px;
}
.light {
    font-weight: lighter;
}
</style>