export const getInventorySummary = (products = []) => {
  if (!Array.isArray(products)) {
    console.error("Expected products to be an array:", products);

    return {
      totalProducts: 0,
      lowStock: 0,
      categories: 0,
      inventoryValue: 0,
    };
  }

  const totalProducts = products.length;

  const lowStock = products.filter(
    (product) => product.quantity <= product.minStock
  ).length;

  const categories = new Set(
    products.map((product) => product.category)
  ).size;

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.sellingPrice ?? product.price ?? 0) * Number(product.quantity ?? 0),
    0
  );

  return {
    totalProducts,
    lowStock,
    categories,
    inventoryValue,
  };
};