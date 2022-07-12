<script setup lang="ts">
import { $fetch } from "ohmyfetch";
import dayjs from "dayjs";
import pangu from "pangu";
import { getEndpointImage } from "~/logic/endpoint";
import { SourceMode } from "~/logic/source";

const props = defineProps<{
  hole: hole.HoleEntry
}>();

const source = useSource();
const target = ref(null);
const targetIsVisible = useElementVisibility(target);

const hasReplies = computed(() => source.replies.has(props.hole.entry.id));

const loadReply = async () => {
  try {
    const raw_reply: any = await $fetch(
      getEndpointReply(source.token, props.hole.entry.id).toString(),
      { retry: 3 },
    );
    const reply = getReplyEntries(raw_reply);
    // console.log(reply);
    source.replies.set(props.hole.entry.id, reply);
  }
  catch (error: unknown) {
    source.downloadErrors.push({ type: "reply", hole: props.hole.entry.id });
    console.error(`failed to fetch ${props.hole.entry.id}'s replies: ${error}`);
  }
};

const loadReplyDirty = async () => {
  try {
    await loadReply();
    source.dirty = true;
  }
  catch (error: unknown) {
    console.error(`failed to dirtily fetch ${props.hole.entry.id}'s replies: ${error}`);
  }
};

watch(targetIsVisible, async (newVal, oldVal) => {
  if (newVal && !oldVal && source.mode === SourceMode.Server && !source.replies.has(props.hole.entry.id))
    loadReply();
});

const showReplies = ref(false);
const showImage = () => {
  if (!source.images.has(props.hole.entry.id)) {
    return getEndpointImage(
      (props.hole.entry.kind as hole.kind.Image).url,
    ).toString();
  }
  else {
    return source.images.get(props.hole.entry.id)!;
  }
};
/* const saveImage = (event: Event) => {
  const img: HTMLImageElement = event.target;
} */
</script>

<template>
  <div class="relative flex flex-col gap-2">
    <div
      ref="target"
      class="w-auto rounded shadow text-fg bg-blue-400 dark:bg-blue-500"
      @click="showReplies = !showReplies"
    >
      <img
        v-if="hole.entry.kind.type === 'image'"
        :src="showImage()"
        class="rounded-t w-full"
      >
      <div class="p-3 flex flex-col gap-2">
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-col">
            <span class="font-mono font-bold">#{{ hole.entry.id }}</span>
            <span class="font-mono text-xs">{{
              dayjs(hole.entry.timestamp).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </div>
          <div class="flex flex-col items-end font-mono text-xs">
            <span>
              <span class="inline-block pr-0.5">{{ hole.entry.reply }}</span>
              <div icon-txt i-mdi-reply />
            </span>
            <span>
              <span class="inline-block pr-0.5">{{ hole.entry.likenum }}</span>
              <div icon-txt i-mdi-star />
            </span>
          </div>
        </div>
        <p class="break-words">
          {{ pangu.spacing(hole.entry.text) }}
        </p>
        <template v-if="!hasReplies">
          <div v-if="source.mode === SourceMode.Server" @click="loadReply()">
            <div btn-icon i-mdi-connection />
          </div>
          <div v-else-if="source.mode === SourceMode.Fs" @click="loadReplyDirty()">
            <div btn-icon i-mdi-close-octagon />
          </div>
        </template>
      </div>
    </div>
    <div v-if="showReplies">
      <template v-if="source.replies.has(hole.entry.id)">
        <div class="flex flex-col gap-2 relative">
          <div
            v-for="reply in source.replies.get(hole.entry.id)!"
            :key="reply.entry.id"
            class="shadow rounded"
          >
            <div class="p-3 flex flex-col gap-2">
              <div class="flex flex-row text-xs gap-2">
                <span class="font-bold">{{ reply.entry.name }}</span>
                <span class="font-mono">#{{ reply.entry.id }}</span>
                <span class="font-mono">{{
                  dayjs(reply.entry.timestamp).format("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </div>
              <p class="break-words">
                {{ pangu.spacing(reply.entry.text) }}
              </p>
            </div>
          </div>
          <div class="shadow rounded p-3" @click="showReplies = false">
            折叠回复
          </div>
        </div>
      </template>
      <div v-else class="shadow rounded p-3">
        <div v-if="source.mode === SourceMode.Server" @click="loadReply()">
          回复加载失败，点击重试……
        </div>
        <div v-else-if="source.mode === SourceMode.Fs" @click="loadReplyDirty()">
          回复加载失败，点击尝试从服务器拉取……
        </div>
      </div>
    </div>
  </div>
</template>
