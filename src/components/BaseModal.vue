<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components";
const props = defineProps<{
  containerClass?: string
}>();

const modalOpen = ref(false);
const toggleModal = () => { modalOpen.value = !modalOpen.value; };

const { load, unload } = useStyleTag(`#pane {
  pointer-events: auto !important;
  background-color: rgba(0, 0, 0, 0.5);
}`, { immediate: false });

watch(modalOpen, (val) => {
  if (val)
    load();
  else unload();
});
</script>

<template>
  <span btn>
    <span class="relative inline-flex" :class="props.containerClass">
      <button btn @click="toggleModal()">
        <slot />
      </button>
      <div v-if="modalOpen" class="dropdown-inner">
        <teleport to="#pane">
          <div class="m-auto grid justify-center items-center w-full h-full">
            <OnClickOutside @trigger="toggleModal()">
              <slot name="modal" />
            </OnClickOutside>
          </div>
        </teleport>
      </div>
    </span>
  </span>
</template>
