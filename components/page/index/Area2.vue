<template>
  <div>
    <NuxtLink to="/document">
      <ElButton
          class="button"
          size="large"
          plain
      >
        {{ t("document") }}
      </ElButton>
    </NuxtLink>
    <NuxtLink to="/plugins">
      <ElButton
          class="button"
          size="large"
          type="success"
          plain
      >
        {{ t("plugins") }}
      </ElButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

</script>

<style scoped lang="scss">
.button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>

<i18n locale="en-US" lang="yaml">
document: Document
plugins: Discover Plugins
</i18n>

<i18n locale="zh-CN" lang="yaml">
document: 官方文档
plugins: 探索插件
</i18n>
