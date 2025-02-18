<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { Polygon } from "../../core/wavePolygon";
let show = false;
let polygon: Polygon;

const trigger = () => {
  show = !show;
  const widget = getWidget();
  const {
    scene: { primitives },
  } = widget;
  if (!polygon)
    polygon = primitives.add(
      new Polygon({
        positions: [-20, 0, -20, 30, 20, 30, 20, 0],
      })
    );
  polygon.show = show;
  console.log(polygon)
};
</script>
<template>
  <CesiumButtonVue @click="trigger">WavePolygon(P)</CesiumButtonVue>
</template>
