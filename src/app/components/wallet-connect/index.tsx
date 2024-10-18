"use client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Link,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";

import { UserInfo } from "../user-info";
import { useWalletConnect } from "./hooks";

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
    balance,
    handleClose,
    handleLogout,
    handleWalletClick,
    handleConnectBtnClick,
  } = useWalletConnect();

  return (
    <Stack sx={sx}>
      {wallet ? (
        <UserInfo balance={balance} handleLogout={handleLogout} />
      ) : (
        <Button variant="contained" onClick={handleConnectBtnClick}>
          Connect wallet
        </Button>
      )}
      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Stack direction="column" overflow="hidden">
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
                Link to connect
              </Link>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
