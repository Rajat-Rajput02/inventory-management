import { Box, Paper, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { authBackground, authCardStyle } from "../../theme/authStyles";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <Box sx={authBackground}>
      <Paper elevation={8} sx={authCardStyle}>
        <Inventory2Icon
          sx={{
            fontSize: 60,
            color: "primary.main",
            display: "block",
            mx: "auto",
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          align="center"
          mb={4}
        >
          {subtitle}
        </Typography>

        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;