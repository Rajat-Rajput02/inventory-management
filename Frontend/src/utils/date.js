export const formatDate = (date = new Date()) => {
  const d = date ? new Date(date) : new Date();
  
  // Guard against invalid date values
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};