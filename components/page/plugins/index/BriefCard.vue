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
        <PagePluginsBaseLabels :labels="brief.labels"/>
      </div>
    </div>
    <div class="card-data">
      <div class="card-data-item">
        <ElButton
            :icon="ElIconDownload"
            circle
            @click="download"
        />
        <ElButton
            circle
            @click="isVoted ? decreaseVote() : increaseVote()"
            :loading="!!voting"
        >
          <template #icon>
            <PagePluginsBaseVoteStar :id="brief.id"/>
          </template>
        </ElButton>
      </div>
      <div class="card-data-item">
        <PagePluginsBaseVoteStar
            class="card-data-item-icon"
            :id="brief.id"
        />
        <div class="card-data-item-number">
          {{ brief.votes }}
        </div>
        <ElIconDownload class="card-data-item-icon"/>
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
import {
  PluginData,
  PluginDataBrief,
} from "~/types/plugins";

const {t} = useI18n();

const {brief} = defineProps<{
  brief: PluginDataBrief;
}>();

async function getPluginData(): Promise<PluginData> {
  return await pluginsStore.getPluginData(brief.id) as PluginData;
}

// ----------------------------------------------------------------------------
// download button
// ----------------------------------------------------------------------------
async function download(): Promise<void> {
  const pluginData = await getPluginData();
  if (pluginData.release.releases.length === 0 || pluginData.release.releases[0].assets.length === 0) {
    ElMessage.error(t("no_release"));
  } else {
    const downloadElement = document.createElement("a");
    downloadElement.href = pluginData.release.releases[0].assets[0].browser_download_url;
    downloadElement.click();
  }
}

// ----------------------------------------------------------------------------
// votes store
// ----------------------------------------------------------------------------
const voting = ref(false);
const isMounted = ref(false);
const pluginsStore = usePluginsStore();
const isVoted = computed(() => isMounted.value ? pluginsStore.isVoted(brief.id) : false);

// update voted on mounted
onMounted(() => {
  isMounted.value = true;
});

/**
 * Increase vote number and save to local storage.
 */
async function increaseVote() {
  voting.value = true;
  try {
    await pluginsStore.increaseVote(brief.id);
  } catch (e) {
    console.error(e);
    ElNotification({
      title: t("increaseVote.title"),
      message: t("increaseVote.message"),
      type: "error",
    });
  } finally {
    voting.value = false;
  }
}

/**
 * Decrease vote number and save to local storage.
 */
async function decreaseVote() {
  voting.value = true;
  try {
    await pluginsStore.decreaseVote(brief.id);
  } catch (e) {
    console.error(e);
    ElNotification({
      title: t("decreaseVote.title"),
      message: t("decreaseVote.message"),
      type: "error",
    });
  } finally {
    voting.value = false;
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/variables";

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
        width: 1.2rem;
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
no_release: This plugin has no release.
updated_at: Updated At
</i18n>

<i18n locale="zh-CN" lang="yaml">
no_release: 此插件没有任何已发布的文件。
updated_at: 更新于
</i18n>
