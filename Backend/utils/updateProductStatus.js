const updateProductStatus = (product) => {
  if (product.quantity <= 0) {
    product.status = "Out of Stock";
  } else if (product.quantity <= product.minStock) {
    product.status = "Low Stock";
  } else {
    product.status = "In Stock";
  }
};

module.exports = updateProductStatus;