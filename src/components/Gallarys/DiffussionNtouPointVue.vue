<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { Point } from "../../core/diffusionNtouPoint";
let show = false;
let point: Point;
const trigger = () => {
  show = !show;
  const widget = getWidget();
  const {
    scene: { primitives },
  } = widget;
  if (!point) point = primitives.add(new Point({ lat: 25, lng: 121 }));
  point.show = show;
  console.log(point)
};
</script>
<template>
  <CesiumButtonVue @click="trigger">DiffusionNtouPoint</CesiumButtonVue>
</template>
