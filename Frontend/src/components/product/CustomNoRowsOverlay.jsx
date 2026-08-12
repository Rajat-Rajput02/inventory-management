import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";

const CustomNoRowsOverlay = ({ onAdd }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Inventory2Icon
        sx={{
          fontSize: 70,
          color: "text.secondary",
        }}
      />

      <Typography variant="h6">
        No Products Found
      </Typography>

      <Typography color="text.secondary">
        Try changing filters or add a new product.
      </Typography>

      <Button
        variant="contained"
        onClick={onAdd}
      >
        Add Product
      </Button>
    </Box>
  );
};

export default CustomNoRowsOverlay;