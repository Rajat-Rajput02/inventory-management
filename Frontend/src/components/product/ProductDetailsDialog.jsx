import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import QRCode from "react-qr-code";
import Barcode from "react-barcode";

const ProductDetailsDialog = ({ open, onClose, product }) => {
  if (!product) return null;

  const supplierLabel = (() => {
    if (!product.supplier) return "N/A";
    if (typeof product.supplier === "object") {
      return product.supplier.name || "N/A";
    }
    if (typeof product.supplier === "string") {
      // Avoid showing raw Mongo ObjectId strings in the UI.
      return /^[a-f0-9]{24}$/i.test(product.supplier)
        ? "N/A"
        : product.supplier;
    }
    return "N/A";
  })();

  const sellingPrice = Number(product.sellingPrice ?? product.price ?? 0);
  const costPrice = Number(product.costPrice ?? 0);
  const profit = sellingPrice - costPrice;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableRestoreFocus>
      <DialogTitle>Product Details</DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Avatar
            src={product.image}
            variant="rounded"
            sx={{
              width: 170,
              height: 170,
            }}
          />

          <Typography variant="h5">{product.name}</Typography>

          <Divider />

          <Typography>SKU : {product.sku}</Typography>

          <Typography>Brand : {product.brand}</Typography>

          <Typography>Supplier : {supplierLabel}</Typography>

          <Typography>Description</Typography>

          <Typography color="text.secondary">{product.description}</Typography>

          <Typography>Cost Price : ₹{costPrice}</Typography>

          <Typography>Selling Price : ₹{sellingPrice}</Typography>

          <Typography>Expected Profit : ₹{profit}</Typography>

          <Chip
            label={
              product.quantity <= product.minStock ? "Low Stock" : "Healthy"
            }
            color={product.quantity <= product.minStock ? "warning" : "success"}
          />

          <Divider />

          <Barcode value={product.sku} />

          <QRCode value={product.sku} size={120} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
