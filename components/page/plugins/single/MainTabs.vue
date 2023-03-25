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
        v-if="requirements.length > 0 || dependencies.length > 0"
        id="relations"
        :label="t('relations.title')"
        name="relations"
    >
      <div
          v-if="requirements.length > 0"
          id="relations-requirements"
      >
        <div class="relations-title">
          {{ t("relations.requirements") }}
        </div>
        <ClientOnly>
          <ElTable :data="requirements">
            <ElTableColumn
                prop="package"
                :label="t('relations.package')"
            />
            <ElTableColumn
                prop="version"
                :label="t('relations.version')"
            />
          </ElTable>
        </ClientOnly>
      </div>
      <div
          v-if="dependencies.length > 0"
          id="relations-dependencies"
      >
        <div class="relations-title">
          {{ t("relations.dependencies") }}
        </div>
        <ClientOnly>
          <ElTable :data="dependencies">
            <ElTableColumn
                prop="plugin"
                :label="t('relations.plugin')"
            >
              <template #default="{row}">
                <PagePluginsBasePluginName :id="row.plugin"/>
              </template>
            </ElTableColumn>
            <ElTableColumn
                prop="version"
                :label="t('relations.version')"
            />
          </ElTable>
        </ClientOnly>
      </div>
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {PluginData, ReleaseInfo, AssetInfo} from "~/types/plugins";

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
const {data: pluginData} = props;

// introduction
const introduction: ComputedRef<string> = computed(() => pluginData.info.introduction[getMCDRLocale()] ?? "");

// releases
interface AdvancedReleaseInfo {
  version: string;
  downloads: number;
  createdAt: string;
  mainAsset: AssetInfo;
  release: ReleaseInfo;
}

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

const releases: AdvancedReleaseInfo[] = pluginData.release.releases.map((release) => ({
  version: release.parsed_version,
  downloads: release.assets.reduce((sum, asset) => sum + asset.download_count, 0),
  createdAt: release.created_at,
  mainAsset: getMainAsset(release),
  release: release,
}));

// requirements
const requirements = pluginData.meta.requirements.map((requirement: string) => {
  const name = /^[^<>=~^]+/.exec(requirement)![0];
  return {
    package: name,
    version: requirement.replace(name, ""),
  };
});

// dependencies
const dependencies = Object
    .entries(pluginData.meta.dependencies)
    .map(([plugin, version]) => ({plugin, version}));

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
function showDrawer(release: AdvancedReleaseInfo) {
  console.log("showDrawer", release);
}

defineExpose({
  showVersionsTab,
  showDrawer,
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
  :deep(.el-table tr:hover>td.el-table__cell) {
    background-color: var(--el-table-tr-bg-color);
  }

  #relations-requirements {
    margin-bottom: 1rem;
  }

  .relations-title {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
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
  package: Package
  plugin: Plugin
  version: Version
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
  package: 包名
  plugin: 插件
  version: 版本
</i18n>
