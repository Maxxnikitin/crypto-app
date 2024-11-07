import { useTonWebStore } from "@/store/ton-web-store";
import { useWalletsStore } from "@/store/wallets-store";
import { useState } from "react";

export const useUserData = () => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const { balance } = useTonWebStore();
  const { tonConnect, saveWallet, saveTonConnect } = useWalletsStore();

  const handleLogout = async () => {
    if (tonConnect?.connect) {
      setIsLogoutLoading(true);
      await tonConnect?.disconnect();
      saveWallet(null);
      saveTonConnect(null);
      setIsLogoutLoading(false);
    }
  };

  return {
    balance,
    isLogoutLoading,
    handleLogout,
  };
};
