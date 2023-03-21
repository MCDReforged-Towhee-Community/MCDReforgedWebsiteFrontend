<template>
  <ElTag>
    <div
        v-if="label === 'information'"
        class="label"
    >
      <ElIconInfoFilled class="label-icon"/>
      <div class="label-text">{{ t("information") }}</div>
    </div>
    <div
        v-if="label === 'tool'"
        class="label"
    >
      <ElIconTools class="label-icon"/>
      <div class="label-text">{{ t("tool") }}</div>
    </div>
    <div
        v-if="label === 'management'"
        class="label"
    >
      <ElIconUserFilled class="label-icon"/>
      <div class="label-text">{{ t("management") }}</div>
    </div>
    <div
        v-if="label === 'api'"
        class="label"
    >
      <ElIconShare class="label-icon"/>
      <div class="label-text">{{ t("api") }}</div>
    </div>
  </ElTag>
</template>

<script setup lang="ts">
import {Label} from "~/types/plugins";

const {t} = useI18n();

defineProps<{
  label: Label;
}>();
</script>

<style scoped lang="scss">
.label {
  display: flex;
  align-items: center;

  .label-icon {
    height: 1rem;
    margin-right: 0.2rem;
  }
}
</style>

<i18n locale="en-US" lang="yaml">
information: Information
tool: Tool
management: Management
api: API
</i18n>

<i18n locale="zh-CN" lang="yaml">
information: 信息
tool: 工具
management: 管理
api: API
</i18n>
