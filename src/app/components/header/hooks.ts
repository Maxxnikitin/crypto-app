import { useTonWebStore } from "@/store/ton-web-store";
import { useWalletsStore } from "@/store/wallets-store";

export const useUserData = () => {
  const { balance } = useTonWebStore();
  const { tonConnect } = useWalletsStore();

  const handleLogout = () => {
    if (tonConnect?.connect) {
      tonConnect?.disconnect();
    }
  };

  return {
    balance,
    handleLogout,
  };
};
