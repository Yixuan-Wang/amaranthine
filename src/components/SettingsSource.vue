<script setup lang="ts">
import { SourceMode } from "~/logic/source";
const source = useSource();

const { files: fsSourceFiles, open: openFsSource } = useFileDialog({
  multiple: false,
  accept: "application/json",
});

const fileStatus = ref<"idle" | "ok" | "err">("idle");
const fsSourceFile = ref<File>();
watch(fsSourceFiles, async (value) => {
  const fileList = value as unknown as FileList;
  const theFile = fileList.item(0);
  if (theFile) {
    fsSourceFile.value = theFile;
    try {
      const archive = await uploadJSON<hole.Archive>(theFile);
      await source.updateFsCache(archive);
      source.fsArchiveName = theFile.name;
      // console.log(archive);
      fileStatus.value = "ok";
    }
    catch (error: unknown) {
      fileStatus.value = "err";
    }
  }
  else {
    fileStatus.value = "idle";
  }
});
</script>

<template>
  <main
    class="bg-green-500 text-fgd rounded shadow p-4 grid justify-start"
    grid="rows-[auto_1fr] gap-3"
  >
    <nav class="flex flex-row gap-2">
      <base-tooltip>
        <button btn @click="source.mode = SourceMode.Server">
          <div btn-icon i-mdi-server-network />
        </button>
        <template #tooltip>
          <p>服务器源</p>
        </template>
      </base-tooltip>
      <base-tooltip>
        <button btn @click="source.mode = SourceMode.Fs">
          <div btn-icon i-mdi-folder />
        </button>
        <template #tooltip>
          <p>文件系统源</p>
        </template>
      </base-tooltip>
    </nav>
    <div v-if="source.mode === SourceMode.Server" class="grid grid-cols-[auto_1fr] gap-2 justify-start">
      <base-tooltip>
        <div i-mdi-key />
        <template #tooltip>
          <p>Token</p>
        </template>
      </base-tooltip>
      <input v-model="source.token" class="font-mono rounded px-2 bg-bgd text-left">
    </div>
    <div v-else-if="source.mode === SourceMode.Fs" class="grid grid-cols-[auto_1fr] gap-2 align-start">
      <base-tooltip>
        <button btn class="relative top-[0.125rem]" @click="openFsSource()">
          <div btn-icon i-mdi-upload />
        </button>
        <template #tooltip>
          <p>读取</p>
        </template>
      </base-tooltip>
      <div>
        <p v-if="fileStatus === 'ok'">
          <span inline-block i-mdi-check mr-1 />
          <span class="font-mono">{{ fsSourceFile?.name }}</span>
        </p>
        <div v-else-if="fileStatus === 'err'" i-mdi-cross />
        <p v-else-if="source.fsArchiveName !== ''">
          <span class="font-mono">{{ source.fsArchiveName }}</span>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: min(65ch, calc(100vw - 1em));
}
</style>
