import localforage from "localforage";
import { defineStore } from "pinia";
import LOOKS from "./looks.json";

export const useSettings = defineStore("settings", {
  state: () => {
    const colorMode = useColorMode({
      emitAuto: true,
      storageKey: "color-scheme",
    });

    const preferDark = usePreferredDark();
    const actualColorMode = computed(() => colorMode.value === "auto" ? (preferDark.value ? "dark" : "light") : colorMode.value);

    const look = useStorage<keyof typeof LOOKS>("look", "default");

    return {
      colorMode,
      actualColorMode,
      colorModeList: useCycleList(["dark", "light", "auto"], { initialValue: colorMode }),
      look,
      lookList: useCycleList(Object.keys(LOOKS), { initialValue: look }),
    };
  },
  getters: {
    backgroundImgUrl: state => `url(${LOOKS[state.look].image})`,
    accentColor: state => LOOKS[state.look].palette[state.actualColorMode].join(","),
    currentLook: state => LOOKS[state.look],
    // backgroundImgData: async state => await downloadImage(state.backgroundImg),
  },
  actions: {
    nextColorMode() {
      this.colorModeList.next();
    },
    nextLook() {
      this.lookList.next();
    },
    clearAll() {
      // eslint-disable-next-line no-alert
      const ok = confirm("您确定要【删除全部数据】吗？但您在文件系统中的 JSON 文件不会被删除。");
      if (ok) {
        localStorage.clear();
        localforage.clear();
        // eslint-disable-next-line no-alert
        alert("全部数据已清除。");
        location.reload();
      }
    },
  },
});
