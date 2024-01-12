<template>
  <div id="document">
    <iframe
        class="iframe"
        :src="url"
    />
    <TheFooter/>
  </div>
</template>

<script setup lang="ts">
const {locale} = useI18n();

const url = computed(() => (
    {
      "en-US": "https://mcdreforged.readthedocs.io/en/latest/",
      "zh-CN": "https://mcdreforged.readthedocs.io/zh-cn/latest/",
    }[locale.value as string]
));
</script>

<style scoped lang="scss">
@import "assets/css/variables";

#document {
  height: calc(100vh - 4rem);

  display: flex;
  flex-direction: column;
}

.iframe {
  width: 100%;
  height: 100%;

  border: none;
  border-radius: 1rem;
  box-shadow: $shadow-basic;
}
</style>
