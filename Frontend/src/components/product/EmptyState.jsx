import { Box, Typography, Button } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const EmptyState = ({
  title = "Nothing here",
  subtitle = "No records found.",
  buttonText,
  onClick,
onAction }) => {
  const handleButtonClick = onClick || onAction;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        textAlign: "center",
      }}
    >
      <Inventory2Icon
        color="disabled"
        sx={{
          fontSize: 70,
          mb: 2,
        }}
      />

      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>

      {buttonText && handleButtonClick && (
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;