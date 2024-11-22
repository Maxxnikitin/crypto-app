import { Stack, Typography } from "@mui/material";
import { SwapExchange } from "../swap-exchange";
import { Wallet } from "@tonconnect/sdk";
import { TFrontPool, TSwapTokensData } from "@/utils/types";

type TProps = {
  currentPool: TFrontPool;
  swapTokensData: TSwapTokensData;
  wallet: Wallet | null;
};

export const SwapBlock = ({ wallet, currentPool, swapTokensData }: TProps) => {
  return (
    <Stack>
      {wallet ? (
        <SwapExchange
          currentPool={currentPool}
          swapTokensData={swapTokensData}
        />
      ) : (
        <Typography variant="body2" color="gray">
          Подключите кошелек, чтобы войти в пул и все будет супер пупер
        </Typography>
      )}
    </Stack>
  );
};
