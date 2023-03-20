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
defineProps<{
  labels: string[];
}>();
</script>

<style scoped lang="scss">
#labels {
  display: flex;
  flex-wrap: wrap;
}
</style>
