import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import AppDialog from "../common/AppDialog";

const initialForm = {
  name: "",
  code: "",
  manager: "",
  phone: "",
  address: "",
  status: "Active",
};

const WarehouseForm = ({ open, onClose, selectedWarehouse, onSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(selectedWarehouse);

  const settingWarehouseForm = useCallback(() => {
    if (selectedWarehouse) {
      setFormData({
        name: selectedWarehouse.name || "",
        code: selectedWarehouse.code || "",
        manager: selectedWarehouse.manager || "",
        phone: selectedWarehouse.phone || "",
        address: selectedWarehouse.address || "",
        status: selectedWarehouse.status || "Active",
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedWarehouse]);

  useEffect(() => {
    settingWarehouseForm();
  }, [settingWarehouseForm, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Warehouse name is required";
    if (!formData.code.trim()) newErrors.code = "Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await onSubmit({
        ...formData,
        code: formData.code.toUpperCase(),
      });
      setFormData(initialForm);
      setErrors({});
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={saving ? undefined : onClose}
      title={
        <Stack direction={{ md: "row" }} alignItems="center" spacing={1}>
          {isEdit ? (
            <EditIcon color="primary" />
          ) : (
            <AddBoxIcon color="primary" />
          )}
          <span>{isEdit ? "Edit Warehouse" : "Add Warehouse"}</span>
        </Stack>
      }
      actions={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Warehouse"
                : "Add Warehouse"}
          </Button>
        </>
      }
    >
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            autoFocus
            label="Warehouse Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={Boolean(errors.code)}
            helperText={errors.code}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Manager"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </AppDialog>
  );
};

export default WarehouseForm;
