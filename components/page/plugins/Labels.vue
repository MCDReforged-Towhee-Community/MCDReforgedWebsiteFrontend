<template>
  <div id="labels">
    <PagePluginsLabel
        v-for="label in labels"
        :key="label"
        :label="label"
    />
  </div>
</template>

<script setup lang="ts">
import {Label} from "~/types/plugins";

defineProps<{
  labels: Label[];
}>();
</script>

<style scoped lang="scss">
#labels {
  display: flex;
  flex-wrap: wrap;

  *{
    margin-right: 0.5rem;
  }
}
</style>
