import {
  DialogContent,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import AppDialog from "../common/AppDialog";
import { useCallback, useEffect, useState } from "react";
const initial = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  gstNumber: "",
  notes: "",
  status: "Active",
};

const SupplierForm = ({
  open,
  onClose,
  onSubmit,
  supplier,
  loading = false,
}) => {
  const [form, setForm] = useState(initial);

  const settingSupplier = useCallback(() => {
    setForm(supplier || initial);
  }, [supplier]);

  useEffect(() => {
    settingSupplier();
  }, [settingSupplier]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={supplier ? "Edit Supplier" : "Add Supplier"}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Company"
              name="company"
              fullWidth
              value={form.company}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              multiline
              rows={2}
              value={form.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="GST Number"
              name="gstNumber"
              fullWidth
              value={form.gstNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={form.status}
              onChange={handleChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Notes"
              name="notes"
              fullWidth
              multiline
              rows={3}
              value={form.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default SupplierForm;
