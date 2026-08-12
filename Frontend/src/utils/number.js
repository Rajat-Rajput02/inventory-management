export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return "0";
  return Number(value).toLocaleString("en-IN");
};