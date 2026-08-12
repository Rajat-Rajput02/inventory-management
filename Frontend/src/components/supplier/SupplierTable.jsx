import { Paper, IconButton, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StatusChip from "../common/StatusChip";
import EmptyState from "../product/EmptyState";

// Import pagination constants
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from "../../config/pagination";

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <StatusChip
          status={params.row.status}
          color={params.row.status === "Active" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  {
    if (suppliers.length === 0) {
      return (
        <EmptyState
          title="No Supplier"
          subtitle="Start by adding your first Supplier."
        />
      );
    }
  }

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden", width: "100%" }}>
      <DataGrid
      rows={Array.isArray(suppliers) ? suppliers : suppliers?.data || []}
        columns={columns}
        getRowId={(row) => row._id || row.id}
        autoHeight
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: DEFAULT_PAGE_SIZE,
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </Paper>
  );
};

export default SupplierTable;
