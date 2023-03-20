<template>
  <div>
    <div id="authors">
      <div class="title">{{ t("authors") }}</div>
      <div
          v-for="author in brief.authors"
          :key="author.name"
          class="author-item"
      >
        <img
            class="authors-avatar"
            src="https://github.com/favicon.ico"
            :alt="author.name"
        />
        <a
            class="authors-link"
            :href="author.link"
            target="_blank"
        >
          {{ author.name }}
        </a>
      </div>
    </div>
    <ElDivider/>
    <div id="files">
      <div id="files-title">
        <div class="title">{{ t("files") }}</div>
        <button
            id="files-title-all"
            class="button clickable--underline"
            @click="$emit('viewAll')"
        >
          {{ t("viewAll") }}
          <ElIconArrowRight id="files-title-all-icon"/>
        </button>
      </div>
      <div
          v-for="release in data.release.releases.slice(0, 3)"
          :key="release.tag_name"
      >
        <button
            class="button clickable--underline files-version"
            @click="$emit('viewRelease', release.tag_name)"
        >
          {{ release.parsed_version }}
        </button>
        <ElCard
            v-for="asset in release.assets"
            :key="asset.name"
            class="files-asset"
            @click="$emit('viewAsset', release.tag_name, asset.name)"
        >
          <div class="files-asset-name">{{ asset.name }}</div>
          <div class="files-asset-date">
            {{ $d(new Date(asset.created_at), "text") }}
          </div>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PluginData, PluginDataBrief} from "~/types/plugins";

const {t} = useI18n();

defineProps<{
  brief: PluginDataBrief;
  data: PluginData;
}>();

defineEmits<{
  (e: "viewAll"): void;
  (e: "viewRelease", tagName: string): void;
  (e: "viewAsset", tagName: string, assetName: string): void;
}>();
</script>

<style scoped lang="scss">
@import "assets/variables.scss";

.title {
  font-size: 1.2rem;
  font-weight: bold;
}

.button {
  padding: unset;
  border: unset;
  background: unset;
}

#authors {
  display: flex;
  flex-direction: column;

  .author-item {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;

    .authors-avatar {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;

      border-radius: 50%;
    }

    .authors-link {
      color: var(--gray-7);

      cursor: pointer;

      &:hover {
        color: var(--blue-6);
      }
    }
  }
}

#files {
  #files-title {
    display: flex;
    justify-content: space-between;

    #files-title-all {
      display: flex;
      align-items: center;

      cursor: pointer;

      #files-title-all-icon {
        height: 1rem;
      }
    }
  }

  .files-version {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .files-asset {
    margin: 0.5rem 0;

    cursor: pointer;

    :deep(.el-card__body) {
      padding: 0.5rem;

      &:hover {
        background-color: var(--gray-1);
      }
    }

    .files-asset-name {
      width: 60%;
      color: var(--gray-7);
      font-size: 0.8rem;

      overflow-wrap: anywhere;

      @media only screen and (width < $size-md) {
        width: 80%;
      }
    }

    .files-asset-date {
      color: var(--gray-6);
      font-size: 0.5rem;
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
authors: Authors
files: Recent Files
viewAll: View All
</i18n>

<i18n locale="zh-CN" lang="yaml">
authors: 作者
files: 最新文件
viewAll: 查看全部
</i18n>
