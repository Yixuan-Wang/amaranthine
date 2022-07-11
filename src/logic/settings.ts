import { defineStore } from "pinia";

export const useSettings = defineStore("settings", {
  state: () => {
    const colorMode = useColorMode({
      emitAuto: true,
      storageKey: "color-scheme",
    });

    return {
      colorMode,
      colorModeList: useCycleList(["dark", "light", "auto"], { initialValue: colorMode }),
    };
  },
  actions: {
    nextColorMode() {
      this.colorModeList.next();
    },
  },
});
