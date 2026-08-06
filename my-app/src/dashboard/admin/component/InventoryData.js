import rice from "../../../assets/inventory/basmati-rice.jpg";
import paneer from "../../../assets/inventory/paneer.jpg";
import garamMasala from "../../../assets/inventory/garam-masala.jpg";
import curryLeaves from "../../../assets/inventory/curry-leaves.jpg";

const InventoryData = [
  {
    id: 1,
    name: "Basmati Rice",
    category: "Kitchen",
    quantity: "18 Bags",
    stock: 72,
    status: "In Stock",
    restocked: "12 Oct 2023",
    image: rice,
  },
  {
    id: 2,
    name: "Paneer",
    category: "Dairy",
    quantity: "2 Units",
    stock: 15,
    status: "Low Stock",
    restocked: "24 Oct 2023",
    image: paneer,
  },
  {
    id: 3,
    name: "Garam Masala",
    category: "Spices",
    quantity: "4.5 Kg",
    stock: 45,
    status: "Restock Soon",
    restocked: "30 Sep 2023",
    image: garamMasala,
  },
  {
    id: 4,
    name: "Curry Leaves",
    category: "Kitchen",
    quantity: "0.5 Kg",
    stock: 8,
    status: "Critical",
    restocked: "26 Oct 2023",
    image: curryLeaves,
  },
];

export default InventoryData;