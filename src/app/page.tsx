"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  DEFAULT_THEME_MODE,
  ThemeMode,
  getCurrentThemeMode,
} from "./shared/theme";
import { Header } from "./components/header";
import { useTelegram } from "./shared/hooks/use-telegram";
import { Pools } from "./components/pools";

export default function Home() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useTelegram();

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  useEffect(() => {
    const currentThemeMode = getCurrentThemeMode();
    setThemeMode(currentThemeMode);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.page}>
        <Header />
        <Pools />
      </div>
    </ThemeProvider>
  );
}
