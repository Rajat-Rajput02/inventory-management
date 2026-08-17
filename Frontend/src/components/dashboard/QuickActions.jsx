import { Paper, Typography, Stack, Button } from "@mui/material";
import { ROUTES } from "../../constants/routes"
import {
  Add,
  Person,
  PictureAsPdf,
  TableView,
  Print,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import exportExcel from "../../utils/export/exportExcel";
import exportPdf from "../../utils/export/exportPdf";
import printInventory from "../../utils/export/printInventory";


const QuickActions = ({ products }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" mb={3} fontWeight={700}>
        Quick Actions
      </Typography>

      <Stack spacing={2}>
        <Button variant="contained" startIcon={<Add />} 
          onClick={() => navigate(ROUTES.PRODUCTS, { state: { openAddModal: true } })}>
          Add Product
        </Button>

        <Button
          variant="outlined"
          startIcon={<Person />}
          onClick={() => navigate("/profile")}
        >
          My Profile
        </Button>
        <Button
          variant="outlined"
          startIcon={<TableView />}
          onClick={() => exportExcel(products)}
        >
          Export Excel
        </Button>

        <Button
        color="error"
          variant="outlined"
          startIcon={<PictureAsPdf />}
          onClick={() => exportPdf(products)}
        >
          Export PDF
        </Button>

        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={() => printInventory(products)}
        >
          Print Inventory
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActions;
