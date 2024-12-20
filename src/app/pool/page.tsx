"use client";

import { useStonFiStore } from "@/store/ston-fi-store";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment, ReactEventHandler, useEffect, useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useRouter } from "next/navigation";
import { CustomButton } from "../components/custom-button";
import { TPollModalData } from "../shared/types/pool";
import { CustomModal } from "../components/custom-modal";
import { Loader } from "../components/loader";
import { useWalletsStore } from "@/store/wallets-store";
import { SwapBlock } from "../components/swap-block";
import { POOL_DATA_TABLE_ROWS } from "../shared/constants/pools";

export default function Pool() {
  const { currentPool, swapTokensData } = useStonFiStore();
  const { wallet } = useWalletsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<TPollModalData | null>(null);

  const { push } = useRouter();

  const handleOpen = (data: TPollModalData) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const handleClose: ReactEventHandler = () => {
    setIsModalOpen(false);

    setTimeout(() => setModalData(null), 300);
  };

  useEffect(() => {
    if (!currentPool) {
      push("/");
    }
  }, [currentPool, push]);

  if (!currentPool || !swapTokensData) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        textAlign: "center",
        maxWidth: 400,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          width: 362,
          height: 362,
          position: "absolute",
          top: -2,
          left: "50%",
          transform: "translate(-50%, 0)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(114,64,208,0.78) 0%, rgba(1,8,40,0) 70%)",
          zIndex: -1,
        }}
      />
      <Stack direction="row" alignItems="center" justifyContent="center" my={2}>
        <Box
          component="img"
          src={currentPool.token0.image}
          alt="icon1"
          style={{
            width: 48,
            height: 48,
            zIndex: 1,
            marginRight: "-10px",
            borderRadius: "50%",
          }}
        />
        <Box
          component="img"
          src={currentPool.token1.image}
          alt="icon2"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            clipPath: 'path("M 0,0 Q 24,24 0,48 L 48,48 L 48,0 Z")',
          }}
        />
      </Stack>

      <Typography variant="h5" sx={{ fontWeight: "bold", my: 2 }}>
        {`${currentPool.token0.symbol}/${currentPool.token1.symbol}`}
      </Typography>

      <Chip label="Надежный" color="success" sx={{ mb: 2 }} />

      <SwapBlock
        wallet={wallet}
        currentPool={currentPool}
        swapTokensData={swapTokensData}
      />

      <Box
        sx={{
          backgroundColor: "var(--blocksBackground)",
          borderRadius: 3,
          p: 2,
          mt: 3,
          textAlign: "left",
        }}
      >
        {POOL_DATA_TABLE_ROWS.map((item, index) => (
          <Fragment key={index}>
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mt={index === 0 ? 0 : 2}
              mb={index === POOL_DATA_TABLE_ROWS.length - 1 ? 0 : 2}
            >
              <Stack direction="column">
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "var(--labelColor)",
                  }}
                  variant="subtitle1"
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: "24px",
                    lineHeight: "32px",
                  }}
                  variant="h6"
                >
                  {currentPool[item.value].toLocaleString("en", {
                    notation: "compact",
                    compactDisplay: "short",
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => handleOpen(item.modalData)}
              >
                <HelpOutlineIcon sx={{ color: "gray" }} />
              </IconButton>
            </Stack>
            {index !== POOL_DATA_TABLE_ROWS.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Box>
      <CustomModal isModalOpen={isModalOpen} handleClose={handleClose}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {modalData?.title}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 4 }}>
            {modalData?.text}
          </Typography>
          <CustomButton
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            Понятно
          </CustomButton>
        </Box>
      </CustomModal>
    </Box>
  );
}
