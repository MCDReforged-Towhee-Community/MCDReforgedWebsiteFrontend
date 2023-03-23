<template>
  <div id="plugin">
    <aside id="aside">
      <PagePluginsInfoCard1 :brief="pluginBrief"/>
      <PagePluginsInfoCard2
          :brief="pluginBrief"
          :data="pluginData"
          @view-all="viewAllRelease"
          @view-release="viewRelease"
          @view-asset="viewAsset"
      />
    </aside>
    <main id="main">
    </main>
  </div>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {PluginData, PluginDataBrief} from "~/types/plugins";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();
const id = useRoute().params.id as string;

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

// ----------------------------------------------------------------------------
// event handlers
// ----------------------------------------------------------------------------
/**
 * View all release.
 */
function viewAllRelease() {
  console.log("view all release");
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
