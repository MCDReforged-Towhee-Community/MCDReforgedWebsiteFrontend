<template>
  <div id="area-1">
    <div id="left">
      <img
          id="logo"
          src="https://raw.githubusercontent.com/Fallen-Breath/MCDReforged/master/logo_long.png"
          alt="logo_long"
      />
    </div>
    <div id="right">
      <div id="introduction">
        {{ t("introduction") }}
      </div>
      <BaseMultilineDiv id="description" :value="t('description')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
// ----------------------------------------------------------------------------
// basic constants
// ----------------------------------------------------------------------------
const {t} = useI18n();

</script>

<style scoped lang="scss">
#area-1 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#left {
  width: 80%;

  #logo {
    width: 100%;
  }
}

#right {
  width: 100%;
  margin-top: 3rem;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  #introduction {
    font-size: 1.5rem;
    color: var(--gray-9);
  }

  #description {
    margin-top: 1rem;

    :deep(*) {
      margin: 0.5rem 0;
    }
  }
}
</style>

<i18n locale="en-US" lang="yaml">
introduction: This is a Minecraft server control tool
description: |
  MCDReforged is a tool which provides the management ability of the Minecraft server using custom plugin system. It doesn't need to modify or mod the original Minecraft server at all
  From in-game calculator, player high-light, to manipulate scoreboard, manage structure file and backup / load backup, you can implement these by using MCDR and related plugins
  Great thanks to chino_desu and his MCDaemon 1.0 for the idea of such a cool Minecraft control tool
</i18n>

<i18n locale="zh-CN" lang="yaml">
introduction: 这是一个 Minecraft 服务端控制工具
description: |
  MCDReforged 是一个可以在完全不对 Minecraft 服务端进行修改的情况下，通过可自定义的插件系统，提供对服务端的管理能力的工具
  小至计算器、高亮玩家、b 站弹幕姬，大至操控计分板、管理结构文件、自助备份回档，都可以通过 MCDR 及相配套的插件实现
  非常感谢 chino_desu 以及他的 MCDaemon 1.0 提出了这样一个超棒的 Minecraft 服务端控制工具的点子
</i18n>
