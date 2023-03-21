<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--blue-6)"/>
    <TheHeader/>
    <ElConfigProvider :locale="locale">
      <NuxtPage/>
    </ElConfigProvider>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {Language} from "element-plus/lib/locale";
import enUS from "element-plus/lib/locale/lang/en";
import zhCN from "element-plus/lib/locale/lang/zh-cn";

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
