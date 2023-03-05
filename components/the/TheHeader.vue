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
      <nav id="nav">
        <NuxtLink class="nav-item" to="/">Home</NuxtLink>
        <NuxtLink class="nav-item" to="/plugins">Plugins</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
#header {
  height: 4rem;

  #content {
    height: 100%;
    padding: 0.5rem 5vw;
    box-sizing: border-box;

    background-color: var(--stone-3);

    display: flex;
    justify-content: space-between;
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
