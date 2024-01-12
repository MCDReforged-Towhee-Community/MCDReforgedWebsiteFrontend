<template>
  <div id="plugins">
    <ElBacktop style="left: 40px;"/>
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
          clearable
          :prefix-icon="ElIconSearch"
      />
      <ElInput
          v-model="searchSetting.author"
          class="plugins-search-item"
          :placeholder="t('search.author')"
          clearable
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
          <PagePluginsBaseLabel :label="label"/>
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
            v-for="sorting in SEARCH_SORTS"
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
      <div>
        {{ t("search.selected") }}
      </div>
      <ElCheckbox
          v-model="searchSetting.selected"
          class="plugins-search-item"
          :label="t('search.selected')"
      />
    </div>
    <div id="plugins-list">
      <TransitionGroup
          name="plugins-list"
          tag="div"
          v-infinite-scroll="load"
      >
        <PagePluginsIndexBriefCard
            v-for="plugin in plugins"
            :key="plugin.id"
            :brief="plugin"
            :is-selected="selectedPlugins.includes(plugin.id)"
            @switch-selected="switchSelected"
        />
      </TransitionGroup>
    </div>
    <Transition name="fade">
      <div
          id="plugins-toolbar"
          class="box"
          v-show="selectedPlugins.length > 0"
      >
        <ElTooltip
            :content="t('downloadAll')"
            placement="top"
        >
          <ElBadge :value="selectedPlugins.length" type="primary">
            <ElButton
                class="plugins-toolbar-button"
                @click="downloadAll"
            >
              <ElIconDownload class="plugins-toolbar-button-icon"/>
            </ElButton>
          </ElBadge>
        </ElTooltip>
      </div>
    </Transition>
  </div>
  <TheFooter/>
</template>

<script setup lang="ts">
import {
  LABELS,
  Label,
  PluginDataBrief,
  PluginDataBriefSummary,
  SEARCH_SORTS,
} from "~/types/plugins";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

// title
useHead({title: () => t("title")});

// ----------------------------------------------------------------------------
// pinia stores
// ----------------------------------------------------------------------------
const pluginsStore = usePluginsStore();

// fill the store
// https://github.com/vuejs/pinia/issues/1080
await pluginsStore.nuxtServerInit();

// ----------------------------------------------------------------------------
// infinite scroll
// ----------------------------------------------------------------------------
const limit = ref(10);
let maxLimit = 0;

function load() {
  if (limit.value <= maxLimit - 10) {
    limit.value += 10;
  } else if (limit.value < maxLimit) {
    limit.value = maxLimit;
  }
}

// ----------------------------------------------------------------------------
// search
// ----------------------------------------------------------------------------
// search setting
const searchSetting = computed({
  get: () => pluginsStore.$state.searchSetting,
  set: (value) => pluginsStore.setSearchSetting(value),
});

// searched list
const plugins = computed(() => {
  // filter
  let pluginsList = Object.values(pluginsStore.$state.pluginDataBriefSummary as PluginDataBriefSummary).filter((plugin) => shouldShow(plugin));
  maxLimit = pluginsList.length;

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

  // selected
  if (searchSetting.value.selected) {
    pluginsList = pluginsList.filter((plugin) => selectedPlugins.value.includes(plugin.id));
  }

  return pluginsList.slice(0, limit.value);
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

// ----------------------------------------------------------------------------
// selected plugins
// ----------------------------------------------------------------------------
// selected plugins
const selectedPlugins = computed({
  get: () => pluginsStore.$state.selectedPlugins,
  set: (value) => pluginsStore.setSelectedPlugins(value),
});

function switchSelected(id: string, selected: boolean) {
  if (selected) {
    selectedPlugins.value.push(id);
  } else {
    selectedPlugins.value = selectedPlugins.value.filter((pluginId) => pluginId !== id);
  }
}

function downloadAll() {
  for (const plugin of selectedPlugins.value) {
    new MCDRPlugin(plugin).downloadLatest(true);
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";

#plugins {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

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
      transform: translateY(10%);
    }

    .plugins-list-leave-active {
      position: absolute;
    }
  }

  #plugins-toolbar {
    height: 4rem;
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);

    display: grid;
    grid-auto-flow: column;
    grid-gap: 1rem;

    color: white;
    background: var(--gray-10);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .plugins-toolbar-button {
    width: 2rem;
    height: 2rem;
    border: unset;
    background: unset;

    .plugins-toolbar-button-icon {
      width: 1.5rem;
      height: 1.5rem;
      color: white;

      &:hover {
        color: var(--blue-5);
      }
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
title: MCDR Plugin Catalogue
search:
  title: Filter
  name: Name
  author: Author
  labels: Labels
  sorting: Sorting
  reverse: Reverse
  selected: Selected Plugins Only
sorting:
  name: Name
  author: Author
  votes: Votes
  updated_at: Updated At
  downloads: Downloads
downloadAll: Download All Selected Plugins
</i18n>

<i18n locale="zh-CN" lang="yaml">
title: MCDR 插件目录
search:
  title: 搜索
  name: 名称
  author: 作者
  labels: 标签
  sorting: 排序
  reverse: 倒序
  selected: 仅显示已选插件
sorting:
  name: 名称
  author: 作者
  votes: 喜欢
  updated_at: 最后更新
  downloads: 下载量
downloadAll: 下载所有选中插件
</i18n>
