<template>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      return navigateTo("/plugins");
    },
  ],
});
</script>

<style scoped>
</style>
