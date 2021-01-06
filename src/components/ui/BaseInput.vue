<template>
    <div class="form-control">
        <label :for="name">{{ label }}</label>
        <input 
            :type="type" 
            :id="name" 
            :name="name" 
            :value="modelValue" 
            @input="updateModelValue"
        />
    </div>
</template>

<script>
export default {
    props: ['name', 'type', 'label', 'modelValue'],
    emits: ['update:modelValue'],
    methods: {
        updateModelValue() {
            this.$emit('update:modelValue', event.target.value);
        }
    }
}
</script>

<style scoped>
.form-control {
    margin: 0.5rem 0;
}
input {
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    border-width: 2px;
    border-radius: 2px;
}
</style>