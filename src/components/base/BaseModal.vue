<template>
    <teleport to="body">
        <div @click="$emit('close')"></div>
        <dialog open>
            <header>
                <slot name="header">
                    <h2>{{ title }}</h2>
                </slot>
            </header>
            <section v-if="section">
                <slot></slot>
            </section>
            <menu>
                <slot name="actions">
                    <base-button @click="$emit('close')">Close</base-button>
                </slot>
            </menu>
        </dialog>
    </teleport>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: false
        },
        section: {
          type: Boolean,
          required: false,
          default: true
        }
    },
    emits: ["close"]
}
</script>

<style scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}
dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: var(--default-corner-radius);
  border: none;
  box-shadow: 0 calc(var(--default-corner-radius)/6) calc(var(--default-corner-radius)*2/3) rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
}
header {
  background-color: var(--theme-dark-color);
  color: white;
  width: 100%;
  padding: var(--default-spacing);
}
header h2 {
  margin: 0;
}
section {
  padding: var(--default-spacing);
}
menu {
  padding: var(--default-spacing);
  display: flex;
  justify-content: flex-end;
  margin: 0;
}
@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20*var(--default-spacing));
    width: calc(var(--default-spacing)*40);
  }
}
</style>