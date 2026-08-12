import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate } from "../date";

const exportExcel = (products = [], summary = {}, transactions = []) => {
  const workbook = XLSX.utils.book_new();

  // Worksheet 1: Products
  const productsData = products.map((item) => ({
    Name: item.name || "",
    SKU: item.sku || "N/A",
    Category: typeof item.category === "object" ? item.category?.name : item.category || "Uncategorized",
    Warehouse: typeof item.warehouse === "object" ? item.warehouse?.name : item.warehouse || "Unassigned",
    Supplier: typeof item.supplier === "object" ? item.supplier?.name : item.supplier || "N/A",
    "Selling Price": item.sellingPrice ?? item.price ?? 0,
    "Cost Price": item.costPrice ?? 0,
    Quantity: item.quantity ?? 0,
    "Min Stock": item.minStock ?? 0,
    Status: item.status || (item.quantity > 0 ? "Active" : "Inactive"),
  }));
  const productsSheet = XLSX.utils.json_to_sheet(productsData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");

  // Worksheet 2: Summary
  const summaryData = [
    { Metric: "Total Visible Products", Value: summary.visibleProducts || products.length },
    { Metric: "Low Stock Items Count", Value: summary.lowStock || 0 },
    { Metric: "Total Categories Count", Value: summary.categoriesCount || 0 },
    { Metric: "Total Inventory Value", Value: summary.inventoryValue || 0 },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Worksheet 3: Transactions
  const transactionsData = (transactions.length ? transactions : [
    { Message: "No recent transactions linked to selection" }
  ]);
  const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
  XLSX.utils.book_append_sheet(workbook, transactionsSheet, "Transactions");

  // Worksheet 4: Low Stock
  const lowStockItems = products
    .filter((item) => Number(item.quantity ?? 0) <= Number(item.minStock ?? 0))
    .map((item) => ({
      Name: item.name,
      Quantity: item.quantity,
      MinStock: item.minStock,
      Status: "CRITICAL LOW STOCK",
    }));
  const lowStockSheet = XLSX.utils.json_to_sheet(
    lowStockItems.length ? lowStockItems : [{ Status: "All stock levels normal" }]
  );
  XLSX.utils.book_append_sheet(workbook, lowStockSheet, "Low Stock");

  // Generate and Save Excel File
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Inventory_Report_${formatDate(new Date()).slice(0, 10)}.xlsx`);
};

export default exportExcel;