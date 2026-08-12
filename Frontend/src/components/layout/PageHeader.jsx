import { Paper, Typography, Avatar, Stack, Box } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { alpha } from "@mui/material/styles";

const PageHeader = ({
  title,
  subtitle,
  action,
  icon: Icon = Inventory2Icon,
}) => {
  const headerBackground = (theme) =>
    theme.palette.mode === "dark"
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.22)}, ${theme.palette.background.paper})`
      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${theme.palette.background.paper})`;

  const headerShadow = (theme) =>
    theme.palette.mode === "dark"
      ? "0 16px 36px rgba(0, 0, 0, 0.35)"
      : "0 14px 32px rgba(37, 99, 235, 0.08)";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 3,
        background: headerBackground,
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.9),
        boxShadow: headerShadow,
      }}
    >
      <Stack
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Avatar
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            color: "primary.contrastText",
            width: 48,
            height: 48,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? `0 10px 24px ${alpha(theme.palette.primary.main, 0.35)}`
                : `0 10px 24px ${alpha(theme.palette.primary.main, 0.28)}`,
          }}
        >
          <Icon />
        </Avatar>
      </Stack> 
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"

        flexWrap="wrap"
        gap={2}
        spacing={0.35}
        sx={{ 
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
       }}>
        <Box>
          <Typography variant="h4" fontWeight={700}    sx={{
            fontSize: {
              xs: "1.7rem",
              md: "2.1rem",
            },
          }} >{title}</Typography>

        {subtitle && (
          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
       {action && (
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
      </Box>
    </Paper>
  );
};

export default PageHeader;
