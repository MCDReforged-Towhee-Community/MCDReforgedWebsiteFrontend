<template>
  <ElDrawer
      :model-value="isDrawerOpen"
      append-to-body
      size="50%"
      :title="advancedReleaseInfo?.version ?? ''"
      @closed="$emit('update:isDrawerOpen', false)"
  >
    <ElCollapse v-model="activeCollapses">
      <ElCollapseItem
          name="meta"
          :title="t('meta')"
      >
      </ElCollapseItem>
      <ElCollapseItem
          name="description"
          :title="t('description')"
      >
        <BaseMarkdown
            :model-value="advancedReleaseInfo?.release.description ?? ''"
            a-tag-blank-target
        />
      </ElCollapseItem>
      <ElCollapseItem
          name="files"
          :title="t('files')"
      >
        <PagePluginsBaseFileCard
            v-for="asset in advancedReleaseInfo?.release.assets"
            :key="asset.name"
            :name="asset.name"
            :size="asset.size"
            :downloads="asset.download_count"
            :created-at="asset.created_at"
            :download-url="asset.browser_download_url"
        />
      </ElCollapseItem>
      <ElCollapseItem
          name="requirements"
          :title="t('requirements')"
          v-if="requirements.length > 0"
      >
        <PagePluginsBaseRequirements :requirements="requirements"/>
      </ElCollapseItem>
      <ElCollapseItem
          name="dependencies"
          :title="t('dependencies')"
          v-if="Object.keys(dependencies).length > 0"
      >
        <PagePluginsBaseDependcies :dependencies="dependencies"/>
      </ElCollapseItem>
    </ElCollapse>
  </ElDrawer>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {AdvancedReleaseInfo} from "~/types/plugins";

const {t} = useI18n();

interface Props {
  isDrawerOpen: boolean;
  advancedReleaseInfo: AdvancedReleaseInfo | null;
}

const props = withDefaults(defineProps<Props>(), {
  isDrawerOpen: false,
})
const {isDrawerOpen, advancedReleaseInfo} = toRefs(props);
const requirements: ComputedRef<string[]> = computed(() => advancedReleaseInfo.value?.release.meta.requirements ?? []);
const dependencies: ComputedRef<Record<string, string>> = computed(() => advancedReleaseInfo.value?.release.meta.dependencies ?? {});

const activeCollapses = ref(["meta", "description", "files"]);

defineEmits([
  "update:isDrawerOpen",
  "update:release",
]);
</script>

<style scoped lang="scss">
</style>

<i18n locale="en-US" lang="yaml">
meta: Meta
description: Description
files: Files
requirements: Requirements
dependencies: Dependencies
</i18n>

<i18n locale="zh-CN" lang="yaml">
meta: 元数据
description: 描述
files: 文件
requirements: Python 依赖
dependencies: 插件依赖
</i18n>
