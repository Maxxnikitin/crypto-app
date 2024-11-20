"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { ReactNode } from "react";
import { DEFAULT_THEME_MODE } from "./shared/theme";
import { Header } from "./components/header";
import styles from "./page.module.css";
import { Footer } from "./components/footer";

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  const theme = createTheme({
    palette: {
      mode: DEFAULT_THEME_MODE,
    },
  });

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
