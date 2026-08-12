import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#2563eb",
      },

      secondary: {
        main: "#14b8a6",
      },

      success: {
        main: "#22c55e",
      },

      warning: {
        main: "#f59e0b",
      },

      error: {
        main: "#ef4444",
      },

      background: {
        default:
          mode === "light"
            ? "#f5f7fb"
            : "#0f172a",

        paper:
          mode === "light"
            ? "#ffffff"
            : "#1e293b",
      },
    },

    shape: {
      borderRadius: 14,
    },

    typography: {
      fontFamily:
        "Inter, Roboto, sans-serif",

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 700,
      },

      h6: {
        fontWeight: 600,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    components: {

      MuiPaper: {

        styleOverrides: {

          root: {

            borderRadius: 16,

          },

        },

      },

      MuiButton: {

        styleOverrides: {

          root: {

            borderRadius: 12,

            paddingInline: 18,

          },

        },

      },

      MuiTextField: {

        defaultProps: {

          size: "small",

        },

      },

    },

  });
