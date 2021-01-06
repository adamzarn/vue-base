<template>
  <router-view></router-view>
</template>

<script>
export default {
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
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
</style>
