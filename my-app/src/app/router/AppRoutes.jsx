
import { Route, Routes, Navigate } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ChefRoutes from "./ChefRoutes";
import TablePage from "../../features/qr/pages/TablePage";
import Login from "../../shared/components/Login";
import Register from "../../shared/components/Register";
import { useAuth } from "../providers/AuthContextApi/AuthProvider";

// Protects admin routes: only accessible by Admin
function AdminGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role || user.Role;
  if (role !== "Admin") {
    if (role === "Chef") return <Navigate to="/chef" replace />;
    return <Navigate to="/user" replace />;
  }
  return children;
}

// Protects chef routes: only accessible by Chef
function ChefGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role || user.Role;
  if (role !== "Chef") {
    if (role === "Admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/user" replace />;
  }
  return children;
}

// Protects customer pages: Admins and Chefs are redirected to their respective dashboards
function UserGuard({ children }) {
  const { user } = useAuth();
  if (user) {
    const role = user.role || user.Role;
    if (role === "Admin") return <Navigate to="/admin" replace />;
    if (role === "Chef") return <Navigate to="/chef" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer / Table Routes */}
      <Route path="/" element={<UserGuard><TablePage /></UserGuard>} />
      <Route path="/user/*" element={<UserGuard><UserRoutes /></UserGuard>} />

      {/* Staff Login Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/*" element={<AdminGuard><AdminRoutes /></AdminGuard>} />

      {/* Chef Protected Routes */}
      <Route path="/chef/*" element={<ChefGuard><ChefRoutes /></ChefGuard>} />
    </Routes>
  );
}

