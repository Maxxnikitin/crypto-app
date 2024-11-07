import { Box, Stack } from "@mui/material";
import { WalletConnect } from "../wallet-connect";
import { useWalletsStore } from "@/store/wallets-store";

export const Footer = () => {
  const { wallet } = useWalletsStore();

  if (!wallet) return null;

  return (
    <Stack
      direction="row"
      justifyContent="center"
      width="100%"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        height: "70px",
      }}
    >
      <WalletConnect />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "70px",
          background:
            "linear-gradient(rgba(0, 3, 23, 0) 0%, rgba(0, 3, 23, 1) 100%)",
          zIndex: -1,
        }}
      />
    </Stack>
  );
};
