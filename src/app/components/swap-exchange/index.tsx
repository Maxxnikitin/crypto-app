import {
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

export const SwapBlock = () => {
  return (
    <Stack alignItems="flex-end">
      <Stack
        spacing={2}
        sx={{
          backgroundColor: "var(--blocksBackground)",
          padding: 2,
          borderRadius: 2,
          color: "#fff",
        }}
      >
        {/* Верхний инпут с выбором валюты */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <TextField
            variant="standard"
            sx={{
              width: "100%",
              padding: 1,
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .css-1v1lr5m-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before":
                { borderBottom: "none" },
            }}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body1" mr={1}>
                      TON
                    </Typography>
                    <AccountCircle />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Divider />

        {/* Нижний инпут с выводом результата и валютой */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <TextField
            variant="standard"
            sx={{
              width: "100%",
              padding: 1,
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .css-1v1lr5m-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before":
                { borderBottom: "none" },
            }}
            type="number"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body1" mr={1}>
                      USDT
                    </Typography>
                    <AccountCircle />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Stack>
      <Typography variant="caption" sx={{ color: "var(--labelColor)" }}>
        монета 1
      </Typography>
    </Stack>
  );
};
