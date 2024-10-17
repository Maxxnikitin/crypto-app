"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Инициализация Telegram Web App API
    if (typeof window !== "undefined" && "Telegram" in window) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready(); // Сообщаем Telegram, что приложение готово
      tg.expand(); // Расширяем Web App на весь экран

      setUser(tg.initDataUnsafe?.user); // Выводим информацию о пользователе
    }
  }, []);

  return (
    <div className={styles.page}>
      <h1>Привет, это интеграция с Telegram</h1>
      <p>Здесь будет информация, связанная с пользователем.</p>
      {user &&
        Object.entries(user).map(([key, val]) => (
          <p>{`key: ${key}, value: ${val}`}</p>
        ))}
    </div>
  );
}
