<template>
  <div id="plugin">
    <div id="aside">
    </div>
    <div id="main">
    </div>
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
const votesStore = usePluginsVotesStore();

// fill the store
// https://github.com/vuejs/pinia/issues/1080
await pluginsStore.nuxtServerInit();
await votesStore.nuxtServerInit();

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
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.box {
  margin-bottom: 1rem;
  padding: 1rem;
  box-sizing: border-box;

  border-radius: 1rem;
  box-shadow: $shadow-basic;

  background: var(--gray-2);
}

#plugin {
  padding: 2rem min(20vw, 20rem);

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media only screen and (width < $size-xl) {
    padding: 1rem;
  }

  @media only screen and (width < $size-md) {
    flex-direction: column;
  }
}

#aside {
  width: 19%;

  @media only screen and (width < $size-md) {
    width: 100%;
    margin-bottom: 1rem;
  }
}

#main {
  width: 80%;

  @media only screen and (width < $size-md) {
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