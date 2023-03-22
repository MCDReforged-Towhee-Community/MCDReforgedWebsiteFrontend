<template>
  <div id="card" class="box">
    <div class="card-info">
      <div class="card-title">
        <NuxtLink
            class="card-title-name"
            :to="`/plugins/${brief.id}`"
        >
          {{ brief.name }}
        </NuxtLink>
        <br class="hidden-md-and-up">
        <div class="card-title-at">
          @
        </div>
        <div class="card-title-authors">
          <template
              v-for="(author, index) in brief.authors"
              :key="author.name"
          >
            <div v-if="index > 0">{{ ", " }}</div>
            <a
                class="card-title-authors-name--clickable"
                :href="author.link"
                target="_blank"
            >
              {{ author.name }}
            </a>
          </template>
        </div>
      </div>
      <div class="card-description">
        <BaseMarkdown
            :model-value="brief.description[getMCDRLocale()] ?? ''"
            a-tag-blank-target
        />
      </div>
      <div class="card-labels">
        <PagePluginsLabels :labels="brief.labels"/>
      </div>
    </div>
    <div class="card-data">
      <div class="card-data-item">
        <ClientOnly>
          <ElIconStarFilled
              v-if="votesStore.isVoted(brief.id)"
              class="card-data-item-icon"
          />
          <ElIconStar
              v-else
              class="card-data-item-icon"
          />
        </ClientOnly>
        <div>
          {{ t("votes") }}
        </div>
        <div class="card-data-item-number">
          {{ votesStore.getVotesNumber(brief.id) }}
        </div>
      </div>
      <div class="card-data-item">
        <ElIconDownload class="card-data-item-icon"/>
        <div>
          {{ t("downloads") }}
        </div>
        <div class="card-data-item-number">
          {{ brief.downloads }}
        </div>
      </div>
      <div
          v-if="brief.updated_at !== null"
          class="card-data-item"
      >
        <ElIconRefresh class="card-data-item-icon"/>
        <div>
          {{ t("updated_at") }}
        </div>
        <div class="card-data-item-number">
          {{ $d(new Date(brief.updated_at), "text") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PluginDataBrief} from "~/types/plugins";

const {t} = useI18n();
const votesStore = usePluginsVotesStore();

const props = defineProps<{
  brief: PluginDataBrief;
}>();
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";

#card {
  width: 100%;
  min-height: 8rem;
  margin-bottom: 1rem;

  display: flex;
  justify-content: space-between;

  color: var(--gray-7);

  @media only screen and (max-width: $size-md) {
    flex-direction: column;
  }

  .card-info {
    max-width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media only screen and (max-width: $size-md) {
      max-width: 100%;
    }

    .card-title {
      * {
        display: inline;
      }

      .card-title-name {
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

      .card-title-authors {
        .card-title-authors-name {
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

    .card-description {
      margin: 0.25rem 0;
      overflow-wrap: anywhere;

      :deep(.markdown-body) {
        background: unset;
        color: var(--gray-7);
      }
    }
  }

  .card-data {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;

    @media only screen and (max-width: $size-md) {
      margin-top: 1rem;
      display: unset;
    }

    .card-data-item {
      display: flex;
      align-items: center;

      font-size: 1.2rem;
      white-space: nowrap;

      .card-data-item-icon {
        height: 1.2rem;
      }

      .card-data-item-number {
        margin: 0 0.25rem;
        font-weight: bold;
      }
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
votes: Votes
downloads: Downloads
updated_at: Updated At
</i18n>

<i18n locale="zh-CN" lang="yaml">
votes: 喜欢
downloads: 下载
updated_at: 更新于
</i18n>
