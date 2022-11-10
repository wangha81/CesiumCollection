<script setup lang="ts">
import GraticuleVue from "./Gallarys/Graticule.vue";
</script>
<template>
  <div class="controll-section">
    <GraticuleVue />
  </div>
</template>

<style scoped>
.controll-section {
  position: fixed;
  right: 0.16em;
  top: 0.16em;
  z-index: 2;
}
</style>
