"use client";

import { useTelegram } from "./shared/hooks/use-telegram";
import { Pools } from "./components/pools";

export default function Home() {
  useTelegram();

  return <Pools />;
}
