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
    ["shadowed", "shadowed-light dark:shadowed-dark"],
    ["card", "shadowed rounded backdrop-blur bg-bgd/75"],
  ],
  rules: [
    ["shadowed-light", { "box-shadow": "0 2px 6px -2px rgba(var(--color-accent), 0.75), 0 4px 6px -1px rgb(0 0 0 / 0.25)" }],
    ["shadowed-dark", { "box-shadow": "0 2px 6px -2px rgba(var(--color-accent), 0.75), 0 4px 4px -1px rgb(0 0 0 / 0.5)" }],
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
  safelist: [
    "justify-start",
    "justify-end",
    "justify-center",
  ],
  theme: {
    colors: {
      bgd: "rgb(var(--color-background))",
      fgd: "rgb(var(--color-foreground))",
      acc: "rgb(var(--color-accent))",
    },
  },
});
