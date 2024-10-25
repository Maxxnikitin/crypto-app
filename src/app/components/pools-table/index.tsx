import { TFullPoolData } from "@/utils/types";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TProps = {
  data: TFullPoolData[];
};

export const PoolsTable = ({ data }: TProps) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Pool name",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center">
          <Box sx={{ position: "relative", width: 40, height: 24 }}>
            <Box
              component="img"
              src={row.assets[0].metadata.image}
              alt="icon1"
              style={{
                width: 24,
                height: 24,
                position: "absolute",
                borderRadius: "50%",
                zIndex: 1,
              }}
            />
            <Box
              component="img"
              src={row.assets[1].metadata.image}
              alt="icon2"
              style={{
                width: 24,
                height: 24,
                position: "absolute",
                top: 0,
                left: 16,
                borderRadius: "50%",
              }}
            />
          </Box>
          <span style={{ marginLeft: 8 }}>
            {`${row.assets[0].metadata.symbol}/${row.assets[1].metadata.symbol}`}
          </span>
        </Stack>
      ),
    },
    {
      field: "tvl",
      headerName: "Volume 24h / TVL",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: ({ row }) => (
        <Stack direction="column">
          <Typography>${row.addition?.commonVolume.toFixed(2)}</Typography>{" "}
          <Typography>${row.addition?.tvl.toFixed(2)}</Typography>
        </Stack>
      ),
    },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    assets: item.assets,
    stats: item.stats,
    addition: item.addition,
  }));

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <Paper>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};
