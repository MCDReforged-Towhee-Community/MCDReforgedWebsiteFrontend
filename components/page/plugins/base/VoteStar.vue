<template>
  <Component
      class="vote-star"
      :is="isVoted ? starFilledComponent : starComponent"
  />
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";

const pluginsStore = usePluginsStore();
const {id} = defineProps<{
  id: string;
}>();

// components
const starComponent = resolveComponent("ElIconStar");
const starFilledComponent = resolveComponent("ElIconStarFilled");

// is voted
const isMounted = ref(false);
const isVoted = computed(() => isMounted.value ? pluginsStore.isVoted(id) : false);

// update voted on mounted
onMounted(() => {
  isMounted.value = true;
});
</script>

<style scoped lang="scss">
.vote-star {
  width: 1rem;
  height: 1rem;
}
</style>
