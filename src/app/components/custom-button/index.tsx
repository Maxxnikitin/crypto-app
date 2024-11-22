import { Button, ButtonProps } from "@mui/material";

type TProps = ButtonProps;

export const CustomButton = (props: TProps) => {
  return (
    <Button
      {...props}
      sx={{
        minHeight: 50,
        minWidth: 50,
        width: "100%",
        borderRadius: 4,
        backgroundColor: "var(--buttonBg)",
        color: "white",
        fontSize: 16,
        "&:hover": {
          backgroundColor: "var(--buttonHoverBg)",
        },
      }}
    />
  );
};
