import ProductTableToolbar from "../product/ProductTableToolbar";

import { Box, IconButton, Paper, Tooltip, Stack } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import StatusChip from "../common/StatusChip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EmptyState from "../product/EmptyState";

const WarehouseTable = ({ warehouses, onEdit, onDelete }) => {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.4,
      minWidth: 180,
    },
    {
      field: "code",
      headerName: "Code",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "manager",
      headerName: "Manager",
      flex: 1,
      minWidth: 160,
      valueGetter: (value, row) => row.manager || "N/A",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.phone || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status || "Inactive";
        const isActive = status.toLowerCase() === "active";

        return (
          <StatusChip
            status={params.row.status}
            color={isActive ? "success" : "default"}
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 1,
              ...(!isActive && {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "#e0e0e0",
                color: "text.secondary",
              }),
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit Warehouse" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => onEdit(params.row)}
              sx={{
                mr: 1,
                transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Warehouse" arrow>
            <IconButton
              color="error"
              size="small"
              onClick={() => onDelete(params.row)}
              sx={{
                transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.15)",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  {
    if (warehouses.length === 0) {
      return (
        <EmptyState
          title="No Warehouse"
          subtitle="Start by adding your first Warehouse."
        />
      );
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
<Box
  sx={{
    height: {
      xs: 500,
      sm: 550,
      md: 600,
    },
    width: "100%",
    overflowX: "auto",
  }}
>
        <DataGrid
          rows={Array.isArray(warehouses) ? warehouses : warehouses?.data || []}
          columns={columns}
          getRowId={(row) => row._id || row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          slots={{
            toolbar: ProductTableToolbar,
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },

            "& .MuiDataGrid-row": {
              transition: "0.2s",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },

            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default WarehouseTable;
