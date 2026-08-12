import { Button } from "@mui/material";

const AuthButton = ({
  loading,
  children,
  ...props
}) => {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      disabled={loading}
      sx={{
        mt: 3,
        py: 1.5,
        borderRadius: 3,
      }}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </Button>
  );
};

export default AuthButton;