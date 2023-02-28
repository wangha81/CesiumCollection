<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import { Car } from "../../core/carEntity";
let show = false;
let car: Car;

const trigger = async () => {
  show = !show;
  const widget = getWidget();
  const { entities } = widget;
  car ??= entities.add(new Car());
  car.show = show;
  await widget.updateDefaultDisplay();
  console.log(car)
};
</script>
<template>
  <CesiumButtonVue @click="trigger">car</CesiumButtonVue>
</template>
