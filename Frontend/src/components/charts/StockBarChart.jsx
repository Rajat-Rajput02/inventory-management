import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Paper, Typography, Box } from "@mui/material";

const StockBarChart = ({ data = [] }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        width: "100%",
        height: "100%",
        minHeight: { xs: 320, md: 380 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" mb={2} fontWeight={700}>
        Inventory Status
      </Typography>
      <Box
        sx={{
          width: "100%",
          flex: 1,
          minHeight: { xs: 240, md: 300 },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: isSmallScreen ? 11 : 12 }}
              interval={0}
            />

            <YAxis tick={{ fontSize: isSmallScreen ? 11 : 12 }} />

            <Tooltip />

            <Bar dataKey="value" fill="#1976d2" barSize={isSmallScreen ? 28 : 48} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
export default StockBarChart;
