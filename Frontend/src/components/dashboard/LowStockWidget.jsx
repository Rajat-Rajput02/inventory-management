import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const LowStockWidget = ({ products = [] }) => {
  const lowStock = products.filter(
    (product) => product.quantity <= product.minStock,
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" mb={2} fontWeight={700}>
        Low Stock Products
      </Typography>

      {lowStock.length === 0 ? (
        <Typography color="text.secondary">Everything looks good 🎉</Typography>
      ) : (
        <List dense>
          {lowStock.map((product) => (
            <ListItem
              key={product._id}
              disablePadding
              sx={{
                py: 1,
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
              }}
            >
              <ListItemText
                primary={product.name}
                secondary={product.category?.name}
                sx={{ mr: { sm: 2 } }}
              />

              <Chip label={`${product.quantity} left`} color="warning" />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default LowStockWidget;
