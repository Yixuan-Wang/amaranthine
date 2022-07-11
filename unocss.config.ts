import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    ["btn", "flex flex-row justify-center items-center"],
    ["btn-icon", "inline-block cursor-pointer select-none transition duration-200 ease-in-out hover:text-acc !outline-none"],
    ["icon-txt", "inline-block align-sub"],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "sub",
        "width": "1.25em",
        "height": "1.25em",
      },
    }),
    presetWebFonts({
      fonts: {
        sans: ["Inter", "Noto Sans CJK SC"],
        serif: ["Roboto Slab"],
        mono: ["JetBrains Mono"],
      },
    }),
  ],
  theme: {
    colors: {
      bgd: "var(--color-background)",
      fgd: "var(--color-foreground)",
      acc: "var(--color-accent)",
    },
  },
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
});
