<template>
  <div
      class="file"
      tabindex="0"
      @keydown.enter.self="$emit('click')"
      @click="$emit('click')"
  >
    <a
        class="file-button"
        tabindex="-1"
        :href="downloadUrl"
        download
        @click.stop
    >
      <ElButton
          type="primary"
          :icon="ElIconDownload"
      />
    </a>
    <div class="file-name">
      {{ name }}
    </div>
    <div class="file-size">
      {{ formatSize(size) }}
    </div>
    <div class="file-data file-downloads">
      <ElIconDownload class="file-icon"/>
      {{ downloads }}
    </div>
    <div class="file-data file-created">
      <ElIconCalendar class="file-icon"/>
      {{ $d(new Date(createdAt), "text") }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string,
  size: number,
  downloads: number,
  createdAt: string,
  downloadUrl: string,
}>();

defineEmits<{
  (e: "click"): void;
}>();

/**
 * Format size number to string.
 * @param {number} size size in bytes.
 * @return {string} formatted size.
 */
function formatSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/variables.scss";
.file {
  margin: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;

  cursor: pointer;

  display: grid;
  grid-template-columns: 1fr 8fr 4fr;

  &:hover {
    background-color: var(--gray-1);
  }

  .file-button {
    grid-column: 1;
    grid-row: 1 / 3;

    margin-right: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .file-name {
    grid-column: 2;
    grid-row: 1;

    overflow-wrap: anywhere;
  }

  .file-size {
    grid-column: 2;
    grid-row: 2;
  }

  .file-downloads {
    grid-column: 3;
    grid-row: 1;
  }

  .file-created {
    grid-column: 3;
    grid-row: 2;
  }

  .file-data {
    display: flex;
    align-items: center;
  }

  .file-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  @media only screen and (max-width: $size-md) {
    grid-template-columns: 1fr 8fr;

    .file-downloads {
      grid-column: 2;
      grid-row: 3;
    }

    .file-created {
      grid-column: 2;
      grid-row: 4;
    }
  }
}
</style>
