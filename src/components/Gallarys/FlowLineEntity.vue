<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getDefaultEntityCollection } from "../../map";
import { Line } from "../../core/flowLineEntity";
let show = false;
let line: Line;

const trigger = () => {
  show = !show;
  const entities = getDefaultEntityCollection();
  if (!line) line = entities.add(new Line([2, 0, 2, 60]));
  line.show = show;
  console.log(line);
};
</script>
<template>
  <CesiumButtonVue @click="trigger">FlowLine(E)</CesiumButtonVue>
</template>
