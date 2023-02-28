<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { Line } from "../../core/flowLineEntity";
import { getWidget } from "../../map";
let show = false;
let line: Line;

const trigger = async () => {
  show = !show;
  const widget = getWidget();
  const { entities } = widget;
  if (!line){
    setTimeout(async () => {
      await widget.updateDefaultDisplay();
    }, 500)
  }
  line ??= entities.add(new Line([2, 0, 2, 60]))
  line.show = show;
  await widget.updateDefaultDisplay();
  console.log(line);
};
</script>
<template>
  <CesiumButtonVue @click="trigger">FlowLine(E)</CesiumButtonVue>
</template>
