import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { TUser } from "../types/telegram";

export const useTelegram = () => {
  const [tgUser, setTgUser] = useState<TUser | null>(null);
  useEffect(() => {
    const onLoad = () => {
      if (typeof window !== "undefined") {
        // Когда приложение готово, можно использовать методы WebApp
        WebApp.ready(); // Сообщаем, что Web App готов
        WebApp.expand(); // Расширяем приложение на весь экран

        // Получаем данные пользователя
        const userData = WebApp.initDataUnsafe.user as TUser;
        if (userData) setTgUser(userData);
      }
    };

    // Устанавливаем обработчик события, когда документ будет загружен
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return { tgUser };
};
