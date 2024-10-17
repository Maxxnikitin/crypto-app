"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export const Telegram = () => {
  useEffect(() => {
    if (!window) return;
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
  }, []);
  return <p>tg</p>;
};
