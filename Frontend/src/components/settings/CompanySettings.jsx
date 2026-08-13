import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";

import useSettings from "../../hooks/useSettings";
import useWarehouses from "../../hooks/useWarehouses";

import AppSnackbar from "../common/AppSnackbar";
import { CURRENCIES, TIMEZONES } from "../../constants/Statuses";

const CompanySettings = () => {
  const { settings, loading, saveSettings } = useSettings();
  const { warehouses = [] } = useWarehouses();

  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    defaultWarehouse: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const settingForm = useCallback(() => {
    if (settings) {
      setForm({
        companyName: settings.companyName || "",
        companyEmail: settings.companyEmail || "",
        companyPhone: settings.companyPhone || "",
        companyAddress: settings.companyAddress || "",
        currency: settings.currency || "INR",
        timezone: settings.timezone || "Asia/Kolkata",
        defaultWarehouse: settings.defaultWarehouse?._id || "",
      });
    }
  }, [settings]);

  useEffect(() => {
    settingForm();
  }, [settingForm]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveSettings(form);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Settings updated successfully",
      });
    } catch {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Unable to save settings",
      });
    }
  };

  if (loading) return null;

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" mb={3}>
          Company Information
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Company Email"
              name="companyEmail"
              value={form.companyEmail}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Phone"
              name="companyPhone"
              value={form.companyPhone}
              onChange={handleChange}
            />
          </Grid>

          {/* Currency Dropdown using form.currency */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              fullWidth
            >
              {CURRENCIES.map((curr) => (
                <MenuItem key={curr} value={curr}>
                  {curr}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Company Address"
              name="companyAddress"
              value={form.companyAddress}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Default Warehouse"
              name="defaultWarehouse"
              value={form.defaultWarehouse}
              onChange={handleChange}
            >
              <MenuItem value="">None</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Timezone Dropdown using form.timezone */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              fullWidth
            >
              {TIMEZONES.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
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

export default CompanySettings;
