<template>
  <ElTabs
      id="tabs"
      class="box"
      v-model="tab"
  >
    <ElTabPane
        id="introduction"
        :label="t('introduction.title')"
        name="introduction"
    >
      <ElSkeleton animated :loading="loading">
        <BaseMarkdown :model-value="introduction" a-tag-blank-target/>
      </ElSkeleton>
    </ElTabPane>
    <ElTabPane
        id="versions"
        :label="t('versions.title')"
        name="versions"
    >
      <PagePluginsBaseReleaseDrawer
          v-if="advancedReleaseInfo !== null"
          v-model:is-drawer-open="isDrawerOpen"
          v-model:advanced-release-info="advancedReleaseInfo"
      />
      <ElEmpty v-if="releases.length === 0"/>
      <PagePluginsBaseFileCard
          v-for="release in releases"
          :key="release.version"
          :name="release.mainAsset.name"
          :size="release.mainAsset.size"
          :downloads="release.downloads"
          :created-at="release.createdAt"
          :download-url="release.mainAsset.browser_download_url"
          @click="showDrawer(release)"
      />
    </ElTabPane>
    <ElTabPane
        v-if="data.meta.requirements.length > 0 || Object.keys(data.meta.dependencies).length > 0"
        id="relations"
        :label="t('relations.title')"
        name="relations"
    >
      <div
          id="relations-requirements"
          v-if="data.meta.requirements.length > 0"
      >
        <div class="relations-title">
          {{ t("relations.requirements") }}
        </div>
        <PagePluginsBaseRequirements :requirements="data.meta.requirements"/>
      </div>
      <div
          id="relations-dependencies"
          v-if="Object.keys(data.meta.dependencies).length > 0"
      >
        <div class="relations-title">
          {{ t("relations.dependencies") }}
        </div>
        <PagePluginsBaseDependcies :dependencies="data.meta.dependencies"/>
      </div>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {
  PluginData,
  AdvancedReleaseInfo,
} from "~/types/plugins";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
const props = defineProps<{
  data: PluginData;
}>();

// ----------------------------------------------------------------------------
// tabs
// ----------------------------------------------------------------------------
type Tab = "introduction" | "versions" | "relations";
const tab: Ref<Tab> = ref("introduction");

// ----------------------------------------------------------------------------
// skeleton loading
// ----------------------------------------------------------------------------
const loading = ref<boolean>(true);

onMounted(() => {
  loading.value = false;
});

// ----------------------------------------------------------------------------
// plugin data
// ----------------------------------------------------------------------------
const {data} = props;

// introduction
const introduction: ComputedRef<string> = computed(() => data.info.introduction[getMCDRLocale()] ?? "");

const releases: AdvancedReleaseInfo[] = data.release.releases.map((release) => ({
  version: release.meta.version,
  downloads: release.asset.download_count,
  createdAt: release.created_at,
  mainAsset: release.asset,
  release: release,
}));

// ----------------------------------------------------------------------------
// release drawer
// ----------------------------------------------------------------------------
const isDrawerOpen = ref<boolean>(false);
const advancedReleaseInfo = ref<AdvancedReleaseInfo | null>(null);
if (releases.length > 0) {
  advancedReleaseInfo.value = releases[0];
}

/**
 * Show release drawer.
 */
function showDrawer(release: AdvancedReleaseInfo) {
  advancedReleaseInfo.value = release;
  isDrawerOpen.value = true;
}

// ----------------------------------------------------------------------------
// exposes
// ----------------------------------------------------------------------------
/**
 * Show versions tab.
 */
function showVersionsTab() {
  tab.value = "versions";
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * Show release drawer.
 */
function viewRelease(tagName: string) {
  let release = releases.find(release => release.release.tag_name === tagName);
  showDrawer(release!);
}

defineExpose({
  showVersionsTab,
  viewRelease,
});
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";

#tabs {
  padding: 1rem 2rem;
}

#relations {
  .relations-title {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
  }

  #relations-requirements {
    margin-bottom: 1rem;
  }
}
</style>

<i18n locale="en-US" lang="yaml">
introduction:
  title: Introduction
versions:
  title: Versions
relations:
  title: Relations
  requirements: Python Requirements
  dependencies: Plugin Dependencies
</i18n>

<i18n locale="zh-CN" lang="yaml">
introduction:
  title: 介绍
versions:
  title: 版本
relations:
  title: 关联
  requirements: Python 依赖
  dependencies: 插件依赖
</i18n>
