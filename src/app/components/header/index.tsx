import { Stack } from "@mui/material";
import { WalletConnect } from "../wallet-connect";

export const Header = () => {
  return (
    <Stack direction="row" justifyContent="flex-end" width="100%">
      <WalletConnect />
    </Stack>
  );
};
