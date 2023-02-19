<script setup lang="ts">
import GraticuleVue from "./Gallarys/Graticule.vue";
import DiffussionPointVue from "./Gallarys/DiffussionPoint.vue";
import FlowLineVue from "./Gallarys/FlowLine.vue";
import CommandVue from "./Gallarys/Command.vue";
import car from "./Gallarys/car.vue"
</script>
<template>
  <div class="controll-section">
    <GraticuleVue />
    <DiffussionPointVue />
    <FlowLineVue />
    <CommandVue />
    <car/>
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
