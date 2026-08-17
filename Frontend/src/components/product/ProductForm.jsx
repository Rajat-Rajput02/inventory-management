import { useCallback, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import useSuppliers from "../../hooks/useSuppliers";
import useWarehouses from "../../hooks/useWarehouses";
import { PRODUCT_STATUS } from "../../constants/status";
import { PRODUCT_UNITS } from "../../constants/units";
import AppSnackbar from "../common/AppSnackbar";
import {
  Avatar,
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import AppDialog from "../common/AppDialog";

const initialForm = {
  name: "",
  category: "",
  brand: "",
  supplier: "",
  warehouse: "",
  description: "",
  costPrice: "",
  sellingPrice: "",
  sku: "",
  barcode: "",
  status: "In Stock",
  unit: "pcs",
  quantity: "",
  minStock: "",
  image: null,
};

const ProductForm = ({
  open,
  onClose,
  selectedProduct,
  onSubmit,
  categories = [],
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { suppliers } = useSuppliers();
  const { warehouses } = useWarehouses();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const isEdit = Boolean(selectedProduct);

  const selectedProductFunc = useCallback(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        category:
          selectedProduct.category?._id || selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        supplier:
          selectedProduct.supplier?._id || selectedProduct.supplier || "",
        warehouse:
          selectedProduct.warehouse?._id || selectedProduct.warehouse || "",
        description: selectedProduct.description || "",
        costPrice: selectedProduct.costPrice || "",
        sellingPrice:
          selectedProduct.sellingPrice || selectedProduct.price || "",
        sku: selectedProduct.sku || "",
        barcode: selectedProduct.barcode || "",
        status: selectedProduct.status || "In Stock",
        unit: selectedProduct.unit || "pcs",
        quantity: selectedProduct.quantity || "",
        minStock: selectedProduct.minStock || "",
        image: selectedProduct.image || null,
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedProduct]);

  useEffect(() => {
    selectedProductFunc();
  }, [selectedProductFunc, open]);

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

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (Number(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = "Selling price must be greater than 0";
    }
    if (Number(formData.costPrice) < 0) {
      newErrors.costPrice = "Cost price cannot be negative";
    }
    if (Number(formData.quantity) < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }
    if (Number(formData.minStock) < 0) {
      newErrors.minStock = "Minimum stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await onSubmit(formData);
      showSnackbar(
        `Product ${isEdit ? "updated" : "added"} successfully!`,
        "success"
      );
      setFormData(initialForm);
      setErrors({});
      onClose();
    } catch (error) {
     showSnackbar(
        error?.response?.data?.message || "Failed to save product",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const preview = formData.image
    ? typeof formData.image === "string"
      ? formData.image
      : URL.createObjectURL(formData.image)
    : null;

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
          <span>{isEdit ? "Edit Product" : "Add Product"}</span>
        </Stack>
      }
      actions={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </Button>
        </>
      }
    >
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            autoFocus
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={categories || []}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            value={
              (categories || []).find((c) => c._id === formData.category) ||
              null
            }
            onChange={(event, newValue) => {
              if (newValue && newValue._id) {
                setFormData((prev) => ({ ...prev, category: newValue._id }));
              } else {
                setFormData((prev) => ({ ...prev, category: "" }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                placeholder="Select a category"
                error={Boolean(errors.category)}
                helperText={
                  errors.category || "Choose from existing categories"
                }
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Brand"
            fullWidth
            value={formData.brand}
            onChange={(e) =>
              setFormData({
                ...formData,
                brand: e.target.value,
              })
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            select
            label="Supplier"
            fullWidth
            value={formData.supplier || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                supplier: e.target.value,
              })
            }
          >
            <MenuItem value="">None</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            options={warehouses || []}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            value={
              (warehouses || []).find((w) => w._id === formData.warehouse) ||
              null
            }
            onChange={(event, newValue) => {
              if (newValue && newValue._id) {
                setFormData((prev) => ({ ...prev, warehouse: newValue._id }));
              } else {
                setFormData((prev) => ({ ...prev, warehouse: "" }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Warehouse"
                placeholder="Select a warehouse"
                helperText="Choose from existing warehouses"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </Grid>

        {preview && (
          <Grid size={{ xs: 12 }}>
            <Avatar
              src={preview}
              variant="rounded"
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Button variant="outlined" component="label">
            Upload Product Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files[0],
                })
              }
            />
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Cost Price"
            fullWidth
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            error={Boolean(errors.costPrice)}
            helperText={errors.costPrice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Selling Price"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            error={Boolean(errors.sellingPrice)}
            helperText={errors.sellingPrice}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            inputProps={{ min: 0, step: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Minimum Stock"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            error={Boolean(errors.minStock)}
            helperText={errors.minStock}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            placeholder="e.g. ELEC-KEY-001"
            value={formData.sku}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Barcode"
            name="barcode"
            placeholder="e.g. 890123456789"
            value={formData.barcode}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            {PRODUCT_UNITS.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
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
            {PRODUCT_STATUS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            <MenuItem value="Discontinued">Discontinued</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <AppSnackbar
  open={snackbar.open}
  message={snackbar.message}
  severity={snackbar.severity}
  onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
/>
    </AppDialog>
  );
};

export default ProductForm;
