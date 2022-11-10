<script setup lang="ts">
import CesiumButtonVue from "../CesiumButton.vue";
import { getWidget } from "../../map";
import Graticule from "../../core/graticule";
let show = false;
let graticule: Graticule;
const trigger = () => {
  show = !show;
  const widget = getWidget();
  if (!graticule) graticule = new Graticule({ viewer: widget! });
  show ? graticule.on() : graticule.off();
};
</script>
<template>
  <CesiumButtonVue @click="trigger">Graticule</CesiumButtonVue>
</template>
