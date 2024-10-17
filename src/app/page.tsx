"use client";

import { useTelegram } from "./hooks/use-telegram";
import styles from "./page.module.css";

export default function Home() {
  useTelegram();

  return (
    <div className={styles.page}>
      <h1>Привет, это интеграция с Telegram</h1>
      <p>Здесь будет информация, связанная с пользователем.</p>
    </div>
  );
}
