import { TBalance } from "@/utils/types";
import { TonClient } from "@ton/ton";
import TonWeb from "tonweb";
import { create } from "zustand";

type TStore = {
  balance: TBalance | null;
  tonClient: TonClient | null;
  tonWebClient: TonWeb | null;

  saveBalance: (balance: TBalance) => void;
  saveTonClient: (tonWebClient: TonClient) => void;
  saveTonWebClient: (tonWeb: TonWeb) => void;
};

export const useTonWebStore = create<TStore>((set) => ({
  balance: null,
  tonClient: null,
  tonWebClient: null,

  saveBalance: (balance) => set({ balance }),

  saveTonClient: (tonClient) => set({ tonClient }),
  saveTonWebClient: (tonWebClient) => set({ tonWebClient }),
}));
