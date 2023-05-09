<template>
  <div>
    <ClientOnly>
      <ElTable :data="dependencies">
        <ElTableColumn
            prop="plugin"
            :label="t('plugin')"
        >
          <template #default="{row}">
            <PagePluginsBasePluginName :id="row.plugin"/>
          </template>
        </ElTableColumn>
        <ElTableColumn
            prop="version"
            :label="t('version')"
        />
      </ElTable>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const {t} = useI18n();

const props = defineProps<{
  dependencies: Record<string, string>;
}>();

const dependencies = computed(() => Object
  .entries(props.dependencies)
  .map(([plugin, version]) => ({plugin, version})));
</script>

<style scoped lang="scss">
:deep(.el-table tr:hover>td.el-table__cell) {
  background-color: var(--el-table-tr-bg-color);
}
</style>

<i18n locale="en-US" lang="yaml">
plugin: Plugin
version: Version
</i18n>

<i18n locale="zh-CN" lang="yaml">
plugin: 插件
version: 版本
</i18n>
