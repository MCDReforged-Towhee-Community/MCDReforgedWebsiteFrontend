<template>
  <div id="plugin">
    <ElBacktop
        style="left: 40px;"
        :visibility-height="backtopVisibilityHeight"
    />
    <aside id="aside">
      <PagePluginsInfoCard1
          ref="infoCard1"
          :brief="pluginBrief"
      />
      <PagePluginsInfoCard2
          ref="infoCard2"
          :brief="pluginBrief"
          :data="pluginData"
          @view-all="viewAllRelease"
          @view-release="viewRelease"
          @view-asset="viewAsset"
      />
    </aside>
    <main id="main">
      <ElTabs
          id="main-tabs"
          class="box"
          v-model="tab"
      >
        <ElTabPane
            id="main-tabs-introduction"
            :label="t('main.introduction')"
            name="introduction"
        >
          <ElSkeleton animated :loading="loading">
            <BaseMarkdown :model-value="introduction" a-tag-blank-target/>
          </ElSkeleton>
        </ElTabPane>
        <ElTabPane
            id="main-tabs-versions"
            :label="t('main.versions.title')"
            name="versions"
        >
          <div
              v-for="release in releases"
              :key="release.version"
              class="main-tabs-versions-item"
              tabindex="0"
              @keydown.enter.self="showDrawer(release)"
              @click="showDrawer(release)"
          >
            <div class="main-tabs-versions-item-name">
              <a
                  class="main-tabs-versions-item-name-button"
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
              <div>
                <div>
                  {{ release.mainAsset.name }}
                </div>
                <div>
                  {{ formatSize(release.mainAsset.size) }}
                </div>
              </div>
            </div>
            <div class="main-tabs-versions-item-data">
              <div>
                <ElIconDownload class="main-tabs-versions-item-icon"/>
                {{ release.downloads }}
              </div>
              <div>
                <ElIconCalendar class="main-tabs-versions-item-icon"/>
                {{ $d(new Date(release.createdAt), "text") }}
              </div>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane
            v-if="requirements.length > 0 || dependencies.length > 0"
            id="main-tabs-relations"
            :label="t('main.relations.title')"
            name="relations"
        >
          <div
              v-if="requirements.length > 0"
              id="main-tabs-relations-requirements"
          >
            <div class="main-tabs-relations-title">
              {{ t("main.relations.requirements") }}
            </div>
            <ClientOnly>
              <ElTable :data="requirements">
                <ElTableColumn
                    prop="package"
                    :label="t('main.relations.package')"
                />
                <ElTableColumn
                    prop="version"
                    :label="t('main.relations.version')"
                />
              </ElTable>
            </ClientOnly>
          </div>
          <div
              v-if="dependencies.length > 0"
              id="main-tabs-relations-dependencies"
          >
            <div class="main-tabs-relations-title">
              {{ t("main.relations.dependencies") }}
            </div>
            <ClientOnly>
              <ElTable :data="dependencies">
                <ElTableColumn
                    prop="plugin"
                    :label="t('main.relations.plugin')"
                >
                  <template #default="{row}">
                    <PagePluginsPluginName :id="row.plugin"/>
                  </template>
                </ElTableColumn>
                <ElTableColumn
                    prop="version"
                    :label="t('main.relations.version')"
                />
              </ElTable>
            </ClientOnly>
          </div>
        </ElTabPane>
      </ElTabs>
    </main>
  </div>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {
  ReleaseInfo,
  AssetInfo,
  PluginData,
  PluginDataBrief,
} from "~/types/plugins";
import {PagePluginsInfoCard1, PagePluginsInfoCard2} from "#components";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();
const id = useRoute().params.id as string;

// ----------------------------------------------------------------------------
// component refs
// ----------------------------------------------------------------------------
const infoCard1 = ref<InstanceType<typeof PagePluginsInfoCard1> | null>(null);
const infoCard2 = ref<InstanceType<typeof PagePluginsInfoCard2> | null>(null);
const backtopVisibilityHeight = ref(0);

onMounted(() => {
  backtopVisibilityHeight.value = (infoCard1.value!.$el.clientHeight + infoCard2.value!.$el.clientHeight) / 2;
});

// ----------------------------------------------------------------------------
// main box loading
// ----------------------------------------------------------------------------
const loading = ref<boolean>(true);

onMounted(() => {
  loading.value = false;
});

