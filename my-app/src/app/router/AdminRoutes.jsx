import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../layouts/adminlayout/AdminLayout";
import Profile from "../../dashboard/user/pages/Profile";
import MenuManagement from "../../dashboard/admin/component/MenuManagement";
import AdminHomePage from "../../dashboard/admin/pages/AdminHomePage";
import StaffDirectory from "../../dashboard/admin/component/StaffDirectory";
import StockInventoryPage from "../../dashboard/admin/pages/StockInventoryPage";
import OffersManagementPage from "../../dashboard/admin/pages/OffersManagementPage";

export default function AdminRoutes(){
    return (
        <Routes>
            <Route element={<AdminLayout/>}>
                <Route path="/" element={<AdminHomePage/>}/>
                <Route path="menu-management" element={<MenuManagement/>}/>
                <Route path="staff-management" element={<StaffDirectory/>}/>
                <Route path="inventory" element={<StockInventoryPage/>}/>
                <Route path="offers" element={<OffersManagementPage/>}/>
                <Route path="profile" element={<Profile/>}/>
            </Route>
        </Routes>
    )
}