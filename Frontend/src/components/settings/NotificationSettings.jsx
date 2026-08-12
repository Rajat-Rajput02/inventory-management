import {
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Stack,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";

import useSettings from "../../hooks/useSettings";
import AppSnackbar from "../common/AppSnackbar";

const NotificationSettings = () => {
  const { settings, saveSettings, loading } = useSettings();

  const [form, setForm] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    transactionAlerts: true,
    weeklyReports: false,
    desktopNotifications: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const settingForm = useCallback(() => {
    if (!settings) return;

    setForm({
      emailNotifications: settings.emailNotifications ?? true,
      lowStockAlerts: settings.lowStockAlerts ?? true,
      transactionAlerts: settings.transactionAlerts ?? true,
      weeklyReports: settings.weeklyReports ?? false,
      desktopNotifications: settings.desktopNotifications ?? true,
    });
  }, [settings]);

  useEffect(() => {
    settingForm();
  }, [settingForm]);

  const handleChange = (name) => (e) => {
    setForm((prev) => ({
      ...prev,
      [name]: e.target.checked,
    }));
  };

  const handleSave = async () => {
    await saveSettings(form);

    setSnackbar({
      open: true,
      severity: "success",
      message: "Notification Settings Updated",
    });
  };

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" mb={3}>
          Notification Preferences
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={form.emailNotifications}
                onChange={handleChange("emailNotifications")}
              />
            }
            label="Email Notifications"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.lowStockAlerts}
                onChange={handleChange("lowStockAlerts")}
              />
            }
            label="Low Stock Alerts"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.transactionAlerts}
                onChange={handleChange("transactionAlerts")}
              />
            }
            label="Transaction Alerts"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.weeklyReports}
                onChange={handleChange("weeklyReports")}
              />
            }
            label="Weekly Report Email"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.desktopNotifications}
                onChange={handleChange("desktopNotifications")}
              />
            }
            label="Desktop Notifications"
          />
        </FormGroup>

        <Stack mt={4}>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Notification Changes"}
          </Button>
        </Stack>
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

export default NotificationSettings;
