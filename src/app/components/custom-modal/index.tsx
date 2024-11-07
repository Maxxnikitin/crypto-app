import { Box, Dialog, SwipeableDrawer, useMediaQuery } from "@mui/material";
import { ReactEventHandler, ReactNode } from "react";

type TProps = {
  isModalOpen: boolean;
  children: ReactNode;
  handleClose: ReactEventHandler;
};

export const CustomModal = ({ isModalOpen, children, handleClose }: TProps) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  return isDesktop ? (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          background: "var(--backgroundModalGradient)",
          padding: 2,
        },
      }}
    >
      {children}
    </Dialog>
  ) : (
    <SwipeableDrawer
      anchor="bottom"
      open={isModalOpen}
      onClose={handleClose}
      onOpen={() => {}}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 3,
          paddingTop: 1,
          background: "var(--backgroundModalGradient)",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: "#ccc",
            borderRadius: 2,
            mx: "auto",
            mb: 2,
          }}
        />
        {children}
      </Box>
    </SwipeableDrawer>
  );
};
