/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const AppColors = {
  background: "#FFFFFF",
  backgroundAlt: "#F8F9FA",
  surface: "#F0F4F0",
  surfaceAccent: "#E8F5E9",
  title: "#1B5E20",
  label: "#333333",
  inputBorder: "#D5D5D5",
  inputText: "#222222",
  primary: "#2E7D32",
  inactive: "#9AA0A6",
  buttonText: "#FFFFFF",
  secondaryText: "#666666",
  muted: "#999999",
  disabled: "#CCCCCC",
  divider: "#EDEDED",
  danger: "#C62828",
  dangerLight: "#FFCDD2",
};

// Paleta de cores que o usuário escolhe pra identificar cada tratamento
// (no cadastro e nas bolinhas do calendário).
export const CORES_TRATAMENTO = [
  "#2E7D32", // verde
  "#2F6FAD", // azul
  "#7B5EA7", // roxo
  "#C2568C", // rosa
  "#B8860B", // âmbar
  "#0E8F8F", // ciano
];

export const AppFonts = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
