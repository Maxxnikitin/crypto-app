import { Box, BoxProps } from "@mui/material";
import { TCoins } from "@/utils/types";

type TProps = BoxProps & {
  icon: string;
  size?: "s" | "m";
};

export const CoinIcon = ({ icon, size = "s", ...rest }: TProps) => {
  return (
    <Box
      component="img"
      src={icon}
      alt="Иконка."
      style={{
        width: size === "s" ? 24 : 48,
        height: size === "s" ? 24 : 48,
        borderRadius: "50%",
      }}
      {...rest}
    />
  );
};
