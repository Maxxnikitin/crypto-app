import { TWallet } from "@/app/shared/types/ton";
import { useTonWebStore } from "@/store/ton-web-store";
import { useWalletsStore } from "@/store/wallets-store";
import TonConnect, { WalletInfo } from "@tonconnect/sdk";
import { useEffect, useState } from "react";
import { TonClient } from "@ton/ton";
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

        // пока хардкодим
        const usdtMasterJetton =
          "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

        const rawData = await tonweb.provider.call2(
          usdtMasterJetton,
          "get_jetton_data",
          []
        );

        // Расшифровываем данные
        const [_totalSupply, _decimals, contentCell, walletCodeCell] = rawData;
        const adminAddress = rawData[4]; // Адрес администратора из master data
        const jettonContentUri = contentCell.bits.toString(); // URI контента
        const jettonWalletCodeHex = walletCodeCell.toString("hex"); // Байткод кошелька

        const jettonMinter = new TonWeb.token.jetton.JettonMinter(
          tonweb.provider,
          {
            address: usdtMasterJetton,
            adminAddress: adminAddress,
            jettonContentUri: jettonContentUri,
            jettonWalletCodeHex: jettonWalletCodeHex,
          }
        );

        const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
          new TonWeb.utils.Address(address)
        );

        const jettonWallet = new TonWeb.token.jetton.JettonWallet(
          tonweb.provider,
          {
            address: jettonWalletAddress,
          }
        );

        const data = await jettonWallet.getData();
        const balanceMinimal = data.balance.toString();

        // Преобразуем в стандартный формат
        const balanceStandard = parseFloat(balanceMinimal) / Math.pow(10, 6);

        saveBalance({ ton, usdt: balanceStandard });
      } else {
        saveWallet(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [saveBalance, saveWallet, saveTonConnect, saveTonWebClient]);

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
