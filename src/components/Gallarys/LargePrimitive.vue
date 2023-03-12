<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { LabPrimitive } from "../../core/RecsPrimitive";
let show = false;
let _primitive: LabPrimitive

const trigger = () => {
  show = !show;
  const widget = getWidget();
  const {
    scene: { primitives },
  } = widget;
  console.log("Adding p", _primitive)
  _primitive ??= primitives.add(new LabPrimitive());
  console.log("Adding p", _primitive)
  _primitive.show = show
};
</script>
<template>
  <CesiumButtonVue @click="trigger">Large(P)</CesiumButtonVue>
</template>
