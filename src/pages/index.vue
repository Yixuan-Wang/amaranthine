<script setup lang="ts">
import { SourceStatus } from "~/logic/source";

const source = useSource();
const { mode, token, fsArchive } = storeToRefs(source);
onBeforeMount(() => source.loadSource());
watch(mode, () => source.loadSource());
watch(token, () => {
  source.loadSource();
});
watch(fsArchive, (value) => {
  source.loadSource();
});
</script>

<template>
  <div class="mx-auto max-w-[60ch] p-4 pb-[5em] lg:pb-4">
    <div v-if="source.status === SourceStatus.Idle">
      <div>请先配置数据源……</div>
    </div>
    <div
      v-else-if="
        source.status === SourceStatus.Ok
          || source.status === SourceStatus.Downloading
      "
      class="flex flex-col gap-4 content-center items-stretch justify-center"
    >
      <CardHole
        v-for="entry in source.holes"
        :key="entry.entry.id"
        :hole="entry"
      />
      <div class="rounded shadow p-3 text-center">到头了……</div>
    </div>
    <div v-else-if="source.status === SourceStatus.Loading">加载中</div>
  </div>
</template>
