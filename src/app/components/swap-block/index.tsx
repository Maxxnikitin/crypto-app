import { Stack, Typography } from "@mui/material";
import { SwapBlock } from "../swap-exchange";

export const SwapExchange = () => {
  return (
    <Stack>
      <Typography variant="body2" color="gray">
        Подключите кошелек, чтобы войти в пул и все будет супер пупер
      </Typography>
      <SwapBlock />
    </Stack>
  );
};
