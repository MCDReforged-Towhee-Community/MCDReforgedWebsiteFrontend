<template>
  <div class="box">
    <div id="install">
      <div class="title">{{ t("install") }}</div>
      <ElTooltip
          :content="t('installTooltip.default')"
          placement="top"
      >
        <button
            id="install-box"
            @click="writeToClipboard"
            @keydown.enter="writeToClipboard"
        >
          <ElIconArrowRight id="install-arrow"/>
          <span id="install-text">{{ installCommand }}</span>
          <ElIconCopyDocument id="install-copy"/>
        </button>
      </ElTooltip>
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
            tabindex="0"
            @keydown.enter.self="$emit('viewAsset', release.tag_name, asset.name)"
            @click="$emit('viewAsset', release.tag_name, asset.name)"
        >
          <div class="files-asset-text">
            <div class="files-asset-text-name">{{ asset.name }}</div>
            <div class="files-asset-text-date">
              {{ $d(new Date(asset.created_at), "text") }}
            </div>
          </div>
          <a
              class="files-asset-download"
              tabindex="-1"
              :href="asset.browser_download_url"
              download
              @click.stop
          >
            <ElButton
                type="primary"
                :icon="ElIconDownload"
            />
          </a>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PluginData, PluginDataBrief} from "~/types/plugins";

const {t} = useI18n();

const prop = defineProps<{
  data: PluginData;
  brief: PluginDataBrief;
}>();

defineEmits<{
  (e: "viewAll"): void;
  (e: "viewRelease", tagName: string): void;
  (e: "viewAsset", tagName: string, assetName: string): void;
}>();

const installCommand = `!!al i ${prop.data.meta.id}`;

function writeToClipboard() {
  navigator.clipboard.writeText(installCommand);
  ElMessage({
    message: t("installTooltip.copied"),
    type: "success",
  });
}
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";

.title {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.button {
  padding: unset;
  border: unset;
  background: unset;
}

#install {
  #install-box {
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.5rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
    font-size: 0.8rem;

    background: none;
    border-radius: 0.5rem;
    border: 1px solid var(--gray-4);

    #install-arrow {
      height: 0.8rem;
      margin-right: 0.2rem;
    }

    #install-text {
      margin-right: auto;
    }

    #install-copy {
      display: none;

      height: 0.8rem;
    }

    &:hover {
      background: var(--blue-2);

      #install-copy {
        display: unset;
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
    box-shadow: unset;

    :deep(.el-card__body) {
      padding: 0.5rem;
      background-color: white;

      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background-color: var(--gray-1);
      }
    }

    .files-asset-text {
      width: 80%;

      .files-asset-text-name {
        color: var(--gray-7);
        font-size: 0.8rem;

        overflow-wrap: anywhere;
      }

      .files-asset-text-date {
        color: var(--gray-6);
        font-size: 0.5rem;
      }
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
files: Recent Files
viewAll: View All
install: Install
installTooltip:
  default: Copy Command
  copied: Copied!
</i18n>

<i18n locale="zh-CN" lang="yaml">
files: 最新文件
viewAll: 查看全部
install: 安装
installTooltip:
  default: 复制命令
  copied: 已复制！
</i18n>
