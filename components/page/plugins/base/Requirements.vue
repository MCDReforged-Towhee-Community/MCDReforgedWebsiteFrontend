<template>
  <div>
    <ClientOnly>
      <ElTable :data="requirements">
        <ElTableColumn
            prop="package"
            :label="t('package')"
        />
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
  requirements: string[];
}>();

const requirements = props.requirements.map((requirement: string) => {
  const name = /^[^<>=~^]+/.exec(requirement)![0];
  return {
    package: name,
    version: requirement.replace(name, ""),
  };
});
</script>

<style scoped lang="scss">
:deep(.el-table tr:hover>td.el-table__cell) {
  background-color: var(--el-table-tr-bg-color);
}
</style>

<i18n locale="en-US" lang="yaml">
package: Package
version: Version
</i18n>

<i18n locale="zh-CN" lang="yaml">
package: 包名
version: 版本
</i18n>
