import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { formatNumber } from "../../utils/number";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { getStatusColor } from "../../constants/status";
import ProductTransactionList from "../transaction/ProductTransactionList";

import { getProductHistory as fetchProductHistoryService } from "../../services/transactionService";

const ProductDetailsDrawer = ({ open, onClose, product }) => {
  const [transactions, setTransactions] = useState([]);

  const fetchProductHistory = useCallback(async () => {
    if (!product?._id) return null;

    const data = await fetchProductHistoryService(product?._id);
    setTransactions(data);
  }, [product?._id]);

  useEffect(() => {
    if (!product?._id) return;
    fetchProductHistory();
  }, [fetchProductHistory, product?._id]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          p: 3,
        }}
      >
        {product && (
          <Stack spacing={3}>
            <Avatar
              src={product.image}
              variant="rounded"
              sx={{
                width: 120,
                height: 120,
              }}
            />

            <Typography variant="h5">{product.name}</Typography>

            <Chip
              label={product.status}
              color={getStatusColor(product.status)}
            />

            <Divider />

            <Typography>
              <b>SKU :</b> {product.sku || "-"}
            </Typography>

            <Typography>
              <b>Barcode :</b> {product.barcode || "-"}
            </Typography>

            <Typography>
              <b>Category :</b> {product.category?.name || "-"}
            </Typography>

            <Typography>
              <b>Supplier :</b> {product.supplier?.name || "-"}
            </Typography>

            <Typography>
              <b>Warehouse :</b> {product.warehouse?.name || "-"}
            </Typography>

            <Typography>
              <b>Quantity :</b> {formatNumber(product.quantity)}
            </Typography>

            <Typography>
              <b>Cost Price :</b> ₹{formatNumber(product.costPrice)}
            </Typography>

            <Typography>
              <b>Selling Price :</b> ₹{formatNumber(product.sellingPrice)}
            </Typography>

            <Typography>
              <b>Expected Profit / Unit :</b>{" "}
              {formatCurrency(
                Number(product.sellingPrice ?? product.price ?? 0) -
                  Number(product.costPrice ?? 0),
              )}
            </Typography>

            <Typography>
              <b>Total Inventory Value :</b>{" "}
              {formatCurrency(
                Number(product.sellingPrice ?? product.price ?? 0) *
                  Number(product.quantity ?? 0),
              )}
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Recent Transactions
            </Typography>

            <ProductTransactionList transactions={transactions} />

            <Typography>
              <b>Created :</b> {formatDate(product.createdAt)}
            </Typography>

            {/* buttons  */}
            <Divider />

            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">
                Edit
              </Button>

              <Button variant="contained" color="success">
                Stock In
              </Button>

              <Button variant="contained" color="warning">
                Stock Out
              </Button>

              <Button color="error">Delete</Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};

export default ProductDetailsDrawer;
