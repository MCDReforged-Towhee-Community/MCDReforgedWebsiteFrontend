<template>
  <div id="index">
    <PageIndexArea1/>
    <PageIndexArea2/>
  </div>
</template>

<script setup lang="ts">
// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();
</script>

<style scoped>
#index {
    width: 80%;
    margin: 5rem auto;

    display: grid;
    grid-gap: 1rem;
}
</style>

<i18n locale="en-US" lang="yaml">
</i18n>

<i18n locale="zh-CN" lang="yaml">
</i18n>
