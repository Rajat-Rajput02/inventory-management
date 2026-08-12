import { Paper, Typography, LinearProgress, Stack } from "@mui/material";

const InventoryStatistics = ({ products = [] }) => {
  const total = products.length;

  const low = products.filter((p) => p.quantity <= p.minStock).length;

  const healthy = total - low;

  const healthyPercent = total === 0 ? 0 : (healthy / total) * 100;

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
      <Typography variant="h6" mb={3}>
        Inventory Health
      </Typography>

      <Stack spacing={2}>
        <Typography>Healthy Products</Typography>

        <LinearProgress
          variant="determinate"
          value={healthyPercent}
          sx={{
            height: 10,
            borderRadius: 5,
          }}
        />

        <Typography>
          {healthy}/{total} Healthy
        </Typography>
      </Stack>
    </Paper>
  );
};

export default InventoryStatistics;
