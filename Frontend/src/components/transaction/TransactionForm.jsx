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
  products = [],
  type = "IN",
  allowTypeChange = false,
  onSubmit,
  loading = false,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(
    product?._id || product?.id || "",
  );

  const [selectedType, setSelectedType] = useState(type);

  const [form, setForm] = useState({
    quantity: "",
    reason: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const resetForm = useCallback(() => {
    if (!open) return;

    setSelectedProduct(
      product?._id || product?.id || "",
    );

    setSelectedType(type || "IN");

    setForm({
      quantity: "",
      reason: "",
      notes: "",
    });

    setErrors({});
  }, [open, product, type]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = Number(form.quantity);

    const nextErrors = {};

    if (!selectedProduct) {
      nextErrors.product = "Product is required";
    }

    if (!selectedType) {
      nextErrors.type = "Transaction type is required";
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      nextErrors.quantity =
        "Quantity must be greater than 0";
    }

    if (!form.reason) {
      nextErrors.reason = "Reason is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      product: selectedProduct,
      productId: selectedProduct,
      type: selectedType,
      quantity,
      reason: form.reason,
      notes: form.notes,
    });
  };

  return (
   <>
    <AppDialog
      open={open}
      onClose={onClose}
      title={
        allowTypeChange
          ? "Add Transaction"
          : selectedType === "IN"
            ? "Stock In"
            : "Stock Out"
      }
      actions={
        <>
          <Button
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      <DialogContent>
        <Stack spacing={2} mt={1}>

          {/* PRODUCT */}

          <TextField
            select
            label="Product"
            value={selectedProduct}
            disabled={Boolean(product) || loading}
            error={Boolean(errors.product)}
            helperText={errors.product}
            onChange={(e) => {
              setSelectedProduct(e.target.value);

              setErrors((prev) => ({
                ...prev,
                product: "",
              }));
            }}
          >
            {products.length === 0 ? (
              <MenuItem value="" disabled>
                No products available
              </MenuItem>
            ) : (
              products.map((item) => {
                const id = item._id || item.id;

                return (
                  <MenuItem key={id} value={id}>
                    {item.name}
                    {item.sku ? ` (${item.sku})` : ""}
                  </MenuItem>
                );
              })
            )}
          </TextField>

          {/* TYPE */}

          <TextField
            select
            label="Transaction Type"
            value={selectedType}
            disabled={!allowTypeChange || loading}
            error={Boolean(errors.type)}
            helperText={errors.type}
            onChange={(e) => {
              setSelectedType(e.target.value);

              setErrors((prev) => ({
                ...prev,
                type: "",
              }));
            }}
          >
            <MenuItem value="IN">
              Stock In
            </MenuItem>

            <MenuItem value="OUT">
              Stock Out
            </MenuItem>
          </TextField>

          {/* QUANTITY */}

          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            disabled={loading}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            inputProps={{
              min: 1,
              step: 1,
            }}
            onChange={(e) => {
              setForm({
                ...form,
                quantity: e.target.value,
              });

              setErrors((prev) => ({
                ...prev,
                quantity: "",
              }));
            }}
          />

          {/* REASON */}

          <TextField
            select
            label="Reason"
            value={form.reason}
            disabled={loading}
            error={Boolean(errors.reason)}
            helperText={errors.reason}
            onChange={(e) => {
              setForm({
                ...form,
                reason: e.target.value,
              });

              setErrors((prev) => ({
                ...prev,
                reason: "",
              }));
            }}
          >
            {reasons.map((reason) => (
              <MenuItem
                key={reason}
                value={reason}
              >
                {reason}
              </MenuItem>
            ))}
          </TextField>

          {/* NOTES */}

          <TextField
            multiline
            rows={3}
            label="Notes"
            value={form.notes}
            disabled={loading}
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
  </> 
  );
};

export default TransactionForm;