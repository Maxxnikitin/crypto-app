"use client";
import {
  Box,
  Dialog,
  DialogContent,
  Link,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";

import { useWalletConnect } from "./hooks";
import { CustomButton } from "../custom-button";
import { CustomModal } from "../custom-modal";

type TProps = {
  sx?: SxProps;
};

export const WalletConnect = ({ sx }: TProps) => {
  const {
    wallet,
    wallets,
    qrCodeUrl,
    connectionLink,
    isModalOpen,
    handleClose,
    handleWalletClick,
    handleConnectBtnClick,
  } = useWalletConnect();

  if (wallet) return null;

  return (
    <Stack sx={{ width: "100%", maxWidth: "400px", paddingX: 2, ...sx }}>
      <CustomButton variant="contained" onClick={handleConnectBtnClick}>
        Подключить кошелёк
      </CustomButton>
      <CustomModal isModalOpen={isModalOpen} handleClose={handleClose}>
        <Stack direction="column" overflow="hidden" p={0}>
          <Typography variant="h6" align="center" gutterBottom>
            Доступные кошельки
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              display: "flex",
            }}
          >
            {wallets?.map((wallet) => (
              <Box
                key={wallet.name}
                onClick={() => handleWalletClick(wallet)}
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  minWidth: "85px",
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                  alt={wallet.name}
                  src={wallet.imageUrl}
                />
                <Typography variant="body2">{wallet.name}</Typography>
              </Box>
            ))}
          </Stack>
          {qrCodeUrl && (
            <Box
              component="img"
              mt={2}
              sx={{
                height: 200,
                width: 200,
                objectFit: "cover",
                alignSelf: "center",
              }}
              alt={"qr-code"}
              src={qrCodeUrl}
            />
          )}
          {connectionLink && (
            <Link
              href={connectionLink}
              target="_blank"
              rel="noopener"
              sx={{ alignSelf: "center", mt: 2 }}
            >
              Ссылка для подключения
            </Link>
          )}
        </Stack>
      </CustomModal>
    </Stack>
  );
};
