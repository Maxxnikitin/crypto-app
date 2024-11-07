import { useStonFiStore } from "@/store/ston-fi-store";
import { TFrontPool } from "@/utils/types";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

type TProps = {
  data: TFrontPool[];
};

export const PoolsTable = ({ data }: TProps) => {
  const { setCurrentPool } = useStonFiStore();
  const { push } = useRouter();
  const handleRowClick = ({ row }: GridRowParams) => {
    setCurrentPool(row.data);
    push("/pool");
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Пара",
      flex: 2,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center">
          <Box sx={{ width: 44, height: 44 }}>
            <Box
              component="img"
              src={row.token0.image}
              alt="icon1"
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                marginRight: "-4px",
              }}
            />
            <Box
              component="img"
              src={row.token1.image}
              alt="icon2"
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                clipPath: 'path("M 0,0 Q 12,12 0,24 L 24,24 L 24,0 Z")',
              }}
            />
          </Box>
          <span style={{ marginLeft: 8 }}>
            {`${row.token0.symbol}/${row.token1.symbol}`}
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
        <Stack sx={{ height: "100%" }} justifyContent="center">
          <Typography>
            $
            {row.tvl.toLocaleString("en", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Stack>
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
        <Stack sx={{ height: "100%" }} justifyContent="center">
          <Typography>
            {row.apr.toLocaleString("en", {
              notation: "compact",
              compactDisplay: "short",
              maximumFractionDigits: 2,
            })}
            %
          </Typography>
        </Stack>
      ),
      disableColumnMenu: true,
    },
  ];

  const rows = data.map((item, index) => ({
    ...item,
    id: index,
    data: item,
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
