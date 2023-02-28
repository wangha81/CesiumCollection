<script setup lang="ts">
import GraticuleVue from "./Gallarys/Graticule.vue";
import DiffussionPointVue from "./Gallarys/DiffussionPoint.vue";
import FlowLinePrimitiveVue from "./Gallarys/FlowLinePrimitive.vue";
import FlowLineEntityVue from "./Gallarys/FlowLineEntity.vue";
import CommandVue from "./Gallarys/Command.vue";
import CarEntityVue from "./Gallarys/CarEntity.vue"
</script>
<template>
  <div class="controll-section">
    <GraticuleVue />
    <DiffussionPointVue />
    <FlowLinePrimitiveVue />
    <FlowLineEntityVue />
    <CommandVue />
    <CarEntityVue/>
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
