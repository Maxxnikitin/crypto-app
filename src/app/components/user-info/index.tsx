import { IconButton, Menu, Stack, StackProps, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { MouseEventHandler, useState } from "react";
import { TBalance } from "@/utils/types";

type TProps = StackProps & {
  isLogoutLoading: boolean;
  balance?: TBalance | null;
  handleLogout: () => void;
};

export const UserInfo = ({
  isLogoutLoading,
  balance,
  handleLogout,
  ...rest
}: TProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = ({
    currentTarget,
  }) => {
    setAnchorEl(currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack {...rest}>
      <IconButton
        aria-controls="user-data-menu"
        onClick={handleOpen}
        sx={{ display: "flex", gap: 1, borderRadius: 1 }}
      >
        <AccountCircleIcon />
        {anchorEl ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <Menu
        id="user-data-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
      >
        <Stack direction="column" pl={2} pr={2}>
          <IconButton
            onClick={handleLogout}
            disabled={isLogoutLoading}
            sx={{ alignSelf: "flex-end", mb: 1 }}
          >
            <LogoutIcon />
          </IconButton>
          <Typography variant="body1" align="center" mb={1}>
            BALANCE:
          </Typography>
          <Typography variant="h5" align="center">
            TON: {balance?.ton.toFixed(4) ?? 0}
          </Typography>
          <Typography variant="h5" align="center">
            USDT: {balance?.usdt.toFixed(4) ?? 0}
          </Typography>
        </Stack>
      </Menu>
    </Stack>
  );
};
