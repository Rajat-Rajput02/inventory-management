import { Paper, IconButton, Stack, Tooltip } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyState from "../product/EmptyState";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const columns = [
    {
      field: "name",
      headerName: "Category",
      flex: 1,
    },

    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,

      sortable: false,

      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => onEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => onDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
  {
    if (categories.length === 0) {
      return (
        <EmptyState
          title="No Category"
          subtitle="Start by adding your first Category."
        />
      );
    }
  }

  return (
    <Paper sx={{ height: 500 }}>
      <DataGrid
        rows={Array.isArray(categories) ? categories : categories?.data || []}
        columns={columns}
        getRowId={(row) => row._id || row.id} // Essential for MongoDB backend
        disableSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
      />
    </Paper>
  );
};

export default CategoryTable;
