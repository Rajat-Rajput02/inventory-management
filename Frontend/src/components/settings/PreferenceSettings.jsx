import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { ROUTES } from "../../constants/routes";

import { useCallback, useEffect, useState } from "react";

import useSettings from "../../hooks/useSettings";

import AppSnackbar from "../common/AppSnackbar";

const PreferenceSettings = () => {
  const { settings, saveSettings, loading } = useSettings();

  const [form, setForm] = useState({
    theme: "system",
    defaultPage: "/",
    dateFormat: "DD/MM/YYYY",
    itemsPerPage: 10,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const settingForm = useCallback(() => {
    if (!settings) return;

    setForm({
      theme: settings.theme || "system",
      defaultPage: settings.defaultPage || "/",
      dateFormat: settings.dateFormat || "DD/MM/YYYY",
      itemsPerPage: settings.itemsPerPage || 10,
    });
  }, [settings]);

  useEffect(() => {
    settingForm();
  }, [settingForm]);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    await saveSettings(form);

    setSnackbar({
      open: true,

      severity: "success",

      message: "Preferences Updated",
    });
  };

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" mb={3}>
          Preferences
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Theme"
              name="theme"
              value={form.theme}
              onChange={handleChange}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Landing Page"
              name="defaultPage"
              value={form.defaultPage}
              onChange={handleChange}
            >
              <MenuItem value={ROUTES.DASHBOARD}>Dashboard</MenuItem>

              <MenuItem value={ROUTES.PRODUCTS}>Products</MenuItem>

              <MenuItem value={ROUTES.CATEGORIES}>Categories</MenuItem>

              <MenuItem value={ROUTES.REPORTS}>Reports</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Date Format"
              name="dateFormat"
              value={form.dateFormat}
              onChange={handleChange}
            >
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>

              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>

              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Items Per Page"
              name="itemsPerPage"
              value={form.itemsPerPage}
              onChange={handleChange}
            >
              <MenuItem value={5}>5</MenuItem>

              <MenuItem value={10}>10</MenuItem>

              <MenuItem value={20}>20</MenuItem>

              <MenuItem value={50}>50</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </Grid>
        </Grid>
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

export default PreferenceSettings;
