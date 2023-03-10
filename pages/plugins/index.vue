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
      <!--<div>-->
      <!--  {{ t("search.labels") }}-->
      <!--</div>-->
      <!--<ElCheckboxGroup-->
      <!--    id="plugins-search-item-labels"-->
      <!--    v-model="searchSetting.labels"-->
      <!--    class="plugins-search-item"-->
      <!--&gt;-->
      <!--  <ElCheckbox-->
      <!--      v-for="label in ['information', 'tool', 'management', 'api']"-->
      <!--      :key="label"-->
      <!--      :label="label"-->
      <!--  >-->
      <!--    <div class="plugins-search-item-labels-checkbox">-->
      <!--      <ElIconInfoFilled-->
      <!--          v-if="label === 'information'"-->
      <!--          class="label-icon"-->
      <!--      />-->
      <!--      <ElIconTools-->
      <!--          v-if="label === 'tool'"-->
      <!--          class="label-icon"-->
      <!--      />-->
      <!--      <ElIconUserFilled-->
      <!--          v-if="label === 'management'"-->
      <!--          class="label-icon"-->
      <!--      />-->
      <!--      <ElIconShare-->
      <!--          v-if="label === 'api'"-->
      <!--          class="label-icon"-->
      <!--      />-->
      <!--      <div>-->
      <!--        {{ t(`labels.${label}`) }}-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </ElCheckbox>-->
      <!--</ElCheckboxGroup>-->
      <div>
        {{ t("search.sorting") }}
      </div>
      <ElSelect
          v-model="searchSetting.sorting"
          class="plugins-search-item"
          :placeholder="t('search.sorting')"
      >
        <ElOption
            v-for="sorting in ['name', 'author', 'votes']"
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
                  class="plugins-list-card-title-name clickable--underline"
                  :to="`/plugins/${plugin.id}`"
              >
                {{ plugin.name }}
              </NuxtLink>
              <br class="hidden-sm-and-up">
              <div class="plugins-list-card-title-at">
                @
              </div>
              <div class="plugins-list-card-title-authors">
                {{ plugin.authors.join(", ") }}
              </div>
            </div>
            <div class="plugins-list-card-description">
              {{ plugin.description[getMCDRLocale()] }}
            </div>
            <!--<div class="plugins-list-card-labels">-->
            <!--  <div-->
            <!--      v-if="plugin.labels.includes('information')"-->
            <!--      class="plugins-list-card-labels-label"-->
            <!--  >-->
            <!--    <ElIconInfoFilled class="label-icon"/>-->
            <!--    {{ t("labels.information") }}-->
            <!--  </div>-->
            <!--  <div-->
            <!--      v-if="plugin.labels.includes('tool')"-->
            <!--      class="plugins-list-card-labels-label"-->
            <!--  >-->
            <!--    <ElIconTools class="label-icon"/>-->
            <!--    {{ t("labels.tool") }}-->
            <!--  </div>-->
            <!--  <div-->
            <!--      v-if="plugin.labels.includes('management')"-->
            <!--      class="plugins-list-card-labels-label"-->
            <!--  >-->
            <!--    <ElIconUserFilled class="label-icon"/>-->
            <!--    {{ t("labels.management") }}-->
            <!--  </div>-->
            <!--  <div-->
            <!--      v-if="plugin.labels.includes('api')"-->
            <!--      class="plugins-list-card-labels-label"-->
            <!--  >-->
            <!--    <ElIconShare class="label-icon"/>-->
            <!--    {{ t("labels.api") }}-->
            <!--  </div>-->
            <!--</div>-->
          </div>
          <div class="plugins-list-card-votes">
            <ElIconStarFilled
                v-if="isVoted(plugin.id)"
                class="plugins-list-card-votes-icon"
            />
            <ElIconStar
                v-else
                class="plugins-list-card-votes-icon"
            />
            <div class="plugins-list-card-votes-number">
              {{ plugin.id in votes ? votes[plugin.id].vote : 0 }}
            </div>
            <div class="plugins-list-card-votes-text">
              {{ t("votes") }}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {MetaInfo} from "~/types/plugins";
import {VotesData} from "~/composables/useLeanCloud";

// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

// ----------------------------------------------------------------------------
// plugins store
// ----------------------------------------------------------------------------
const pluginsStore = usePluginsStore();

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
  // labels: string[];
  sorting: "name" | "author" | "votes";
  reverse: boolean;
}

// search setting model
const searchSetting: Ref<SearchSettingType> = ref({
  name: "",
  author: "",
  // labels: [],
  sorting: "votes",
  reverse: false,
}) as Ref<SearchSettingType>;

// searched list
const plugins = computed(() => {
  // origin
  const pluginsOrigin = pluginsStore.$state.pluginMetaSummary?.plugins ?? {};

  // filter
  let pluginsList = Object.values(pluginsOrigin).filter((plugin) => shouldShow(plugin));

  // sort
  if (searchSetting.value.sorting === "name") {
    pluginsList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (searchSetting.value.sorting === "author") {
    pluginsList.sort((a, b) => a.authors[0].localeCompare(b.authors[0]));
  } else if (searchSetting.value.sorting === "votes") {
    pluginsList.sort((a, b) => {
      const aVotes = a.id in votes ? votes[a.id].vote : 0;
      const bVotes = b.id in votes ? votes[b.id].vote : 0;
      return bVotes - aVotes;
    });
  }

  // reverse
  if (searchSetting.value.reverse) {
    pluginsList.reverse()
  }

  return pluginsList;
});

function shouldShow(plugin: MetaInfo): boolean {
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
    const pluginAuthors = plugin.authors.map((author) => author.toLowerCase());
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
  // if (searchSetting.value.labels.length > 0) {
  //   if (!searchSetting.value.labels.every((label: string) => plugin.labels.includes(label))) {
  //     return false;
  //   }
  // }

  return true;
}
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

#plugins {
  padding: 2rem min(20vw, 20rem);

  display: flex;
  justify-content: space-between;

  @media only screen and (width < $size-xl) {
    padding: 1rem;
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
    height: 30rem;

    position: sticky;
    top: 1rem;

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

    .plugins-list-card {
      margin-bottom: 1rem;
      color: var(--gray-7);

      display: flex;
      justify-content: space-between;

      @media only screen and (width < $size-md) {
        flex-direction: column;
      }

      .plugins-list-card-info {
        max-width: 80%;

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

            &:hover {
              color: var(--blue-6);
              text-decoration: underline;
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

      .plugins-list-card-votes {
        display: flex;
        align-items: center;

        font-size: 1.2rem;

        .plugins-list-card-votes-icon {
          height: 1.2rem;
        }

        .plugins-list-card-votes-number {
          margin: 0 0.25rem;
          font-weight: bold;
        }
      }
    }
  }

  @media only screen and (width < $size-md) {
    flex-direction: column;

    #plugins-search {
      width: 100%;
      margin-bottom: 1rem;

      position: unset;
    }

    #plugins-list {
      width: 100%;
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
votes: Votes
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
votes: 喜欢
</i18n>
