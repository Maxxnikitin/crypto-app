"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode, useState, useEffect } from "react";
import {
  DEFAULT_THEME_MODE,
  ThemeMode,
  getCurrentThemeMode,
} from "./shared/theme";
import { Header } from "./components/header";
import styles from "./page.module.css";
import { Footer } from "./components/footer";

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);

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
        {children}
        <Footer />
      </div>
    </ThemeProvider>
  );
};
