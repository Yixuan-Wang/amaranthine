<script setup lang="ts">
const props = defineProps<{
  containerClass?: string
}>();
const tooltipOpen = ref(false);
</script>

<template>
  <span class="relative inline-flex justify-center" :class="props.containerClass">
    <span @mouseover="tooltipOpen = true" @mouseleave="tooltipOpen = false">
      <slot />
    </span>
    <div v-if="tooltipOpen" class="tooltip-inner rounded shadow bg-bgd fg-fgd px-2 py-1 text-sm">
      <slot name="tooltip" />
    </div>
  </span>
</template>

<style scoped>
.tooltip-inner {
  position: absolute;
  width: max-content;
  bottom: calc(100% + 0.5em);
}
</style>
