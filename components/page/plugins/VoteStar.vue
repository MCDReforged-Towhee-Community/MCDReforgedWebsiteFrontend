<template>
  <Component
      class="vote-star"
      :is="isVoted ? starFilledComponent : starComponent"
  />
</template>

<script setup lang="ts">
const pluginsStore = usePluginsStore();
const {id} = defineProps<{
  id: string;
}>();

// components
const starComponent = resolveComponent("ElIconStar");
const starFilledComponent = resolveComponent("ElIconStarFilled");

// is voted
const isVoted = ref(false);

// update votes on mounted
onMounted(() => {
  isVoted.value = pluginsStore.isVoted(id);
});
</script>

<style scoped lang="scss">
.vote-star {
  width: 1rem;
  height: 1rem;
}
</style>
