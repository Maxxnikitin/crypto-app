import styles from "./page.module.css";
import { Telegram } from "./components/telegram";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Привет, это интеграция с Telegram</h1>
      <p>Здесь будет информация, связанная с пользователем.</p>
      <Telegram />
    </div>
  );
}
