<template>
  <NuxtLayout>
    <div id="_layout">
      <NuxtLoadingIndicator color="var(--blue-6)"/>
      <TheHeader/>
      <ElConfigProvider :locale="locale">
        <NuxtPage/>
      </ElConfigProvider>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {type ComputedRef} from "vue";
import {type Language} from "element-plus/es/locale";
// @ts-ignore
import enUS from "element-plus/dist/locale/en";
// @ts-ignore
import zhCN from "element-plus/dist/locale/zh-cn";

const i18n = useI18n();

// element-plus i18n
const locale: ComputedRef<Language | undefined> = computed(() => (
    {
      "en-US": enUS,
      "zh-CN": zhCN,
    }[i18n.locale.value as string]
));

// title
useHead({title: () => i18n.t("global.title")});

// i18n head attributes
useHead(useLocaleHead({addSeoAttributes: true}));
</script>

<style scoped lang="scss">
#_layout {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
