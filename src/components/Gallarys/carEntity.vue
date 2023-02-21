<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
//import { getWidget } from "../../map";
import { car } from "../../core/carEntity";
import {  getDefaultEntityCollection } from "../../map";
let show = false;
let Car: car;
//var entity = getDefaultEntityCollection()

const trigger = () => {
  show = !show;
  const entities = getDefaultEntityCollection();
  if (!Car) Car= entities.add(new car());
  Car.show = show;
  console.log(Car)
};
</script>
<template>
  <CesiumButtonVue @click="trigger">car</CesiumButtonVue>
</template>
