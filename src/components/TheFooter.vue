<script setup lang="ts">
import { SourceMode } from "~/logic/source";
const settings = useSettings();
const source = useSource();
const version = import.meta.env.PACKAGE_VERSION;
</script>

<template>
  <nav class="text-xl inline-flex gap-3 rounded shadow p-3 bg-bgd">
    <base-tooltip>
      <button btn @click="settings.nextColorMode()">
        <div v-if="settings.colorMode === 'auto'" btn-icon i-mdi-brightness-auto />
        <div v-else-if="settings.colorMode === 'light'" btn-icon i-mdi-brightness-7 />
        <div v-else btn-icon i-mdi-brightness-4 />
      </button>
      <template #tooltip>
        <p>颜色模式</p>
      </template>
    </base-tooltip>

    <base-tooltip>
      <base-modal container-class="justify-center">
        <div btn-icon i-mdi-settings />
        <template #modal>
          <settings-source />
        </template>
      </base-modal>
      <template #tooltip>
        <p>设置</p>
      </template>
    </base-tooltip>

    <base-tooltip>
      <button btn @click="source.dumpAll()">
        <div v-if="source.mode === SourceMode.Fs && source.dirty" btn-icon color-red-500 i-mdi-folder-alert />
        <div v-else-if="source.mode === SourceMode.Server && !source.hasAllReplies" btn-icon color-red-500 i-mdi-folder-cancel />
        <div v-else btn-icon i-mdi-folder-download />
      </button>
      <template #tooltip>
        <p>
          本地化
          {{ source.mode === SourceMode.Fs && source.dirty ? "- 更改未保存" : "" }}
          {{ source.mode === SourceMode.Server && !source.hasAllReplies ? "- 有回复未加载" : "" }}
        </p>
      </template>
    </base-tooltip>

    <base-tooltip>
      <button btn>
        <div btn-icon i-mdi-information />
      </button>
      <template #tooltip>
        <p class="font-mono">v{{ version }}</p>
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
  </nav>
</template>
