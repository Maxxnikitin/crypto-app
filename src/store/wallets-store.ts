import TonConnect, {
  Wallet,
  WalletInfo,
  WalletInfoCurrentlyEmbedded,
  isWalletInfoCurrentlyEmbedded,
} from "@tonconnect/sdk";
import { create } from "zustand";

type TStore = {
  wallets: WalletInfo[] | null;
  wallet: Wallet | null;
  tonConnect: TonConnect | null;

  getWallets: () => Promise<WalletInfo[]>;
  handleConnectClick: () => Promise<void>;
  saveTonConnect: (tonConnect: TonConnect | null) => void;
  saveWallet: (wallet: Wallet | null) => void;
};

export const useWalletsStore = create<TStore>((set, get) => ({
  wallet: null,
  wallets: null,
  tonConnect: null,

  getWallets: async () => {
    const wallets = await TonConnect.getWallets();

    return wallets;
  },

  handleConnectClick: async () => {
    const { tonConnect, getWallets } = get();

    const walletsList = await getWallets();

    const embeddedWallet = walletsList?.find(
      isWalletInfoCurrentlyEmbedded
    ) as WalletInfoCurrentlyEmbedded;

    if (embeddedWallet) {
      tonConnect?.connect({
        jsBridgeKey: embeddedWallet.jsBridgeKey,
      });
      return;
    }

    set({ wallets: walletsList });
  },

  saveTonConnect: (tonConnect) => set({ tonConnect }),

  saveWallet: (wallet) => set({ wallet }),
}));
