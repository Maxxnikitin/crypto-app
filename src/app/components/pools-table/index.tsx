import { TFullPool } from "@/utils/types";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TProps = {
  data: TFullPool[];
};

export const PoolsTable = ({ data }: TProps) => {
  const handleRowClick = () => console.log(222);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Пара",
      flex: 2,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center">
          <Box sx={{ position: "relative", width: 40, height: 24 }}>
            <Box
              component="img"
              src={row.gotTokens.token0.image_url}
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
              src={row.gotTokens.token1.image_url}
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
            {`${row.gotTokens.token0.symbol}/${row.gotTokens.token1.symbol}`}
          </span>
        </Stack>
      ),
      disableColumnMenu: true,
    },
    {
      field: "tvl",
      headerName: "TVL",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: ({ row }) => (
        <Typography>
          $
          {row.tvl.toLocaleString("en", {
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 2,
          })}
        </Typography>
      ),
      disableColumnMenu: true,
    },
    {
      field: "apr",
      headerName: "APR",
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: ({ row }) => (
        <Typography>
          {row.apr.toLocaleString("en", {
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 2,
          })}
          %
        </Typography>
      ),
      disableColumnMenu: true,
    },
  ];

  const rows = data.map((item, index) => ({
    id: index,
    gotTokens: item.gotTokens,
    tvl: +item.lp_total_supply_usd,
    apr: +item.farming.apy,
  }));

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <Paper>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={60}
        initialState={{ pagination: { paginationModel } }}
        onRowClick={handleRowClick}
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          border: 0,
        }}
      />
    </Paper>
  );
};
