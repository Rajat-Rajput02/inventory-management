import { Card, CardContent, Typography, Chip, Stack, Box } from "@mui/material";
//import CountUp from "react-countup";

const StatsCard = ({ title, value, icon, trend }) => {
  // Determine color based on whether trend is positive (+), negative (-), or neutral
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");

  const chipColor = isPositive ? "success" : isNegative ? "error" : "default";
  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 4,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
        overflow: "visible",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 8,
        },
        background: (theme) =>
          theme.palette.mode === "dark" ? "#1e293b" : "#fff",
        borderLeft: "5px solid",
        borderColor: "primary.main",
      }}
    >
      <CardContent sx={{ p: 2.5, overflow: "visible" }}>
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{ xs: 1.5, md: 2.5 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              minWidth: 0,
            }}
          >
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          {/* STEP 10: Render trend Chip in top-right corner if passed */}
          {trend && (
            <Chip
              label={trend}
              color={chipColor}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          )}

          {icon && (
            <Box
              sx={{
                width: 60,
                height: 60,
                background: (theme) => theme.palette.primary.main,
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "inline-flex",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
