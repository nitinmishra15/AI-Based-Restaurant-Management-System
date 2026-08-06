import { Outlet, useLocation } from "react-router-dom";
import UserNavbar from "../../dashboard/user/component/UserNavbar";
import CartDrawer from "../../dashboard/user/component/CartDrawer";
import { CartProvider } from "../../app/providers/CartProvider";
import { useState } from "react";
import { useCart } from "../../shared/hooks/useCart";
import { useAuth } from "../../app/providers/AuthContextApi/AuthProvider";

function UserLayoutContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState('discover');
  const { user } = useAuth();
  const location = useLocation();

  // Consume global cart Context API
  const { cartOpen, setCartOpen } = useCart();

  const handleProfileClick = () => {
    if (user) {
      alert(`👤 Customer Profile:\n- Name: ${user.username || user.Username}\n- Email: ${user.email || user.Email || "N/A"}\n- Role: Customer`);
    } else {
      alert("👤 Profile Summary:\n- Status: Guest (Not logged in)\n- Please add items to the cart and checkout to log in!");
    }
  };

  const handleNotificationClick = () => {
    alert("🔔 Notifications:\n- Your last order has been served!\n- Happy Hour ends in 45 minutes!");
  };

  const showNavbar = !location.pathname.includes("/menu");

  return (
    <div className="flex flex-col w-full">
      {showNavbar && (
        <UserNavbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCartClick={() => setCartOpen(true)}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
      <Outlet />
      
      {/* Render the single Cart Drawer globally at layout root */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function UserLayout() {
  return (
    <CartProvider>
      <UserLayoutContent />
    </CartProvider>
  );
}