// ----------------------------------------------------------------------------
// votes store
// ----------------------------------------------------------------------------
const pluginsStore = usePluginsStore();

// fill the store
// https://github.com/vuejs/pinia/issues/1080
await pluginsStore.nuxtServerInit();

// update votes on mounted
onMounted(() => {
  pluginsStore.updatePluginVotes();
});

// check if plugin exists
if (!pluginsStore.exists(id)) {
  showError({
    statusCode: 404,
    message: t("error.404.message", {id}),
  });
}

// ----------------------------------------------------------------------------
// plugin data
// ----------------------------------------------------------------------------
interface AdvancedReleaseInfo {
  version: string;
  downloads: number;
  createdAt: string;
  mainAsset: AssetInfo;
  release: ReleaseInfo;
}

const pluginData: PluginData = await pluginsStore.getPluginData(id) as PluginData;
const pluginBrief: PluginDataBrief = pluginsStore.getPluginDataBrief(id) as PluginDataBrief;

// introduction
const introduction: ComputedRef<string> = computed(() => pluginData.info.introduction[getMCDRLocale()] ?? "");

// releases
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

// ----------------------------------------------------------------------------
// tab
// ----------------------------------------------------------------------------
type Tab = "introduction" | "versions" | "relations";
const tab: Ref<Tab> = ref("introduction");

// ----------------------------------------------------------------------------
// event handlers
// ----------------------------------------------------------------------------
/**
 * Show versions tab.
 */
function showVersionsTab() {
  tab.value = "versions";
}

/**
 * View all release.
 */
function viewAllRelease() {
  showVersionsTab();
}

/**
 * View a release.
 */
function viewRelease(tagName: string) {
  showVersionsTab();
  console.log("view release", tagName);
}

/**
 * View an asset.
 */
function viewAsset(tagName: string, assetName: string) {
  showVersionsTab();
  console.log("view asset", tagName, assetName);
}

/**
 * Show drawer of a release.
 */
function showDrawer(release: AdvancedReleaseInfo) {
  console.log("showDrawer", release);
}
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";

#plugin {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media only screen and (max-width: $size-lg) {
    flex-direction: column;
  }
}

#aside {
  width: 29%;

  display: grid;
  grid-gap: 1rem;

  @media only screen and (max-width: $size-lg) {
    width: 100%;
    margin-bottom: 1rem;
  }
}

#main {
  width: 70%;

  @media only screen and (max-width: $size-lg) {
    width: 100%;
  }

  #main-tabs {
    padding: 1rem 2rem;

    #main-tabs-versions {
      .main-tabs-versions-item {
        margin: 0.5rem 1rem;
        padding: 0.5rem;
        border-radius: 0.5rem;

        cursor: pointer;

        display: flex;
        justify-content: space-between;

        &:hover {
          background-color: var(--gray-1);
        }

        .main-tabs-versions-item-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
        }

        .main-tabs-versions-item-name {
          display: flex;
          align-items: center;

          .main-tabs-versions-item-name-button {
            margin-right: 1rem;
          }
        }

        .main-tabs-versions-item-data {
          width: 11rem;
        }
      }
    }

    #main-tabs-relations {
      :deep(.el-table tr:hover>td.el-table__cell) {
        background-color: var(--el-table-tr-bg-color);
      }

      #main-tabs-relations-requirements {
        margin-bottom: 1rem;
      }

      .main-tabs-relations-title {
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
error:
  404:
    message: Plugin "{id}" does not exists!
  decreaseVote:
    title: Error
    message: Cannot decrease vote number.
main:
  introduction: Introduction
  versions:
    title: Versions
    name: Name
    size: Size
    downloads: Downloads
  relations:
    title: Relations
    requirements: Python Requirements
    dependencies: Plugin Dependencies
    package: Package
    plugin: Plugin
    version: Version
</i18n>

<i18n locale="zh-CN" lang="yaml">
error:
  404:
    message: 插件 "{id}" 不存在！
  increaseVote:
    title: 错误
    message: 无法增加投票数。
  decreaseVote:
    title: 错误
    message: 无法减少投票数。
main:
  introduction: 介绍
  versions:
    title: 版本
    name: 文件名
    size: 大小
    downloads: 下载量
  relations:
    title: 关联
    requirements: Python 依赖
    dependencies: 插件依赖
    package: 包名
    plugin: 插件
    version: 版本
</i18n>
