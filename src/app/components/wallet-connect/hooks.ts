import { TWallet } from "@/app/shared/types/ton";
import { useTonWebStore } from "@/store/ton-web-store";
import { useWalletsStore } from "@/store/wallets-store";
import TonConnect, { WalletInfo } from "@tonconnect/sdk";
import { useEffect, useState } from "react";
import TonWeb from "tonweb";

export const useWalletConnect = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [connectionLink, setConnectionLink] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    wallet,
    wallets,
    tonConnect,
    saveTonConnect,
    saveWallet,
    handleConnectClick,
  } = useWalletsStore();
  const { balance, saveTonWebConnect, saveBalance } = useTonWebStore();

  const handleClose = () => {
    setIsModalOpen(false);
    setQrCodeUrl(null);
    setConnectionLink(null);
  };

  const handleLogout = () => {
    if (tonConnect?.connect) {
      tonConnect?.disconnect();
    }
  };

  const handleConnectBtnClick = async () => {
    await handleConnectClick();

    setIsModalOpen(true);
  };

  const handleWalletClick = (wallet: WalletInfo) => {
    if (!tonConnect) return;

    const { universalLink, bridgeUrl } = wallet as TWallet;

    if (!universalLink || !bridgeUrl) return;

    const walletConnectionSource = {
      universalLink,
      bridgeUrl,
    };

    const link = tonConnect.connect(walletConnectionSource);

    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      link
    )}`;

    setConnectionLink(link);
    setQrCodeUrl(qrCodeApiUrl);
  };

  useEffect(() => {
    const tonConnect = new TonConnect({
      manifestUrl: `${process.env.NEXT_PUBLIC_DOMEN}/tonconnect-manifest.json`,
    });

    saveTonConnect(tonConnect);

    const tonWebConnect = new TonWeb();

    saveTonWebConnect(tonWebConnect);

    tonConnect.restoreConnection();

    const unsubscribe = tonConnect.onStatusChange(async (walletInfo) => {
      if (walletInfo) {
        saveWallet(walletInfo);
        handleClose();

        const address = walletInfo.account.address;

        const nanoTon = await tonWebConnect.provider.getBalance(address);

        const ton = +(nanoTon as string) / 1e9;

        saveBalance(ton);
      } else {
        saveWallet(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
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
  };
};
