import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CoinIcon } from "../ui/coin-icon";
import { TBalance, TCoins, TSwapTokensData } from "@/utils/types";
import { ChangeEventHandler } from "react";

type TProps = {
  currency: TCoins;
  balance: TBalance | null;
  swapTokensData: TSwapTokensData;
  inputValue: string;
  calculatedValue: number;
  handleCurrencyChange: (e: SelectChangeEvent<TCoins>) => void;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
};

export const SwapInput = ({
  currency,
  balance,
  swapTokensData,
  inputValue,
  calculatedValue,
  handleCurrencyChange,
  handleInputChange,
}: TProps) => {
  const currBalance = currency === "USDT" ? balance?.usdt : balance?.ton;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      gap="12px"
      sx={{ outline: "1px solid rgb(91, 97, 255)", borderRadius: 2 }}
    >
      <Stack>
        <TextField
          variant="standard"
          sx={{
            width: "100%",
            marginBottom: "2px",
            "& .MuiInput-underline:before": { borderBottom: "none" },
            "& .MuiInput-underline:after": { borderBottom: "none" },
          }}
          value={inputValue}
          onChange={handleInputChange}
          type="number"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1">$</Typography>
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography
          variant="body2"
          color="rgb(89, 89, 89)"
          sx={{ fontSize: "15px", lineHeight: "20px", textAlign: "left" }}
        >
          {`${parseFloat(calculatedValue.toFixed(4))} ${currency}`}
        </Typography>
      </Stack>
      <Stack>
        <Select
          value={currency}
          onChange={handleCurrencyChange}
          variant="standard"
          disableUnderline
        >
          <MenuItem value="TON">TON</MenuItem>
          <MenuItem value="USDT">USDT</MenuItem>
        </Select>
        <Stack direction="row" alignItems="center">
          <Box
            component="img"
            src={"/icons/wallet.svg"}
            alt="Иконка кошелька"
            style={{
              width: 16,
              height: 16,
            }}
          />
          <Typography
            variant="body2"
            color="var(--accentColor)"
            sx={{ fontSize: "15px", lineHeight: "20px", ml: "4px" }}
          >
            {currBalance ? parseFloat(currBalance.toFixed(4)) : "—"}
          </Typography>
        </Stack>
      </Stack>
      <CoinIcon icon={swapTokensData[currency].image_url!} size="m" />
    </Stack>
  );
};
