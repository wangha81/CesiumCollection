<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { Line } from "../../core/flowLinePrimitive";
let show = false;
let line: Line;

const trigger = () => {
  show = !show;
  const widget = getWidget();
  const {
    scene: { primitives },
  } = widget;
  if (!line)
    line = primitives.add(
      new Line({
        positions: [-2, 0, -2, 60],
      })
    );
  line.show = show;
  console.log(line)
};
</script>
<template>
  <CesiumButtonVue @click="trigger">FlowLine(P)</CesiumButtonVue>
</template>
