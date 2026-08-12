import { formatDate } from "../utils/date";

const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.getDashboardAnalytics = async (userId) => {

  const products = await Product.find({
    owner: userId,
  }).populate("category");

  const transactions = await Transaction.find({
    owner: userId,
  });

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.quantity * p.costPrice,
    0
  );

  const expectedRevenue = products.reduce(
    (sum, p) => sum + p.quantity * p.sellingPrice,
    0
  );

  const expectedProfit =
    expectedRevenue - inventoryValue;

  const lowStock = products.filter(
    (p) => p.quantity <= p.minStock
  ).length;

  const monthlyStock = Array(12).fill(0);

transactions.forEach((transaction) => {

    const month =
       formatDate(transaction.createdAt).getMonth();

    if(transaction.type==="IN")
        monthlyStock[month]+=transaction.quantity;

    else
        monthlyStock[month]-=transaction.quantity;

});
const categoryData = {};

products.forEach((product)=>{

    const category =
        product.category?.name || "Unknown";

    categoryData[category] =
        (categoryData[category] || 0)+1;

});
const topProducts=[...products]
.sort(
(a,b)=>
(b.quantity*b.sellingPrice)-
(a.quantity*a.sellingPrice)
)
.slice(0,5);

  return {
    inventoryValue,
    expectedRevenue,
    expectedProfit,
    lowStock,
    products,
    transactions,
    monthlyStock,
    categoryData,
    topProducts
  };
};