import TonWeb from "tonweb";
import { create } from "zustand";

type TStore = {
  balance: number | null;
  tonWebConnect: TonWeb | null;

  saveBalance: (wallet: number) => void;
  saveTonWebConnect: (tonWebConnect: TonWeb) => void;
};

export const useTonWebStore = create<TStore>((set, get) => ({
  balance: null,
  tonWebConnect: null,

  saveBalance: (balance) => set({ balance }),

  saveTonWebConnect: (tonWebConnect) => set({ tonWebConnect }),
}));
