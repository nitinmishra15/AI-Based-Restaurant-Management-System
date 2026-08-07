import { Route, Routes } from "react-router-dom";
import UserHomePage from "../../dashboard/user/pages/UserHomePage";
import UserLayout from "../../layouts/userlayout/UserLayout";
import Menu from "../../dashboard/user/pages/Menu";
import Offers from "../../dashboard/user/pages/Offers";
import Orders from "../../dashboard/user/pages/Orders";
import Profile from "../../dashboard/user/pages/Profile";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserHomePage />} />
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}