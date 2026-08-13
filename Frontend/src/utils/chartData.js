export const getCategoryData = (products = []) => {
  const counts = {};

  products.forEach((product) => {
    // Extract the category name safely, falling back to "Unknown" if missing
    const category = product.category?.name || "Unknown";

    counts[category] = (counts[category] || 0) + 1;
  });

  return Object.keys(counts).map((category) => ({
    name: category,
    value: counts[category],
  }));
};

export const getStockData = (products = []) => {
  let healthy = 0;
  let low = 0;

  products.forEach((product) => {
    if (product.quantity <= product.minStock) {
      low++;
    } else {
      healthy++;
    }
  });

  return [
    {
      name: "Healthy",
      value: healthy,
    },
    {
      name: "Low Stock",
      value: low,
    },
  ];
};
