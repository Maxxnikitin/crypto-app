import { Stack } from "@mui/material";
import { useEffect } from "react";
import { PoolsTable } from "../pools-table";
import { Loader } from "../loader";
import { useStonFiStore } from "@/store/ston-fi-store";

export const Pools = () => {
  const { pools, isPoolsLoading, getPools } = useStonFiStore();

  useEffect(() => {
    getPools();
  }, []);

  if (isPoolsLoading) return <Loader />;

  return (
    <Stack direction="column" width="100%">
      {/* {isPoolsBackgroundLoading && (
        <Stack direction="row" gap={2} alignItems="center" mb={2}>
          <Typography>Updating in the background...</Typography>{" "}
          <Loader isInline size={20} />
        </Stack>
      )} */}
      {pools && <PoolsTable data={pools} />}
    </Stack>
  );
};
