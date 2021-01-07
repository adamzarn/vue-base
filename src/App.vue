<template>
  <router-view></router-view>
</template>

<script>
export default {
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

:root {
  --theme-dark-color: #360032;
  --theme-light-color: #5c0556;
  --invalid-color: red;
}

* {
  box-sizing: border-box;
}
html {
  font-family: 'Open Sans', sans-serif;
}
body {
  margin: 0;
}
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.centered-horizontally {
  margin-left: auto;
  margin-right: auto;
}
a:link {
  color: var(--theme-dark-color);
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: var(--theme-light-color);
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  color: var(--theme-light-color);
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  color: var(--theme-light-color);
  background-color: transparent;
  text-decoration: underline;
}

.validation {
    margin: 0px;
    font-size: 12px;
    color: var(--invalid-color);
}
</style>
