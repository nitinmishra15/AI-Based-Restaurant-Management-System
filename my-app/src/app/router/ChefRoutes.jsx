import { Routes, Route, Navigate } from "react-router-dom";
import ChefLayout from "../../layouts/cheflayout/ChefLayout";
import OrdersPage from "../../dashboard/chef/pages/Orders";
import MenuPage from "../../dashboard/chef/pages/Menu";
import ProfilePage from "../../dashboard/chef/pages/Profile";
import StaffDirectory from "../../dashboard/admin/component/StaffDirectory";
import StockInventoryPage from "../../dashboard/admin/pages/StockInventoryPage";

export default function ChefRoutes() {
  return (
    <Routes>
      <Route element={<ChefLayout />}>
        <Route index element={<Navigate to="/chef/orders" replace />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="inventory" element={<StockInventoryPage />} />
        <Route path="staff" element={<StaffDirectory />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
