<template>
  <div id="labels">
    <PagePluginsBaseLabel
        v-for="label in labels"
        :key="label"
        :label="label"
    />
  </div>
</template>

<script setup lang="ts">
import {type Label} from "~/types/plugins";

defineProps<{
  labels: Label[];
}>();
</script>

<style scoped lang="scss">
#labels {
  display: flex;

  * {
    margin-right: 0.5rem;
  }
}
</style>
