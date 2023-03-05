<template>
  <div id="plugins">
    <div
        id="plugins-filter"
        class="box"
    >
      <div id="plugins-filter-title">
        {{ t("filter.title") }}
      </div>
      <ElInput
          v-model="filter.name"
          class="plugins-filter-item"
          :placeholder="t('filter.name')"
          :prefix-icon="ElIconSearch"
      />
      <ElInput
          v-model="filter.author"
          class="plugins-filter-item"
          :placeholder="t('filter.author')"
          :prefix-icon="ElIconAvatar"
      />
      <ElCheckboxGroup
          v-model="filter.labels"
          class="plugins-filter-item"
      >
        <ElCheckbox
            v-for="label in ['information', 'tool', 'management', 'api']"
            :key="label"
            :label="label"
        >
          <div class="plugins-filter-item-labels">
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
              {{ t(label) }}
            </div>
          </div>
        </ElCheckbox>
      </ElCheckboxGroup>
    </div>
    <ClientOnly>
      <div
          id="plugins-list"
          v-if="pluginsStore.$state.pluginsMeta !== undefined"
      >
        <div
            v-for="plugin in pluginsStore.$state.pluginsMeta.plugins"
            v-show="shouldShow(plugin)"
            :key="plugin.id"
            class="box plugins-list-card"
        >
          <div class="plugins-list-card-title">
            <NuxtLink
                class="plugins-list-card-title-item plugins-list-card-name clickable--underline"
                :to="`/plugins/${plugin.id}`"
            >
              {{ plugin.name }}
            </NuxtLink>
            <div class="plugins-list-card-title-item plugins-list-card-at">
              @
            </div>
            <div
                class="plugins-list-card-title-item plugins-list-card-authors">
              {{ plugin.authors.join(", ") }}
            </div>
          </div>
          <div class="plugins-list-card-description">
            {{ plugin.description[MCDRLocale] }}
          </div>
          <div class="plugins-list-card-labels">
            <div
                v-if="plugin.labels.includes('information')"
                class="plugins-list-card-labels-label"
            >
              <ElIconInfoFilled class="label-icon"/>
              {{ t("information") }}
            </div>
            <div
                v-if="plugin.labels.includes('tool')"
                class="plugins-list-card-labels-label"
            >
              <ElIconTools class="label-icon"/>
              {{ t("tool") }}
            </div>
            <div
                v-if="plugin.labels.includes('management')"
                class="plugins-list-card-labels-label"
            >
              <ElIconUserFilled class="label-icon"/>
              {{ t("management") }}
            </div>
            <div
                v-if="plugin.labels.includes('api')"
                class="plugins-list-card-labels-label"
            >
              <ElIconShare class="label-icon"/>
              {{ t("api") }}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// i18n
import {PluginMeta} from "~/stores/plugins";

const {t, locale} = useI18n();

// mcdr
const MCDRLocale = computed(() => (
    {
      "en-US": "en_us",
      "zh-CN": "zh_cn",
    }[locale.value]
));

// pinia
const pluginsStore = usePluginsStore();

// filter
const filter = ref({
  name: "",
  author: "",
  labels: [],
});

function shouldShow(plugin: PluginMeta): boolean {
  // name
  if (filter.value.name) {
    const pluginName = plugin.name.toLowerCase();
    let shouldHideFlag = false;
    for (const name of filter.value.name.toLowerCase().split(" ")) {
      if (!pluginName.includes(name)) {
        shouldHideFlag = true;
      }
    }
    if (shouldHideFlag) {
      return false;
    }
  }

  // author
  if (filter.value.author) {
    const pluginAuthors = plugin.authors.map((author) => author.toLowerCase());
    let shouldHideFlag = false;
    for (const author of filter.value.author.toLowerCase().split(" ")) {
      if (!pluginAuthors.some((pluginAuthor) => pluginAuthor.includes(author))) {
        shouldHideFlag = true;
      }
    }
    if (shouldHideFlag) {
      return false;
    }
  }

  // labels
  if (filter.value.labels.length > 0) {
    if (!filter.value.labels.every((label: string) => plugin.labels.includes(label))) {
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

  @media only screen and (width < $size-xl) {
    padding: 1rem;
  }

  .box {
    padding: 1rem;
    border-radius: 1rem;

    box-sizing: border-box;
    background: var(--gray-2);
  }

  #plugins-filter {
    width: 19%;
    height: 20rem;

    position: sticky;
    top: 1rem;

    #plugins-filter-title {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
    }

    .plugins-filter-item {
      margin-bottom: 0.5rem;

      display: flex;
      flex-direction: column;
    }

    .plugins-filter-item-labels {
      display: flex;
    }
  }

  #plugins-list {
    width: 80%;

    .plugins-list-card {
      margin-bottom: 1rem;
      color: var(--gray-7);

      .plugins-list-card-title {
        .plugins-list-card-title-item {
          display: inline;
        }

        .plugins-list-card-name {
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
  }

  @media only screen and (width < $size-md) {
    flex-direction: column;

    #plugins-filter {
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
filter:
  title: Filter
  name: Name
  author: Author
  labels: Labels
information: Information
tool: Tool
management: Management
api: API
</i18n>

<i18n locale="zh-CN" lang="yaml">
filter:
  title: 搜索
  name: 名称
  author: 作者
  labels: 标签
information: 信息
tool: 工具
management: 管理
api: API
</i18n>
