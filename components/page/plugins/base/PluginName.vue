<template>
  <a
      v-if="id === 'mcdreforged'"
      class="clickable--underline"
      href="https://github.com/Fallen-Breath/MCDReforged"
      target="_blank"
  >
    MCDReforged
  </a>
  <NuxtLink
      v-else
      class="clickable--underline"
      :to="`/plugins/${id}`"
  >
    {{ name }}
  </NuxtLink>
</template>

<script setup lang="ts">
const pluginsStore = usePluginsStore();

const props = defineProps<{
  id: string;
}>();

const name = pluginsStore.getPluginDataBrief(props.id)?.name;
</script>

<style scoped>
</style>
