import { TFrontPool } from "@/utils/types";

export type TPoolTableRow = {
  label: string;
  value: keyof TFrontPool;
  modalData: TPollModalData;
  withTON?: boolean;
};

export type TPollModalData = {
  title: string;
  text: string;
};
