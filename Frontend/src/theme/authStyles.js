export const authCardStyle = {
  maxWidth: 450,
  width: "100%",
  borderRadius: 5,
  p: 4,
  boxShadow: 10,
};

export const authBackground = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: (theme) =>
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg,#0f172a,#1e293b)"
      : "linear-gradient(135deg,#1976d2,#42a5f5)",
};