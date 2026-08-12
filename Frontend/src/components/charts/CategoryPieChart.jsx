import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Paper, Typography, Box } from "@mui/material";

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
];

export default function CategoryPieChart({ data = [] }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const outerRadius = isSmallScreen ? 72 : 112;

  return (
    <Paper
      elevation={3}
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
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Products By Category
      </Typography>

      <Box
        sx={{
          width: "100%",
          flex: 1,
          minHeight: { xs: 240, md: 300 },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              outerRadius={outerRadius}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name ?? index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign={isSmallScreen ? "bottom" : "middle"}
              align={isSmallScreen ? "center" : "right"}
              layout={isSmallScreen ? "horizontal" : "vertical"}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}