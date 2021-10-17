<template>
    <div class="parent-container">
        <div class="text-container">
            <p class="content light">{{ labelText }}</p>
            <base-input v-if="beingChanged" class="content" :type="type" v-model="newValue"></base-input>
            <p v-else class="content bold">{{ value }}</p>
        </div>
        <div v-if="editable" class="buttons-container">
            <base-button v-if="beingChanged" class="change-button" @click="toggleBeingChanged(field)">{{ $t('profile_item_cancel_button_text') }}</base-button>
            <base-button v-if="beingChanged" class="change-button" @click="update(field, newValue)">{{ $t('profile_item_submit_button_text') }}</base-button>
            <base-button v-if="!beingChanged" class="change-button" @click="toggleBeingChanged(field)">{{ $t('profile_item_change_button_text') }}</base-button>
        </div>
    </div>
    <div v-show="showSeparator" class="separator"></div>
</template>

<script>
export default {
    props: {
        field: String,
        label: String,
        currentValue: String,
        update: Function,
        beingChanged: Boolean,
        toggleBeingChanged: Function,
        editable: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: "text"
        },
        showSeparator: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            originalValue: this.currentValue,
            newValue: this.currentValue
        }
    },
    computed: {
        labelText() {
            return this.beingChanged ? this.$t('profile_item_new_field_label', { 'field': this.label }) : this.label;
        },
        value() {
            return this.type == "password" ? "*************" : this.currentValue;
        }
    }
}
</script>

<style scoped>
.parent-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    column-gap: var(--default-spacing);
    row-gap: var(--default-spacing);
    padding: var(--default-spacing);
}
.text-container {
    flex: 1;
}
.buttons-container {
    display: flex;
    column-gap: var(--default-spacing);
    row-gap: var(--default-spacing);
}
.bold {
    font-weight: bold;
}
.light {
    font-weight: lighter;
}
.content {
    margin: 0;
    font-size: var(--default-font-size);
}
.separator {

    height: calc(var(--default-spacing)/16);
    background-color: var(--light-gray-color);
}
@media only screen and (max-width: 480px) {
    .parent-container {
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
    }
    .text-container {
        width: 100%;
    }
    .buttons-container {
        flex-direction: column;
        column-gap: 0;
    }
}
</style>