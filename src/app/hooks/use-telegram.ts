"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export const useTelegram = () => {
  useEffect(() => {
    const onLoad = () => {
      if (typeof window !== "undefined") {
        // Когда приложение готово, можно использовать методы WebApp
        WebApp.ready(); // Сообщаем, что Web App готов
        WebApp.expand(); // Расширяем приложение на весь экран

        // WebApp.showAlert("Hey there!");

        // // Получаем данные пользователя
        const userData = WebApp.initDataUnsafe.user;
        alert(userData);

        // if (userData) {
        //   WebApp.showAlert(JSON.stringify(userData));
        // }
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
};
