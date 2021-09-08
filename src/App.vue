<template>
  <the-header></the-header>
  <router-view></router-view>
</template>

<script>
import TheHeader from './components/base/TheHeader.vue'
export default {
  components: { TheHeader }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap');

:root {
  --theme-dark-color: #360032;
  --theme-light-color: #5c0556;
  --invalid-color: red;
  --light-gray-color: #d3d3d3;
  --default-font-size: .8rem;
  --default-spacing: 1rem;
  --default-corner-radius: 1rem;
}

* {
  box-sizing: border-box;
}
html, textarea {
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
  text-decoration: underline;
}
a:visited {
  color: var(--theme-light-color);
  background-color: transparent;
  text-decoration: underline;
}
a:hover {
  color: var(--theme-light-color);
  background-color: transparent;
  text-decoration: underline;
  cursor: pointer;
}
a:active {
  color: var(--theme-light-color);
  background-color: transparent;
  text-decoration: underline;
}
.validation {
    margin: 0;
    font-size: var(--default-font-size);
    color: var(--invalid-color);
}

.separator {
    height: calc(var(--default-spacing)/16);
    background-color: var(--light-gray-color);
}

/* For desktop: */
.col-1 {width: 8.33%;}
.col-2 {width: 16.66%;}
.col-3 {width: 25%;}
.col-4 {width: 33.33%;}
.col-5 {width: 41.66%;}
.col-6 {width: 50%;}
.col-7 {width: 58.33%;}
.col-8 {width: 66.66%;}
.col-9 {width: 75%;}
.col-10 {width: 83.33%;}
.col-11 {width: 91.66%;}
.col-12 {width: 100%;}

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  [class*="col-"] {
    width: 100%;
  }
}
</style>
