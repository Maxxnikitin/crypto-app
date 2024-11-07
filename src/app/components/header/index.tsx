import { Stack } from "@mui/material";
import { UserInfo } from "../user-info";
import { useUserData } from "./hooks";
import { useWalletConnect } from "../wallet-connect/hooks";

export const Header = () => {
  const { balance, handleLogout } = useUserData();
  const { wallet } = useWalletConnect();

  if (!wallet) return null;

  return (
    <Stack direction="row" justifyContent="flex-end" width="100%">
      <UserInfo balance={balance} handleLogout={handleLogout} />
    </Stack>
  );
};
