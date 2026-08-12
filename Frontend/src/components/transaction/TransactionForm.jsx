import {
  DialogContent,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

import { useState, useEffect, useCallback } from "react";
import AppDialog from "../common/AppDialog";

const reasons = [
  "Purchase",
  "Sale",
  "Return",
  "Damage",
  "Adjustment",
  "Transfer",
  "Initial Stock",
];

const TransactionForm = ({
  open,
  onClose,
  product,
  type,
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState({
    quantity: "",
    reason: "",
    notes: "",
  });

  const setTransactionForm = useCallback(() => {
    if (open) {
      setForm({
        quantity: "",
        reason: "",
        notes: "",
      });
    }
  }, [open]);

  useEffect(() => {
    setTransactionForm();
  }, [setTransactionForm]);

  const handleSubmit = (e) => {
    e.preventDefault(); // 
onSubmit({
      product: product?._id || product?.id,
      productId: product?._id || product?.id,
      type,
      quantity: Number(form.quantity),
      reason: form.reason,
      notes: form.notes,
    });
  };

  return (
    <AppDialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={onClose}
      title={type === "IN" ? "Stock In" : "Stock Out"}
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
        <Stack spacing={2} mt={1}>
          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
          />

          <TextField
            select
            label="Reason"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
          >
            {reasons.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            multiline
            rows={3}
            label="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
          />
        </Stack>
      </DialogContent>
    </AppDialog>
  );
};

export default TransactionForm;
