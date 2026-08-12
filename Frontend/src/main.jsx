import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AuthProvider from "./context/AuthContext";

import { ThemeProviderWrapper } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>

  <ThemeProviderWrapper>
    <App />
  </ThemeProviderWrapper>

</AuthProvider>
);