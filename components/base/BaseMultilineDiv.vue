<template>
  <div>
    <div v-for="i in value.split('\n').filter(item => item !== '')">
      {{ i }}
    </div>
  </div>
</template>

<script setup lang="ts">
const {value} = defineProps<{
  value: string;
}>();
</script>

<style scoped lang="scss">

</style>
