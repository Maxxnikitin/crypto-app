import { usdtMasterJetton } from "@/app/shared/constants/coins";
import { TWallet } from "@/app/shared/types/ton";
import { getJettonBalance } from "@/app/shared/utils";
import { useStonFiStore } from "@/store/ston-fi-store";
import { useTonWebStore } from "@/store/ton-web-store";
import { useWalletsStore } from "@/store/wallets-store";
import TonConnect, { WalletInfo } from "@tonconnect/sdk";
import { useEffect, useState } from "react";
import TonWeb from "tonweb";

export const useWalletConnect = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [connectionLink, setConnectionLink] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { swapTokensData } = useStonFiStore();

  const {
    wallet,
    wallets,
    tonConnect,
    saveTonConnect,
    saveWallet,
    handleConnectClick,
  } = useWalletsStore();
  const { saveTonWebClient, saveBalance } = useTonWebStore();

  const handleClose = () => {
    setIsModalOpen(false);
    setQrCodeUrl(null);
    setConnectionLink(null);
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

    tonConnect.restoreConnection();

    const unsubscribe = tonConnect.onStatusChange(async (walletInfo) => {
      if (walletInfo) {
        saveWallet(walletInfo);
        handleClose();

        const tonweb = new TonWeb(
          new TonWeb.HttpProvider(process.env.NEXT_PUBLIC_TON_WEB_PROVIDER, {
            apiKey: process.env.NEXT_PUBLIC_TON_WEB_API,
          })
        );

        saveTonWebClient(tonweb);

        const address = walletInfo.account.address;

        // получаем баланс в ТОНах
        const addressInfo = await tonweb.provider.getAddressInfo(address);
        const ton = +TonWeb.utils.fromNano(addressInfo.balance);

        const usdt = await getJettonBalance({
          userAddress: address,
          masterJettonAddress: usdtMasterJetton,
          tonWebClient: tonweb,
          decimals: 6,
        });

        saveBalance({ ton, usdt });
      } else {
        saveWallet(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    swapTokensData,
    saveBalance,
    saveWallet,
    saveTonConnect,
    saveTonWebClient,
  ]);

  return {
    wallet,
    wallets,
    qrCodeUrl,
    connectionLink,
    isModalOpen,
    handleClose,
    handleWalletClick,
    handleConnectBtnClick,
  };
};
