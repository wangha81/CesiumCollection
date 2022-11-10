<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { Point } from "../../core/diffusionPoint";
let show = false;
let point: Point;
const trigger = () => {
  show = !show;
  const widget = getWidget();
  const {
    scene: { primitives },
  } = widget;
  if (!point) point = primitives.add(new Point({ lat: 0, lng: 0 }));
  point.show = show;
  console.log(point)
};
</script>
<template>
  <CesiumButtonVue @click="trigger">DiffusionPoint</CesiumButtonVue>
</template>
