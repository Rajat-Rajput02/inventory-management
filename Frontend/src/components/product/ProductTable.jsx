import ProductTableToolbar from "./ProductTableToolbar";
import { Avatar, Box, IconButton, Paper, Tooltip, Stack } from "@mui/material";
import StatusChip from "../common/StatusChip";
import { DataGrid } from "@mui/x-data-grid";
import { DEFAULT_PAGE_SIZE } from "../../config/pagination";
import EmptyState from "./EmptyState";

import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";

import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onStockIn,
  onStockOut,
  onView,
}) => {
  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.row.image}
          variant="rounded"
          sx={{
            width: 55,
            height: 55,
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Product",
      flex: 1.4,
      minWidth: 180,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 140,
      valueGetter: (value) => value?.name,
    },
    {
      field: "sellingPrice",
      headerName: "Selling Price",
      flex: 1,
      minWidth: 130,
      renderCell: (params) =>
        formatCurrency(params.row.sellingPrice ?? params.row.price ?? 0),
    },
    {
      field: "profit",
      headerName: "Expected Profit",
      width: 120,
      valueGetter: (value, row) =>
        Number(row.sellingPrice ?? row.price ?? 0) - Number(row.costPrice ?? 0),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 110,
    },
    {
      field: "minStock",
      headerName: "Min Stock",
      width: 120,
    },
    {
      field: "sku",
      headerName: "SKU",
      width: 130,
      valueGetter: (value, row) => row.sku || "N/A",
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 140,
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 180,
      valueGetter: (value, row) => {
        if (row.supplier && typeof row.supplier === "object") {
          return row.supplier.name || "N/A";
        }
        if (typeof row.supplier === "string" && row.supplier.trim() !== "") {
          if (/^[a-f0-9]{24}$/i.test(row.supplier.trim())) {
            return "N/A";
          }
          return row.supplier;
        }
        return "N/A";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const status =
          params.row.status ||
          (params.row.quantity > 0 ? "Active" : "Inactive");
        const isActive =
          status.toLowerCase() === "active" ||
          status.toLowerCase() === "in stock";

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
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 230,
      minWidth: 230,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.25} sx={{ overflow: "visible" }}>
          {/* View Product */}
          {onView && (
            <Tooltip title="View Details">
              <IconButton color="info" onClick={() => onView(params.row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Stock In */}
          <Tooltip title="Stock In" arrow>
            <IconButton
              color="success"
              size="small"
              onClick={() => onStockIn(params.row)}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>

          {/* Stock Out */}
          <Tooltip title="Stock Out" arrow>
            <IconButton
              color="warning"
              size="small"
              onClick={() => onStockOut(params.row)}
            >
              <RemoveCircleIcon />
            </IconButton>
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit Product" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => onEdit(params.row)}
              sx={{
                transition: "0.2s",
                "&:hover": { transform: "scale(1.15)" },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete Product" arrow>
            <IconButton
              color="error"
              size="small"
              onClick={() => onDelete(params.row)}
              sx={{
                transition: "0.2s",
                "&:hover": { transform: "scale(1.15)" },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  if (products.length === 0) {
    return (
      <EmptyState
        title="No Products"
        subtitle="Start by adding your first product."
      />
    );
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
        {" "}
        <DataGrid
          rows={Array.isArray(products) ? products : products?.data || []}
          columns={columns}
          getRowId={(row) => row._id || row.id}
          getRowClassName={(params) =>
            params.row.quantity <= params.row.minStock ? "low-stock-row" : ""
          }
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: DEFAULT_PAGE_SIZE },
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
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },

            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .low-stock-row": {
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,152,0,0.12)"
                  : "rgba(255,235,59,0.18)",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default ProductTable;
