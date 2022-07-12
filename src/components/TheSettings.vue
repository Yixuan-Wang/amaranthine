<script setup lang="ts">
import { SourceMode } from "~/logic/source";
const source = useSource();
const settings = useSettings();

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

/* const { colorPalette } = storeToRefs(settings);
const palette = ref<[number, number, number][]>([]);
const loadPalette = async (val: any) => palette.value = (await val) as [number, number, number][];
colorPalette.value.then(loadPalette);
watch(colorPalette, loadPalette); */
</script>

<template>
  <main
    class="bg-bgd text-fgd card p-4 flex flex-col gap-3"
  >
    <nav class="flex flex-row gap-2">
      <base-tooltip>
        <button btn :style="{ opacity: source.mode === SourceMode.Server ? '1' : '0.5' }" @click="source.mode = SourceMode.Server">
          <div btn-icon i-mdi-server-network />
        </button>
        <template #tooltip>
          <p>服务器源</p>
        </template>
      </base-tooltip>
      <base-tooltip>
        <button btn :style="{ opacity: source.mode === SourceMode.Fs ? '1' : '0.5' }" @click="source.mode = SourceMode.Fs">
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
    <hr>
    <div class="inline-flex flex-cols gap-2">
      <base-tooltip>
        <button btn @click="settings.nextLook()">
          <div btn-icon i-mdi-palette />
        </button>
        <template #tooltip>
          <p>外观</p>
        </template>
      </base-tooltip>
      <span>
        {{ settings.currentLook.name }}(©{{ settings.currentLook.author }})
      </span>
      <span>
        <span>
          <span
            v-for="color, id in Object.values(settings.currentLook.palette)"
            :key="id"
          >
            <span inline-block i-mdi-circle :style="{ color: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }" />
          </span>
        </span>
      </span>
    </div>
    <hr>
    <div class="inline-flex flex-cols gap-2 self-start items-start">
      <base-tooltip class="self-start">
        <button btn @click="settings.clearAll()">
          <div btn-icon text-red-500 i-mdi-delete />
        </button>
        <template #tooltip>
          <p>删除全部数据</p>
        </template>
      </base-tooltip>
      <base-tooltip>
        <button btn>
          <a
            btn-icon
            i-mdi-github
            rel="noreferrer"
            href="https://github.com/Yixuan-Wang/amaranthine"
            target="_blank"
            title="GitHub"
          />
        </button>
        <template #tooltip>
          <p>源代码</p>
        </template>
      </base-tooltip>
    </div>
  </main>
</template>

<style scoped>
main {
  width: min(65ch, calc(100vw - 1em));
}
</style>
