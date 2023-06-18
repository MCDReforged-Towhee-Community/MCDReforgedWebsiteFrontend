<template>
  <div>
    <a :href="t('documentLink')" target="_blank">
      <ElButton class="button" size="large">
        {{ t("document") }}
      </ElButton>
    </a>
    <NuxtLink to="/plugins">
      <ElButton class="button" size="large" type="primary" plain>
        {{ t("plugins") }}
      </ElButton>
    </NuxtLink>
    <NuxtLink to="/plugins">
      <ElButton class="button" size="large" type="success" plain>
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
}
</style>

<i18n locale="en-US" lang="yaml">
document: Document
documentLink: https://mcdreforged.readthedocs.io/en/latest/
plugins: Discover Plugins
</i18n>

<i18n locale="zh-CN" lang="yaml">
document: 官方文档
documentLink: https://mcdreforged.readthedocs.io/zh_CN/latest/
plugins: 探索插件
</i18n>
