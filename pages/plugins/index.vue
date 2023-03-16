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
            v-for="label in ['information', 'tool', 'management', 'api']"
            :key="label"
            :label="label"
        >
          <div class="plugins-search-item-labels-checkbox">
            <ElIconInfoFilled
                v-if="label === 'information'"
                class="label-icon"
            />
            <ElIconTools
                v-if="label === 'tool'"
                class="label-icon"
            />
            <ElIconUserFilled
                v-if="label === 'management'"
                class="label-icon"
            />
            <ElIconShare
                v-if="label === 'api'"
                class="label-icon"
            />
            <div>
              {{ t(`labels.${label}`) }}
            </div>
          </div>
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
    <ClientOnly>
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
              <br class="hidden-sm-and-up">
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
              {{ plugin.description[getMCDRLocale()] }}
            </div>
            <div class="plugins-list-card-labels">
              <div
                  v-if="plugin.labels.includes('information')"
                  class="plugins-list-card-labels-label"
              >
                <ElIconInfoFilled class="label-icon"/>
                {{ t("labels.information") }}
              </div>
              <div
                  v-if="plugin.labels.includes('tool')"
                  class="plugins-list-card-labels-label"
              >
                <ElIconTools class="label-icon"/>
                {{ t("labels.tool") }}
              </div>
              <div
                  v-if="plugin.labels.includes('management')"
                  class="plugins-list-card-labels-label"
              >
                <ElIconUserFilled class="label-icon"/>
                {{ t("labels.management") }}
              </div>
              <div
                  v-if="plugin.labels.includes('api')"
                  class="plugins-list-card-labels-label"
              >
                <ElIconShare class="label-icon"/>
                {{ t("labels.api") }}
              </div>
            </div>
          </div>
          <div class="plugins-list-card-data">
            <div class="plugins-list-card-data-item">
              <ElIconStarFilled
                  v-if="isVoted(plugin.id)"
                  class="plugins-list-card-data-item-icon"
              />
              <ElIconStar
                  v-else
                  class="plugins-list-card-data-item-icon"
              />
              <div>
                {{ t("data.votes") }}
              </div>
              <div class="plugins-list-card-data-item-number">
                {{ plugin.id in votes ? votes[plugin.id].vote : 0 }}
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
                {{ $d(new Date(plugin.updated_at)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {PluginDataBrief, PluginDataBriefSummary} from "~/types/plugins";
import {VotesData} from "~/composables/useLeanCloud";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

// ----------------------------------------------------------------------------
// plugins store
// ----------------------------------------------------------------------------
const pluginsStore = usePluginsStore();
await pluginsStore.nuxtServerInit();

// ----------------------------------------------------------------------------
// lean cloud
// ----------------------------------------------------------------------------

// votes
let votes: VotesData = {};
if (process.client) {
  votes = await useLeanCloud().fetchVotes();
}

// plugins local storage
const {isVoted} = useLocalStoragePlugins();

// ----------------------------------------------------------------------------
// search
// ----------------------------------------------------------------------------

interface SearchSettingType {
  name: string;
  author: string;
  labels: string[];
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
  let pluginsList = Object.values(pluginsStore.$state.plugins as PluginDataBriefSummary).filter((plugin) => shouldShow(plugin));

  // sort
  if (searchSetting.value.sorting === "name") {
    pluginsList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (searchSetting.value.sorting === "author") {
    pluginsList.sort((a, b) => a.authors[0].name.localeCompare(b.authors[0].name));
  } else if (searchSetting.value.sorting === "votes") {
    pluginsList.sort((a, b) => {
      const aVotes = a.id in votes ? votes[a.id].vote : 0;
      const bVotes = b.id in votes ? votes[b.id].vote : 0;
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
    if (!searchSetting.value.labels.every((label: string) => plugin.labels.includes(label))) {
      return false;
    }
  }

  return true;
}
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

#plugins {
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

  .box {
    padding: 1rem;
    box-sizing: border-box;

    border-radius: 1rem;
    box-shadow: $shadow-basic;

    background: var(--gray-2);
  }

  #plugins-search {
    width: 19%;

    position: sticky;
    top: 1rem;

    @media only screen and (width < $size-md) {
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

      .plugins-search-item-labels-checkbox {
        display: flex;
      }
    }
  }

  #plugins-list {
    width: 80%;

    @media only screen and (width < $size-md) {
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
        }

        .plugins-list-card-labels {
          display: flex;

          .plugins-list-card-labels-label {
            margin-right: 0.5rem;

            color: var(--brown-8);

            display: flex;
            align-items: center;
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

.label-icon {
  height: 1rem;
  margin-right: 0.2rem;
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
labels:
  information: Information
  tool: Tool
  management: Management
  api: API
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
labels:
  information: 信息
  tool: 工具
  management: 管理
  api: API
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
