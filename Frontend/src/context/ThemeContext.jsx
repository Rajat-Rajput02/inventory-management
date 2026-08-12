import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../theme/theme";

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  // Read saved theme from browser. Default to light if nothing is saved.
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Save theme whenever it changes.
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  // Create the MUI theme. useMemo avoids recreating it unnecessarily.
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Toggle between light and dark.
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook for cleaner usage.
export const useThemeContext = () => useContext(ThemeContext);