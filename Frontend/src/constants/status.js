export const PRODUCT_STATUS = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Discontinued",
];
export const getStatusColor = (status) => {
  switch (status) {
    case "In Stock":
      return "success";

    case "Low Stock":
      return "warning";

    case "Out of Stock":
      return "error";

    case "Discontinued":
      return "default";

    default:
      return "info";
  }
};