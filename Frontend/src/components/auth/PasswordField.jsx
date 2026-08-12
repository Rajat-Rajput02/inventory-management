import { useState } from "react";

import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const PasswordField = ({
  InputProps,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <TextField
      {...props}
      fullWidth
      margin="normal"
      type={show ? "text" : "password"}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow(!show)}
            >
              {show
                ? <VisibilityOff />
                : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;