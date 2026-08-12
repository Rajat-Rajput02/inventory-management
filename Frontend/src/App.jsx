import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Warehouses from "./pages/Warehouses";
import AppLayout from "./components/layout/AppLayout";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Users from "./pages/Users";

import { ROUTES } from "../src/constants/routes";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";

function App() {
  return (
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }/>
        {/* Protected Routes *
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } /> */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PRODUCTS} element={<Products />} />
              <Route path={ROUTES.CATEGORIES} element={<Categories />} />
              <Route path={ROUTES.SUPPLIERS} element={<Suppliers />} />
              <Route path={ROUTES.WAREHOUSES} element={<Warehouses />} />
              <Route
                path={ROUTES.TRANSACTIONS}
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ACTIVITY}
                element={
                  <ProtectedRoute>
                    <Activity />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SETTINGS}
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path={ROUTES.REPORTS} element={<Reports />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path="/users" element={<Users />} />
            </Route>
            {/* Unknown Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
 
  );
}
export default App;
