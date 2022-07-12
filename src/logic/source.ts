import dayjs from "dayjs";
import { $fetch } from "ohmyfetch";
import { defineStore } from "pinia";
import { getFsArchive, setFsArchive } from "~/logic/cache";

const FETCH_OPTIONS: Parameters<typeof $fetch>[1] = {
  retry: 3,
};

export const enum SourceMode {
  Server,
  Fs,
}

export const enum SourceStatus {
  Idle,
  Loading,
  Downloading,
  Ok,
  Err,
}

export interface SourceDownloadErr {
  type: "reply" | "image"
  hole: number
}

export const useSource = defineStore("source", {
  state: () => ({
    mode: useStorage<SourceMode>("source-mode", SourceMode.Server),
    token: useStorage("token", ""),
    fsArchiveListener: useCounter(),
    fsArchiveName: useStorage("fs-archive-name", ""),
    holes: ref<hole.HoleEntry[]>([]),
    replies: ref<Map<number, hole.ReplyEntry[]>>(new Map()),
    images: ref<Map<number, string>>(new Map()),
    downloadErrors: ref<SourceDownloadErr[]>([]),
    status: ref(SourceStatus.Idle),
    dirty: ref(false),
  }),
  actions: {
    async loadSource() {
      this.status = SourceStatus.Loading;
      try {
        switch (this.mode) {
          case SourceMode.Server:
            if (this.token === "") {
              this.status = SourceStatus.Idle;
              return;
            }
            await this.loadSourceFromServer();
            break;
          case SourceMode.Fs:
            this.loadSourceFromFs();
            break;
          default:
            break;
        }
        this.status = SourceStatus.Ok;
        this.dirty = false;
      }
      catch (error: unknown) {
        this.status = SourceStatus.Err;
        this.holes = [];
        console.error(error);
      }
    },
    async loadSourceFromServer() {
      this.replies.clear();
      this.images.clear();
      const raw_page = await $fetch(getEndpointAttention(this.token).toString(), FETCH_OPTIONS);
      const fetchedEntries = getHoleEntries(raw_page);
      this.holes = fetchedEntries;
      this.status = SourceStatus.Downloading;
      this.downloadErrors.splice(0);

      const downloadProcess = fetchedEntries.map(async ({ entry: hole }) => (async () => {
        const raw_reply: any = await $fetch(getEndpointReply(this.token, hole.id).toString(), FETCH_OPTIONS);
        const reply = getReplyEntries(raw_reply);
        // console.log(reply);
        this.replies.set(hole.id, reply);
      })());
      await Promise.allSettled(downloadProcess);
      this.status = SourceStatus.Ok;
    },
    async loadSourceFromFs() {
      this.status = SourceStatus.Loading;
      const { holes, replies } = await getFsArchive();
      this.holes = parseHoleEntries(holes);
      this.replies = new Map(Object.entries(replies).map(([id, archiveEntries]) => ([+id, parseReplyEntries(archiveEntries)])));
      this.images = new Map();
      this.status = SourceStatus.Ok;
    },
    async updateFsCache(archive: hole.Archive) {
      try {
        await setFsArchive(archive);
        this.loadSource();
      }
      catch (err: unknown) {
        console.error(err);
      }
    },
    dumpAll() {
      const dumpedHoles = dumpHoleEntries(this.holes);
      const dumpedReplies = Object.fromEntries(Array.from(this.replies.entries()).map(([id, replies]) => [id, dumpReplyEntries(replies)]));
      const archive: hole.Archive = {
        holes: dumpedHoles,
        replies: dumpedReplies,
        images: {},
      };
      download(JSON.stringify(archive), `amaranthine-backup-${dayjs().format("YYMMDD-HHmmss")}.json`, "text/plain");
    },
  },
});
