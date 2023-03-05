<template>
  <header id="header">
    <div id="content">
      <NuxtLink class="logo" to="/">
        <img
            class="logo"
            src="https://raw.githubusercontent.com/Fallen-Breath/MCDReforged/master/logo_long.png"
            alt="logo"
        >
      </NuxtLink>
      <nav id="nav" class="hidden-xs-only">
        <NuxtLink class="nav-item" to="/">{{ t("home") }}</NuxtLink>
        <NuxtLink class="nav-item" to="/plugins">{{ t("plugins") }}</NuxtLink>
      </nav>
      <ClientOnly>
        <ElSelect
            v-model="localeRef"
            @change="val => $i18n.setLocale(val)"
        >
          <el-option
              v-for="item in $i18n.locales"
              :key="item.name"
              :value="item.code"
              :label="item.name"
          />
        </ElSelect>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
const {locale, t} = useI18n();
const localeRef = ref(locale.value);
</script>

<style scoped lang="scss" >
#header {
  height: 4rem;

  #content {
    height: 100%;
    padding: 0.5rem 5vw;
    box-sizing: border-box;

    background-color: var(--stone-3);

    display: flex;
    align-items: center;

    .logo {
      height: 100%;
    }

    #nav {
      margin-left: auto;
      margin-right: 1rem;
      padding: 0;
      display: flex;

      .nav-item {
        padding: 0 1rem;
        color: var(--gray-9);
        font-size: 1.2rem;
        font-weight: bold;
        text-decoration: none;

        &:hover {
          color: var(--blue-5);
        }
      }
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
home: Home
plugins: Plugins
</i18n>

<i18n locale="zh-CN" lang="yaml">
home: 主页
plugins: 插件
</i18n>
