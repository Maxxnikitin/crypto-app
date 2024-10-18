export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export const DEFAULT_THEME_MODE = ThemeMode.Dark;

export const getCurrentThemeMode = () =>
  window.matchMedia("(prefers-color-scheme: light)").matches
    ? ThemeMode.Light
    : ThemeMode.Dark;
