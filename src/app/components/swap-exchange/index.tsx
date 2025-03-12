import {
  Button,
  Chip,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

import { TCoins, TFrontPool, TSwapTokensData } from "@/utils/types";
import { SwapInput } from "../swap-input";
import { useUserData } from "../header/hooks";
import { RewardInfo } from "../reward-info";
import { CoinIcon } from "../ui/coin-icon";
import { getJettonBalance } from "@/app/shared/utils";
import { useWalletsStore } from "@/store/wallets-store";
import { useTonWebStore } from "@/store/ton-web-store";

type TProps = {
  swapTokensData: TSwapTokensData;
  currentPool: TFrontPool;
};

export const SwapExchange = ({ swapTokensData, currentPool }: TProps) => {
  const { wallet } = useWalletsStore();
  const { tonWebClient } = useTonWebStore();

  const [currency, setCurrency] = useState<TCoins>("TON");
  const [inputValue, setInputValue] = useState("");
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [commission, setCommission] = useState(0);
  const [commissionText, setCommissionText] = useState("");
  const [currCoinsObj, setCurrCoinsObj] = useState({
    token0Coins: 0,
    token1Coins: 0,
  });
  const [userCoinsBalanceObj, setUserCoinsBalanceObj] = useState<{
    token0: number;
    token1: number;
  } | null>(null);

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
    if (!userCoinsBalanceObj || !balance) return;

    const val = +target.value;
    const dexPrice = +(swapTokensData[currency].dex_usd_price ?? "");
    const calculatedPrice = val / dexPrice;

    const amountEachCoinsUsd = val / 2;

    const token0Coins = amountEachCoinsUsd / +currentPool.token0.dex_usd_price;
    const token1Coins = amountEachCoinsUsd / +currentPool.token1.dex_usd_price;

    setInputValue(target.value);
    setCalculatedValue(calculatedPrice);
    setCurrCoinsObj({ token0Coins, token1Coins });

    if (!val) {
      setCommission(0);
      setCommissionText("");
      return;
    }

    let commission = 0.6; // за предоставление ликвидности по-любому будет столько, даже если баланса хватает

    // а если какой-то монеты не будет хватать, то ещё плюсом накинем
    if (userCoinsBalanceObj.token0 < token0Coins) {
      commission += 0.265;
    }

    if (userCoinsBalanceObj.token1 < token1Coins) {
      commission += 0.265;
    }

    setCommission(commission);

    if (balance.ton < commission) {
      setCommissionText(
        `Недостаточно средств: вам нужно пополнить ${(
          commission - balance.ton
        ).toFixed(4)} TON для завершения операции.`
      );
    } else {
      setCommissionText("Ваш баланс достаточен для выполнения всех операций.");
    }
  };

  // получаем текущий баланс по обеим монетам. Если монета TON или USD₮, то баланс не запрашиваем, он уже есть в стейте юзера
  const handleGetUserCoinsBalance = async () => {
    if (!wallet || !tonWebClient || !balance) return;

    const token0 =
      currentPool.token0.symbol === "TON"
        ? balance.ton
        : currentPool.token0.symbol === "USD₮"
        ? balance.usdt
        : await getJettonBalance({
            userAddress: wallet.account.address,
            masterJettonAddress: currentPool.token0.contractAddress,
            tonWebClient,
            decimals: currentPool.token0.decimals,
          });

    const token1 =
      currentPool.token1.symbol === "TON"
        ? balance.ton
        : currentPool.token1.symbol === "USD₮"
        ? balance.usdt
        : await getJettonBalance({
            userAddress: wallet.account.address,
            masterJettonAddress: currentPool.token1.contractAddress,
            tonWebClient,
            decimals: currentPool.token1.decimals,
          });

    setUserCoinsBalanceObj({ token0, token1 });
  };

  useEffect(() => {
    handleGetUserCoinsBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {userCoinsBalanceObj ? (
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
                  {`${currCoinsObj.token0Coins.toFixed(4).slice(0, 10)} ${
                    currentPool.token0.symbol
                  }`}
                </Typography>
                <CoinIcon icon={currentPool.token0.image} size="s" />
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
                  {`${currCoinsObj.token1Coins.toFixed(4).slice(0, 10)} ${
                    currentPool.token1.symbol
                  }`}
                </Typography>
                <CoinIcon icon={currentPool.token1.image} size="s" />
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
                  {commission} TON
                </Typography>
                <CoinIcon icon={swapTokensData.TON.image_url!} size="s" />
              </Stack>
            </Stack>
            {commissionText && (
              <Typography
                variant="body2"
                color="var(--labelColor)"
                sx={{
                  fontSize: "15px",
                  lineHeight: "20px",
                  textAlign: "left",
                }}
              >
                {commissionText}
              </Typography>
            )}
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
      ) : (
        <Skeleton variant="rectangular" height={417} />
      )}
    </Stack>
  );
};
