<template>
  <div id="plugins">
    <div
        id="plugins-search"
        class="box"
    >
      <div id="plugins-search-title">
        {{ t("search.title") }}
      </div>
      <ElInput
          v-model="searchSetting.name"
          class="plugins-search-item"
          :placeholder="t('search.name')"
          :prefix-icon="ElIconSearch"
      />
      <ElInput
          v-model="searchSetting.author"
          class="plugins-search-item"
          :placeholder="t('search.author')"
          :prefix-icon="ElIconAvatar"
      />
      <div>
        {{ t("search.labels") }}
      </div>
      <ElCheckboxGroup
          id="plugins-search-item-labels"
          v-model="searchSetting.labels"
          class="plugins-search-item"
      >
        <ElCheckbox
            v-for="label in LABELS"
            :key="label"
            :label="label"
        >
          <PagePluginsLabel :label="label"/>
        </ElCheckbox>
      </ElCheckboxGroup>
      <div>
        {{ t("search.sorting") }}
      </div>
      <ElSelect
          v-model="searchSetting.sorting"
          class="plugins-search-item"
          :placeholder="t('search.sorting')"
      >
        <ElOption
            v-for="sorting in ['name', 'author', 'votes', 'updated_at', 'downloads']"
            :key="sorting"
            :label="t(`sorting.${sorting}`)"
            :value="sorting"
        />
      </ElSelect>
      <div>
        {{ t("search.reverse") }}
      </div>
      <ElCheckbox
          v-model="searchSetting.reverse"
          class="plugins-search-item"
          :label="t('search.reverse')"
      />
    </div>
    <div id="plugins-list">
      <TransitionGroup
          name="plugins-list"
          tag="div"
      >
        <PagePluginsIndexBriefCard
            v-for="plugin in plugins"
            :key="plugin.id"
            :brief="plugin"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LABELS,
  Label,
  PluginDataBrief,
  PluginDataBriefSummary,
} from "~/types/plugins";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

// ----------------------------------------------------------------------------
// pinia stores
// ----------------------------------------------------------------------------
const pluginsStore = usePluginsStore();

// fill the store
// https://github.com/vuejs/pinia/issues/1080
await pluginsStore.nuxtServerInit();

// update votes on mounted
onMounted(() => {
  pluginsStore.updatePluginVotes();
});

// ----------------------------------------------------------------------------
// search
// ----------------------------------------------------------------------------

interface SearchSettingType {
  name: string;
  author: string;
  labels: Label[];
  sorting: "name" | "author" | "votes" | "updated_at" | "downloads";
  reverse: boolean;
}

// search setting model
const searchSetting: Ref<SearchSettingType> = ref({
  name: "",
  author: "",
  labels: [],
  sorting: "votes",
  reverse: false,
}) as Ref<SearchSettingType>;

// searched list
const plugins = computed(() => {
  // filter
  let pluginsList = Object.values(pluginsStore.$state.pluginDataBriefSummary as PluginDataBriefSummary).filter((plugin) => shouldShow(plugin));

  // sort
  if (searchSetting.value.sorting === "name") {
    pluginsList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (searchSetting.value.sorting === "author") {
    pluginsList.sort((a, b) => a.authors[0].name.localeCompare(b.authors[0].name));
  } else if (searchSetting.value.sorting === "votes") {
    pluginsList.sort((a, b) => b.votes - a.votes);
  } else if (searchSetting.value.sorting === "updated_at") {
    pluginsList.sort((a, b) => {
      const aUpdatedAt = new Date(a.updated_at ?? 0);
      const bUpdatedAt = new Date(b.updated_at ?? 0);
      return bUpdatedAt.getTime() - aUpdatedAt.getTime();
    });
  } else if (searchSetting.value.sorting === "downloads") {
    pluginsList.sort((a, b) => b.downloads - a.downloads);
  }

  // reverse
  if (searchSetting.value.reverse) {
    pluginsList.reverse()
  }

  return pluginsList;
});

function shouldShow(plugin: PluginDataBrief): boolean {
  // name
  if (searchSetting.value.name) {
    const pluginName = plugin.name.toLowerCase();
    let shouldHideFlag = false;
    for (const name of searchSetting.value.name.toLowerCase().split(" ")) {
      if (!pluginName.includes(name)) {
        shouldHideFlag = true;
      }
    }
    if (shouldHideFlag) {
      return false;
    }
  }

  // author
  if (searchSetting.value.author) {
    const pluginAuthors = plugin.authors.map((author) => author.name.toLowerCase());
    let shouldHideFlag = false;
    for (const author of searchSetting.value.author.toLowerCase().split(" ")) {
      if (!pluginAuthors.some((pluginAuthor) => pluginAuthor.includes(author))) {
        shouldHideFlag = true;
      }
    }
    if (shouldHideFlag) {
      return false;
    }
  }

  // labels
  if (searchSetting.value.labels.length > 0) {
    if (!searchSetting.value.labels.every((label: Label) => plugin.labels.includes(label))) {
      return false;
    }
  }

  return true;
}
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";

#plugins {
  padding: 2rem min(20vw, 20rem);

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media only screen and (max-width: $size-xl) {
    padding: 1rem;
  }

  @media only screen and (max-width: $size-lg) {
    flex-direction: column;
  }

  #plugins-search {
    width: 19%;

    position: sticky;
    top: 1rem;

    @media only screen and (max-width: $size-lg) {
      width: 100%;
      margin-bottom: 1rem;

      position: unset;
    }

    #plugins-search-title {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
    }

    .plugins-search-item {
      margin-bottom: 0.5rem;
    }

    #plugins-search-item-labels {
      display: flex;
      flex-direction: column;
    }
  }

  #plugins-list {
    width: 80%;
    position: relative;

    @media only screen and (max-width: $size-lg) {
      width: 100%;
      margin-bottom: 1rem;

      position: unset;
    }

    .plugins-list-move,
    .plugins-list-enter-active,
    .plugins-list-leave-active {
      transition: all 0.5s ease;
    }

    .plugins-list-enter-from,
    .plugins-list-leave-to {
      opacity: 0;
      transform: translateX(10%);
    }

    .plugins-list-leave-active {
      position: absolute;
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
search:
  title: Filter
  name: Name
  author: Author
  labels: Labels
  sorting: Sorting
  reverse: Reverse
sorting:
  name: Name
  author: Author
  votes: Votes
  updated_at: Updated At
  downloads: Downloads
</i18n>

<i18n locale="zh-CN" lang="yaml">
search:
  title: 搜索
  name: 名称
  author: 作者
  labels: 标签
  sorting: 排序
  reverse: 倒序
sorting:
  name: 名称
  author: 作者
  votes: 喜欢
  updated_at: 最后更新
  downloads: 下载量
</i18n>
