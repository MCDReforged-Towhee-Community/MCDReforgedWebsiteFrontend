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
            :label="t('main.versions')"
            name="versions"
        >
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
                  <template #default="scope">
                    <PagePluginsPluginName :id="scope.row.plugin"/>
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
import {PluginData, PluginDataBrief} from "~/types/plugins";
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
const pluginData: PluginData = await pluginsStore.getPluginData(id) as PluginData;
const pluginBrief: PluginDataBrief = pluginsStore.getPluginDataBrief(id) as PluginDataBrief;

// introduction
const introduction: ComputedRef<string> = computed(() => pluginData.info.introduction[getMCDRLocale()] ?? "");

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
// tab
// ----------------------------------------------------------------------------
type Tab = "introduction" | "versions" | "relations";
const tab: Ref<Tab> = ref("introduction");

// ----------------------------------------------------------------------------
// event handlers
// ----------------------------------------------------------------------------
/**
 * View all release.
 */
function viewAllRelease() {
  tab.value = "versions";
}

/**
 * View a release.
 */
function viewRelease(tagName: string) {
  console.log("view release", tagName);
}

/**
 * View an asset.
 */
function viewAsset(tagName: string, assetName: string) {
  console.log("view asset", tagName, assetName);
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
  versions: Versions
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
  versions: 版本
  relations:
    title: 关联
    requirements: Python 依赖
    dependencies: 插件依赖
    package: 包名
    plugin: 插件
    version: 版本
</i18n>
