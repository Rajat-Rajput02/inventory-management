import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { lazy, Suspense } from "react";

import AppLayout from "./components/layout/AppLayout";

import { ROUTES } from "./constants/routes";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";

import Loader from "./components/common/Loader";
// Public pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// Protected pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Warehouses = lazy(() => import("./pages/Warehouses"));
const Reports = lazy(() => import("./pages/Reports"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Activity = lazy(() => import("./pages/Activity"));
const Settings = lazy(() => import("./pages/Settings"));
const Users = lazy(() => import("./pages/Users"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* =========================
              PUBLIC ROUTES
          ========================= */}

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

          {/* =========================
              PROTECTED ROUTES
          ========================= */}

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

          {/* =========================
              UNKNOWN ROUTE
          ========================= */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;