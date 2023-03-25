<template>
  <div id="plugin">
    <ElBacktop
        style="left: 40px;"
        :visibility-height="backtopVisibilityHeight"
    />
    <aside id="aside">
      <PagePluginsSingleInfoCard1
          ref="infoCard1"
          :brief="pluginBrief"
      />
      <PagePluginsSingleInfoCard2
          ref="infoCard2"
          :brief="pluginBrief"
          :data="pluginData"
          @view-all="viewAllRelease"
          @view-release="viewRelease"
          @view-asset="viewAsset"
      />
    </aside>
    <main id="main">
      <PagePluginsSingleMainTabs
          ref="mainTabs"
          :data="pluginData"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import {PluginData, PluginDataBrief} from "~/types/plugins";
import {
  PagePluginsSingleInfoCard1,
  PagePluginsSingleInfoCard2,
  PagePluginsSingleMainTabs,
} from "#components";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();
const id = useRoute().params.id as string;

// ----------------------------------------------------------------------------
// component refs
// ----------------------------------------------------------------------------
const infoCard1 = ref<InstanceType<typeof PagePluginsSingleInfoCard1> | null>(null);
const infoCard2 = ref<InstanceType<typeof PagePluginsSingleInfoCard2> | null>(null);
const mainTabs = ref<InstanceType<typeof PagePluginsSingleMainTabs> | null>(null);
const backtopVisibilityHeight = ref(0);

onMounted(() => {
  backtopVisibilityHeight.value = (infoCard1.value!.$el.clientHeight + infoCard2.value!.$el.clientHeight) / 2;
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

// set title
useHead({title: () => `${t("global.title")} - ${pluginBrief.name}`});

// ----------------------------------------------------------------------------
// event handlers
// ----------------------------------------------------------------------------
/**
 * View all release.
 */
function viewAllRelease() {
  mainTabs.value!.showVersionsTab();
}

/**
 * View a release.
 */
function viewRelease(tagName: string) {
  mainTabs.value!.showVersionsTab();
  mainTabs.value!.viewRelease(tagName);
}

/**
 * View an asset.
 */
function viewAsset(tagName: string, assetName: string) {
  mainTabs.value!.showVersionsTab();
  mainTabs.value!.viewRelease(tagName);
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
}
</style>

<i18n locale="en-US" lang="yaml">
error:
  404:
    message: Plugin "{id}" does not exists!
  decreaseVote:
    title: Error
    message: Cannot decrease vote number.
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
</i18n>
