import { TextField } from "@mui/material";

const AuthTextField = (props) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      {...props}
    />
  );
};

export default AuthTextField;