import {
  Button,
  Chip,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AccountCircle } from "@mui/icons-material";
import { ChangeEventHandler, useState } from "react";

import { TCoins, TFrontPool, TSwapTokensData } from "@/utils/types";
import { SwapInput } from "../swap-input";
import { useUserData } from "../header/hooks";
import { RewardInfo } from "../reward-info";

type TProps = {
  swapTokensData: TSwapTokensData;
  currentPool: TFrontPool;
};

export const SwapExchange = ({ swapTokensData, currentPool }: TProps) => {
  const [currency, setCurrency] = useState<TCoins>("TON");
  const [inputValue, setInputValue] = useState("");
  const [calculatedValue, setCalculatedValue] = useState(0);

  const { balance } = useUserData();

  const handleCurrencyChange = ({ target }: SelectChangeEvent<TCoins>) => {
    const currency = target.value as TCoins;
    setCurrency(currency);

    const dexPrice = +(swapTokensData[currency].dex_usd_price ?? "");
    const calculatedPrice = +inputValue * dexPrice;
    setCalculatedValue(calculatedPrice);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const val = +target.value;
    const dexPrice = +(swapTokensData[currency].dex_usd_price ?? "");
    const calculatedPrice = val * dexPrice;

    setInputValue(target.value);
    setCalculatedValue(calculatedPrice);
  };

  return (
    <Stack>
      <Chip
        label={`Осталось ${currentPool.remainingDaysForTokenString}`}
        sx={{
          backgroundColor: "rgba(73, 41, 255, 1)",
          fontSize: 13,
          lineHeight: "20px",
          width: "fit-content",
          maxHeight: "24px",
          alignSelf: "center",
        }}
      />
      <Typography
        variant="body2"
        color="var(--labelColor)"
        sx={{ mt: 3, mb: 2 }}
      >
        Выберите количество монет и зайдите в&nbsp;ликвидность
      </Typography>
      <Stack
        sx={{
          borderRadius: 2,
          border: "1px solid rgb(34, 39, 63)",
        }}
      >
        <SwapInput
          currency={currency}
          balance={balance}
          swapTokensData={swapTokensData}
          inputValue={inputValue}
          calculatedValue={calculatedValue}
          handleCurrencyChange={handleCurrencyChange}
          handleInputChange={handleInputChange}
        />
        {currentPool.rewardsPerCoin.map((item) => {
          return (
            <RewardInfo
              key={item.symbol + item.rewards24Usd}
              data={item}
              inputAmount={inputValue}
              lockedTotalLpUsd={currentPool.lockedTotalLpUsd}
            />
          );
        })}
        <Stack gap="20px" m={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              variant="body2"
              color="var(--labelColor)"
              sx={{ fontSize: "15px", lineHeight: "20px" }}
            >
              Монета 1 в пуле
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{ fontSize: "15px", lineHeight: "20px" }}
              >
                25.5336 TON
              </Typography>
              <AccountCircle />
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              variant="body2"
              color="var(--labelColor)"
              sx={{ fontSize: "15px", lineHeight: "20px" }}
            >
              Монета 2 в пуле
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{ fontSize: "15px", lineHeight: "20px" }}
              >
                500.4345 USDT
              </Typography>
              <AccountCircle />
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography
              variant="body2"
              color="var(--labelColor)"
              sx={{ fontSize: "15px", lineHeight: "20px" }}
            >
              Комиссия
            </Typography>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{ fontSize: "15px", lineHeight: "20px" }}
              >
                0.0866 TON
              </Typography>
              <AccountCircle />
            </Stack>
          </Stack>
        </Stack>
        <Button
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: "var(--accentColor)",
            textTransform: "none",
            fontSize: "15px",
            lineHeight: "20px",
            fontWeight: "normal",
            padding: 2,
          }}
        >
          Подробнее
          <ArrowForwardIosIcon />
        </Button>
      </Stack>
    </Stack>
  );
};
