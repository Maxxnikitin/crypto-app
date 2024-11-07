import { Box, Dialog, SwipeableDrawer, useMediaQuery } from "@mui/material";
import { TPollModalData } from "@/app/shared/types/pool";
import { ReactEventHandler, ReactNode } from "react";

type TProps = {
  modalData: TPollModalData | null;
  isModalOpen: boolean;
  children: ReactNode;
  handleClose: ReactEventHandler;
};

export const CustomModal = ({
  modalData,
  isModalOpen,
  children,
  handleClose,
}: TProps) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  return isDesktop ? (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          background:
            "linear-gradient(180deg, rgba(22, 1, 78, 1) 0%, rgba(1, 10, 49, 1) 50%, rgba(0, 3, 23, 1) 100%)",
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
          background:
            "linear-gradient(180deg, rgba(22, 1, 78, 1) 0%, rgba(1, 10, 49, 1) 50%, rgba(0, 3, 23, 1) 100%)",
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
