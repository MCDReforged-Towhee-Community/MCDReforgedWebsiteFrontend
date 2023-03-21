<template>
  <div>
    <div id="name">{{ brief.name }}</div>
    <div id="description">
      <BaseMarkdown
          :model-value="brief.description[getMCDRLocale()] ?? ''"
          a-tag-blank-target
      />
    </div>
    <PagePluginsLabels :labels="brief.labels"/>
    <ElDivider/>
    <div class="data">
      <div class="data-name">
        <ElIconDownload class="data-name-icon"/>
        <div>{{ t("downloads") }}</div>
      </div>
      <div class="data-number">
        {{ brief.downloads }}
      </div>
    </div>
    <div class="data">
      <div class="data-name">
        <ElIconStar class="data-name-icon"/>
        <div>{{ t("votes") }}</div>
      </div>
      <div class="data-number">
        {{ votesStore.getVotesNumber(brief.id) }}
      </div>
    </div>
    <div
        v-if="brief.updated_at !== null"
        class="data"
    >
      <div>{{ t("updatedAt") }}</div>
      <div>{{ $d(new Date(brief.updated_at), "text") }}</div>
    </div>
    <ElDivider/>
    <ClientOnly>
      <ElButton
          id="vote"
          :icon="isVoted ? ElIconStarFilled : ElIconStar"
          @click="isVoted ? decreaseVote() : increaseVote()"
          :loading="!!voting"
      >
        {{ isVoted ? t("decreaseVote.button") : t("increaseVote.button") }}
      </ElButton>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {PluginDataBrief} from "~/types/plugins";

const {t} = useI18n();
const voting = ref(false);

const props = defineProps<{
  brief: PluginDataBrief;
}>();

// ----------------------------------------------------------------------------
// votes store
// ----------------------------------------------------------------------------
const votesStore = usePluginsVotesStore();
const isVoted = computed(() => votesStore.isVoted(props.brief.id));

/**
 * Increase vote number and save to local storage.
 */
async function increaseVote() {
  try {
    voting.value = true;
    await votesStore.increaseVote(props.brief.id);
    voting.value = false;
  } catch (e) {
    console.error(e);
    ElNotification({
      title: t("increaseVote.title"),
      message: t("increaseVote.message"),
      type: "error",
    });
  }
}

/**
 * Decrease vote number and save to local storage.
 */
async function decreaseVote() {
  try {
    voting.value = true;
    await votesStore.decreaseVote(props.brief.id);
    voting.value = false;
  } catch (e) {
    console.error(e);
    ElNotification({
      title: t("decreaseVote.title"),
      message: t("decreaseVote.message"),
      type: "error",
    });
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/main.scss";

#name {
  width: 80%;
  font-size: 1.5rem;
  font-weight: bold;
  overflow-wrap: anywhere;
}

#description {
  margin: 0.5rem 0;

  color: var(--gray-7);

  :deep(.markdown-body) {
    background: unset;
    color: var(--gray-7);
  }
}

.data {
  margin-bottom: 0.2rem;

  display: flex;
  justify-content: space-between;

  .data-name {
    display: flex;
    align-items: center;

    .data-name-icon {
      height: 1.2rem;
    }
  }

  .data-number {
    font-weight: bold;
  }
}

#vote {
  width: 100%;
}
</style>

<i18n locale="en-US" lang="yaml">
downloads: downloads
votes: votes
updatedAt: Updated at
increaseVote:
  button: Vote
  title: Error
  message: Cannot increase vote number.
decreaseVote:
  button: Unvote
  title: Error
  message: Cannot decrease vote number.
</i18n>

<i18n locale="zh-CN" lang="yaml">
downloads: 下载
votes: 点赞
updatedAt: 更新于
increaseVote:
  button: 点赞
  title: 错误
  message: 无法增加点赞数。
decreaseVote:
  button: 取消点赞
  title: 错误
  message: 无法减少点赞数。
</i18n>
