<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { CustomPrimitive } from "../../core/commandPrimitive";
import { Cartesian3, Transforms } from "cesium";
let show = false;
let _primitive: CustomPrimitive;

const trigger = () => {
  show = !show;
  if (_primitive) {
    _primitive.show = show
    return
  };

  const widget = getWidget();
  const {
    scene: { primitives },
  } = widget;

  const origin = Cartesian3.fromDegrees(0, 0, 250000 / 2);
  const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);

  _primitive = new CustomPrimitive(modelMatrix);
  primitives.add(_primitive);
};
</script>
<template>
  <CesiumButtonVue @click="trigger">Command</CesiumButtonVue>
</template>
