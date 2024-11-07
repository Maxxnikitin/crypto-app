"use client";
import { Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserInfo } from "../user-info";
import { useUserData } from "./hooks";
import { useWalletConnect } from "../wallet-connect/hooks";
import { useRouter, usePathname } from "next/navigation";

export const Header = () => {
  const { balance, isLogoutLoading, handleLogout } = useUserData();
  const { wallet } = useWalletConnect();
  const router = useRouter();
  const path = usePathname();

  const isMainPage = path === "/";

  return (
    <Stack direction="row" justifyContent="space-between" width="100%">
      {!isMainPage && (
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={router.back}
          sx={{
            color: "text.primary",
            textTransform: "none",
          }}
        >
          Назад
        </Button>
      )}
      {wallet && (
        <UserInfo
          balance={balance}
          isLogoutLoading={isLogoutLoading}
          handleLogout={handleLogout}
          sx={{ ml: "auto" }}
        />
      )}
    </Stack>
  );
};
