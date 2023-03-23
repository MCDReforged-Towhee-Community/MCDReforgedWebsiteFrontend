<template>
  <footer id="footer">
    <div>
      {{ t("notice") }}
    </div>
    <div>
      Copyright © 2023 Andy Zhang. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const {t} = useI18n();
</script>

<style scoped lang="scss">
#footer {
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<i18n locale="en-US" lang="yaml">
notice: Please be aware that this is NOT the official website of MCDReforged or its community.
</i18n>

<i18n locale="zh-CN" lang="yaml">
notice: 请注意这不是 MCDReforged 或社区的官方网站。
</i18n>
