<script setup lang="ts">
import GraticuleVue from "./Gallarys/Graticule.vue";
import DiffussionPointVue from "./Gallarys/DiffussionPoint.vue";
import DiffussionNtouPointVue from "./Gallarys/DiffussionNtouPointVue.vue";
import FlowLineVue from "./Gallarys/FlowLine.vue";
import CommandVue from "./Gallarys/Command.vue";
</script>
<template>
  <div class="controll-section">
    <GraticuleVue />
    <DiffussionPointVue />
    <DiffussionNtouPointVue />
    <FlowLineVue />
    <CommandVue />
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
