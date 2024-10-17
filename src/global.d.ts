interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user: User;
  };
  close(): void;
  sendData(data: string): void;
  expand(): void;
  ready(): void;
}

export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export {};
