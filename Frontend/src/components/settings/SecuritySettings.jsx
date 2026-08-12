import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";

import { useState } from "react";

import { changePassword } from "../../services/userService";

import AppSnackbar from "../common/AppSnackbar";

import useAuth from "../../hooks/useAuth";

const SecuritySettings = () => {

  const { logout } = useAuth();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassword = async () => {

    try {

      await changePassword(passwords);

      setPasswords({
        currentPassword: "",
        newPassword: "",
      });

      setSnackbar({
        open: true,
        severity: "success",
        message: "Password Updated Successfully",
      });

    } catch {

      setSnackbar({
        open: true,
        severity: "error",
        message: "Unable to Update Password",
      });

    }
  };

  return (
    <>
      <Paper sx={{ p: 4 }}>

        <Typography variant="h6" mb={3}>
          Security
        </Typography>

        <Grid container spacing={3}>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
            />
          </Grid>

        </Grid>

        <Stack
          direction="row"
          spacing={2}
          mt={4}
        >

          <Button
            variant="contained"
            onClick={handlePassword}
          >
            Change Password
          </Button>

        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle1" gutterBottom>
          Session
        </Typography>

        <Button
          color="error"
          variant="outlined"
          onClick={logout}
        >
          Logout Current Session
        </Button>

      </Paper>

      <AppSnackbar
        {...snackbar}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
};

export default SecuritySettings;