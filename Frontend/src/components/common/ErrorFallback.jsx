import { Alert, Button, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const ErrorFallback = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <Stack spacing={2}>
      <Alert severity="error">
        {message}
      </Alert>

      {onRetry && (
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </Stack>
  );
};

export default ErrorFallback;