<script setup lang="ts">
import { onMounted, ref } from "vue";
import { create as createWidget } from "../map";
import DemoEntry from "./DemoEntry.vue";

const widget = ref();

onMounted(async () => {
  await createWidget(widget.value);
});
</script>

<template>
  <div class="cesium-conatiner" ref="widget">
    <DemoEntry />
  </div>
</template>

<style scoped>
@import "cesium/Build/Cesium/Widgets/widgets.css";
.cesium-conatiner {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
