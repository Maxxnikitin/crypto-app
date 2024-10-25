import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DeDustClient, PoolData } from "@dedust/sdk";
import { PoolsTable } from "../pools-table";
import { useDeDustStore } from "@/store/de-dust-store";
import { Loader } from "../loader";

export const Pools = () => {
  const { pools, isPoolsLoading, isPoolsBackgroundLoading, getPools } =
    useDeDustStore();

  useEffect(() => {
    getPools();
  }, []);

  if (isPoolsLoading) return <Loader />;

  return (
    <Stack direction="column" width="100%">
      {isPoolsBackgroundLoading && (
        <Stack direction="row" gap={2} alignItems="center" mb={2}>
          <Typography>Updating in the background...</Typography>{" "}
          <Loader isInline size={20} />
        </Stack>
      )}
      {pools ? <PoolsTable data={pools} /> : null}
    </Stack>
  );
};
