import { TRewardsPerCoin } from "@/utils/types";
import { Chip, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type TProps = {
  data: TRewardsPerCoin;
  inputAmount: string;
  lockedTotalLpUsd: number;
};

export const RewardInfo = ({ data, inputAmount, lockedTotalLpUsd }: TProps) => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!inputAmount) setAmount(0);

    const userShare = +inputAmount / lockedTotalLpUsd;

    const currentProfit =
      data.rewards24Usd * userShare * data.remainingDaysForToken;

    setAmount(parseFloat(currentProfit.toFixed(4)));
  }, [inputAmount]);

  return (
    <Stack
      direction="column"
      mx={2}
      py={2}
      borderBottom="1px solid rgb(34, 39, 63)"
    >
      <Typography
        variant="body2"
        color="var(--labelColor)"
        sx={{ mb: 1, textAlign: "start" }}
      >
        {`Прибыль за ${data.remainingDaysForTokenString}`}
      </Typography>
      <Chip
        label={`+ ${amount} $`}
        sx={{
          backgroundColor: "rgba(73, 41, 255, 1)",
          color: "white",
          fontSize: 24,
          lineHeight: "32px",
          width: "fit-content",
          maxHeight: "32px",
          borderRadius: "10px",
        }}
      />
      <Typography
        variant="body2"
        color="var(--labelColor)"
        sx={{ mt: 2, textAlign: "start" }}
      >
        {`Распределяется в монете ${data.symbol}`}
      </Typography>
    </Stack>
  );
};
