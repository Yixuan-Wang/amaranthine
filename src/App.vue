<script setup lang="ts">

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
