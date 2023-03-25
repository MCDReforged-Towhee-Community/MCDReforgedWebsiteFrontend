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
          v-model:is-drawer-open="isDrawerOpen"
          v-model:release="advancedReleaseInfo"
      />
      <div
          v-for="release in releases"
          :key="release.version"
          class="version"
          tabindex="0"
          @keydown.enter.self="showDrawer(release)"
          @click="showDrawer(release)"
      >
        <a
            class="version-button"
            tabindex="-1"
            :href="release.mainAsset.browser_download_url"
            download
            @click.stop
        >
          <ElButton
              type="primary"
              :icon="ElIconDownload"
          />
        </a>
        <div class="version-name">
          {{ release.mainAsset.name }}
        </div>
        <div class="version-size">
          {{ formatSize(release.mainAsset.size) }}
        </div>
        <div class="version-data version-downloads">
          <ElIconDownload class="version-icon"/>
          {{ release.downloads }}
        </div>
        <div class="version-data version-created">
          <ElIconCalendar class="version-icon"/>
          {{ $d(new Date(release.createdAt), "text") }}
        </div>
      </div>
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
  ReleaseInfo,
  AssetInfo,
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

/**
 * Get the main asset of a release.
 * @param {ReleaseInfo} release release info.
 * @return {AssetInfo} main asset.
 */
function getMainAsset(release: ReleaseInfo): AssetInfo {
  return release.assets.find(asset => asset.name.endsWith(".mcdr") || asset.name.endsWith(".pyz"))!;
}

/**
 * Format size number to string.
 * @param {number} size size in bytes.
 * @return {string} formatted size.
 */
function formatSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
}

const releases: AdvancedReleaseInfo[] = data.release.releases.map((release) => ({
  version: release.parsed_version,
  downloads: release.assets.reduce((sum, asset) => sum + asset.download_count, 0),
  createdAt: release.created_at,
  mainAsset: getMainAsset(release),
  release: release,
}));

// ----------------------------------------------------------------------------
// release drawer
// ----------------------------------------------------------------------------
const isDrawerOpen = ref<boolean>(false);
const advancedReleaseInfo = ref<AdvancedReleaseInfo | null>(null);

/**
 * Show release drawer.
 */
function showDrawer(release: AdvancedReleaseInfo) {
  isDrawerOpen.value = true;
  advancedReleaseInfo.value = release;
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

#versions {
  .version {
    margin: 0.25rem;
    padding: 0.5rem;
    border-radius: 0.5rem;

    cursor: pointer;

    display: grid;
    grid-template-columns: 1fr 8fr 4fr;

    &:hover {
      background-color: var(--gray-1);
    }

    .version-button {
      grid-column: 1;
      grid-row: 1 / 3;

      margin-right: 1rem;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .version-name {
      grid-column: 2;
      grid-row: 1;

      overflow-wrap: anywhere;
    }

    .version-size {
      grid-column: 2;
      grid-row: 2;
    }

    .version-downloads {
      grid-column: 3;
      grid-row: 1;
    }

    .version-created {
      grid-column: 3;
      grid-row: 2;
    }

    .version-data {
      display: flex;
      align-items: center;
    }

    .version-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }

    @media only screen and (max-width: $size-md) {
      grid-template-columns: 1fr 8fr;

      .version-downloads {
        grid-column: 2;
        grid-row: 3;
      }

      .version-created {
        grid-column: 2;
        grid-row: 4;
      }
    }
  }
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
