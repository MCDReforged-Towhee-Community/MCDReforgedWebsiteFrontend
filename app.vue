<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

<script setup lang="ts">
const i18n = useI18n();

// title
useHead({title: () => i18n.t("global.title")});

// i18n head attributes
useHead(useLocaleHead({addSeoAttributes: true}));
</script>
