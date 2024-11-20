import { TBalance } from "@/utils/types";
import { TonClient } from "@ton/ton";
import { create } from "zustand";

type TStore = {
  balance: TBalance | null;
  tonWebClient: TonClient | null;

  saveBalance: (balance: TBalance) => void;
  saveTonWebClient: (tonWebClient: TonClient) => void;
};

export const useTonWebStore = create<TStore>((set) => ({
  balance: null,
  tonWebClient: null,

  saveBalance: (balance) => set({ balance }),

  saveTonWebClient: (tonWebClient) => set({ tonWebClient }),
}));
