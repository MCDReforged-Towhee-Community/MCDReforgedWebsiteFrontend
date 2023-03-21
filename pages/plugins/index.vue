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
      <div
          v-for="plugin in plugins"
          v-show="shouldShow(plugin)"
          :key="plugin.id"
          class="box plugins-list-card"
      >
        <div class="plugins-list-card-info">
          <div class="plugins-list-card-title">
            <NuxtLink
                class="plugins-list-card-title-name"
                :to="`/plugins/${plugin.id}`"
            >
              {{ plugin.name }}
            </NuxtLink>
            <br class="hidden-md-and-up">
            <div class="plugins-list-card-title-at">
              @
            </div>
            <div class="plugins-list-card-title-authors">
              <template
                  v-for="(author, index) in plugin.authors"
                  :key="`${plugin.id}_${author.name}`"
              >
                <div v-if="index > 0">{{ ", " }}</div>
                <a
                    class="plugins-list-card-title-authors-name--clickable"
                    :href="author.link"
                    target="_blank"
                >
                  {{ author.name }}
                </a>
              </template>
            </div>
          </div>
          <div class="plugins-list-card-description">
            <BaseMarkdown
                :model-value="getDescription(plugin)"
                a-tag-blank-target
            />
          </div>
          <div class="plugins-list-card-labels">
            <PagePluginsLabels :labels="plugin.labels"/>
          </div>
        </div>
        <div class="plugins-list-card-data">
          <div class="plugins-list-card-data-item">
            <ClientOnly>
              <ElIconStarFilled
                  v-if="votesStore.isVoted(plugin.id)"
                  class="plugins-list-card-data-item-icon"
              />
              <ElIconStar
                  v-else
                  class="plugins-list-card-data-item-icon"
              />
            </ClientOnly>
            <div>
              {{ t("data.votes") }}
            </div>
            <div class="plugins-list-card-data-item-number">
              {{ votesStore.getVotesNumber(plugin.id) }}
            </div>
          </div>
          <div class="plugins-list-card-data-item">
            <ElIconDownload class="plugins-list-card-data-item-icon"/>
            <div>
              {{ t("data.downloads") }}
            </div>
            <div class="plugins-list-card-data-item-number">
              {{ plugin.downloads }}
            </div>
          </div>
          <div
              v-if="plugin.updated_at !== null"
              class="plugins-list-card-data-item"
          >
            <ElIconRefresh class="plugins-list-card-data-item-icon"/>
            <div>
              {{ t("data.updated_at") }}
            </div>
            <div class="plugins-list-card-data-item-number">
              {{ $d(new Date(plugin.updated_at), "text") }}
            </div>
          </div>
        </div>
      </div>
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
const votesStore = usePluginsVotesStore();

// fill the store
// https://github.com/vuejs/pinia/issues/1080
await pluginsStore.nuxtServerInit();
await votesStore.nuxtServerInit();

function getDescription(plugin: PluginDataBrief): string {
  return plugin.description[getMCDRLocale()] ?? "";
}

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
    pluginsList.sort((a, b) => {
      const aVotes = votesStore.getVotesNumber(a.id);
      const bVotes = votesStore.getVotesNumber(b.id);
      return bVotes - aVotes;
    });
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
@import "assets/variables.scss";

#plugins {
  padding: 2rem min(20vw, 20rem);

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media only screen and (width < $size-xl) {
    padding: 1rem;
  }

  @media only screen and (width < $size-lg) {
    flex-direction: column;
  }

  #plugins-search {
    width: 19%;

    position: sticky;
    top: 1rem;

    @media only screen and (width < $size-lg) {
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

    @media only screen and (width < $size-lg) {
      width: 100%;
      margin-bottom: 1rem;

      position: unset;
    }

    .plugins-list-card {
      min-height: 8rem;
      margin-bottom: 1rem;
      color: var(--gray-7);

      display: flex;
      justify-content: space-between;

      @media only screen and (width < $size-md) {
        flex-direction: column;
      }

      .plugins-list-card-info {
        max-width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @media only screen and (width < $size-md) {
          max-width: 100%;
        }

        .plugins-list-card-title {
          * {
            display: inline;
          }

          .plugins-list-card-title-name {
            color: black;
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            overflow-wrap: anywhere;

            &:hover {
              color: var(--blue-6);
              text-decoration: underline;
            }
          }

          .plugins-list-card-title-authors {
            .plugins-list-card-title-authors-name {
              color: var(--gray-7);
              cursor: default;

              &--clickable {
                color: var(--gray-7);
              }

              &--clickable:hover {
                color: var(--blue-6);
              }
            }
          }
        }

        .plugins-list-card-description {
          overflow-wrap: anywhere;

          :deep(.markdown-body) {
            background: unset;
            color: var(--gray-7);
          }
        }
      }

      .plugins-list-card-data {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-end;

        @media only screen and (width < $size-md) {
          margin-top: 1rem;
          display: unset;
        }

        .plugins-list-card-data-item {
          display: flex;
          align-items: center;

          font-size: 1.2rem;
          white-space: nowrap;

          .plugins-list-card-data-item-icon {
            height: 1.2rem;
          }

          .plugins-list-card-data-item-number {
            margin: 0 0.25rem;
            font-weight: bold;
          }
        }
      }
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
data:
  votes: Votes
  downloads: Downloads
  updated_at: Updated At
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
data:
  votes: 喜欢
  downloads: 下载
  updated_at: 更新于
</i18n>
