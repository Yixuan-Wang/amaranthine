<script setup lang="ts">
import { SourceStatus } from "~/logic/source";

const source = useSource();
const { mode, token } = storeToRefs(source);
onBeforeMount(() => source.loadSource());
watch(mode, () => source.loadSource());
watch(token, () => {
  source.loadSource();
});
</script>

<template>
  <div id="flow" class="mx-auto max-w-[60ch] p-4 pb-[5em] lg:pb-4">
    <div
      v-if="source.status === SourceStatus.Idle"
      class="card p-3 text-center"
    >
      <div>
        请先配置数据源，或
        <a
          href="https://github.com/Yixuan-Wang/amaranthine/blob/master/docs/README.md"
          rel="noreferrer"
          target="_blank"
          class="font-bold underline"
        >查看文档</a>
        寻求帮助
      </div>
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
      <div class="card p-3 text-center">
        到头了……
      </div>
    </div>
    <div
      v-else-if="source.status === SourceStatus.Loading"
      class="card p-3 text-center"
    >
      加载中
    </div>
  </div>
</template>
