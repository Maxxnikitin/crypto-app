import { CircularProgress, Stack } from "@mui/material";

type Props = {
  size?: number;
  isInline?: boolean;
  className?: string;
};

export const Loader = ({ size = 40, isInline = false, className }: Props) => (
  <Stack
    justifyContent="center"
    alignItems="center"
    position={isInline ? "static" : "fixed"}
    top={0}
    left={0}
    sx={{
      width: isInline ? "fit-content" : "100%",
      height: "100%",
      background: isInline ? "none" : "rgba(0, 0, 0, .3)",
    }}
    className={className}
  >
    <CircularProgress size={size} />
  </Stack>
);
