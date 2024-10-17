"use client";

import { TWallet } from "@/app/shared/types/ton";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  TonConnect,
  isWalletInfoCurrentlyEmbedded,
  WalletInfo,
  WalletInfoCurrentlyEmbedded,
} from "@tonconnect/sdk";

import { MouseEventHandler, useEffect, useRef, useState } from "react";

export const WalletConnect = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [wallets, setWallets] = useState<WalletInfo[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const tonConnectRef = useRef<TonConnect | null>(null);

  const handleConnectClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const walletsList = await getWallets();

    const embeddedWallet = walletsList.find(
      isWalletInfoCurrentlyEmbedded
    ) as WalletInfoCurrentlyEmbedded;

    if (embeddedWallet) {
      tonConnectRef.current?.connect({
        jsBridgeKey: embeddedWallet.jsBridgeKey,
      });
      return;
    }
    setWallets(walletsList);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const getWallets = async () => {
    const walletsList = await TonConnect.getWallets();

    return walletsList;
  };

  const onWalletClick = (wallet: WalletInfo) => {
    if (!tonConnectRef.current) return;

    const { universalLink, bridgeUrl } = wallet as TWallet;

    if (universalLink && bridgeUrl) {
      const walletConnectionSource = {
        universalLink,
        bridgeUrl,
      };

      const link = tonConnectRef.current.connect(walletConnectionSource);

      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        link
      )}`;

      setQrCodeUrl(qrCodeApiUrl);
    }
  };

  useEffect(() => {
    const tonConnect = new TonConnect({
      manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
    });

    tonConnectRef.current = tonConnect;

    tonConnect.restoreConnection();

    const unsubscribe = tonConnect.onStatusChange((walletInfo) => {
      console.log(111, "status: ", walletInfo);
    });
  }, []);

  return (
    <Stack>
      <Button variant="contained" onClick={handleConnectClick}>
        Подключить кошелёк
      </Button>
      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Stack direction="column" overflow="hidden">
            <Typography variant="h6" align="center" gutterBottom>
              Доступные кошельки
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              p={2}
              sx={{
                overflowX: "auto", // горизонтальный скролл
                display: "flex",
              }}
            >
              {wallets?.map((wallet) => (
                <Box
                  key={wallet.name}
                  onClick={() => onWalletClick(wallet)}
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    minWidth: "100px", // Устанавливаем минимальную ширину для элементов
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
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
