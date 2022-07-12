<script setup lang="ts">
const settings = useSettings();
const { backgroundImgUrl, accentColor } = storeToRefs(settings);

const backgroundImgVar = useCssVar("--background-image");
const accentColorVar = useCssVar("--color-accent");
syncRef(backgroundImgUrl, backgroundImgVar);
syncRef(accentColor, accentColorVar);
</script>

<template>
  <div
    class="w-full h-full min-h-full font-sans relative"
    text="fgd"
  >
    <main class="mx-auto h-full">
      <router-view />
    </main>
    <footer class="fixed right-4 bottom-4">
      <TheFooter />
    </footer>
  </div>
</template>
