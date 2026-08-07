import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menuList, setMenuList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const response = await axios.get("https://localhost:44380/api/menuitems");
            const normalized = (response.data || []).map(item => {
                const name = item.itemName !== undefined ? item.itemName : item.ItemName;
                const rawImg = item.imageUrl !== undefined ? item.imageUrl : item.ImageUrl;
                
                // Formulate the direct image URL from table column
                let formattedImg = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500";
                const lowercaseName = name ? name.toLowerCase() : "";

                if (
                    (!rawImg || rawImg.trim() === "" || rawImg.includes("coca-cola.jpg") || rawImg === "coke.png" || rawImg === "coke.jpg") &&
                    (lowercaseName.includes("coke") || lowercaseName.includes("coca-cola"))
                ) {
                    formattedImg = "https://localhost:44380/images/ee0d783c-95d0-478e-9054-7654cd3d0ab6_coca-cola.jpg";
                } else if (
                    (!rawImg || rawImg.trim() === "" || rawImg.includes("pepsi.jpg")) &&
                    lowercaseName.includes("pepsi")
                ) {
                    formattedImg = "https://localhost:44380/images/ad55d644-7af2-4ee0-b3cf-39365515c437_pepsi.jpg";
                } else if (rawImg && typeof rawImg === "string" && rawImg.trim() !== "") {
                    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
                        formattedImg = rawImg;
                    } else {
                        const slash = rawImg.startsWith("/") ? "" : "/";
                        formattedImg = `https://localhost:44380${slash}${rawImg}`;
                    }
                }

                return {
                    id: item.id !== undefined ? item.id : item.Id,
                    itemName: name,
                    price: item.price !== undefined ? item.price : item.Price,
                    description: item.description !== undefined ? item.description : item.Description,
                    status: item.status !== undefined ? item.status : item.Status,
                    categoryId: item.categoryId !== undefined ? item.categoryId : item.CategoryId,
                    categoryName: item.categoryName !== undefined ? item.categoryName : item.CategoryName,
                    imageUrl: formattedImg
                };
            });
            setMenuList(normalized);
        } catch (error) {
            console.log("Menu loading error", error);
        }
    };

    useEffect(() => {
        // Load menu and category data from backend
        fetchMenu();

        axios.get("https://localhost:44380/api/categories")
            .then((response) => {
                const normalized = (response.data || []).map(cat => ({
                    id: cat.id !== undefined ? cat.id : cat.Id,
                    categoryName: cat.categoryName !== undefined ? cat.categoryName : cat.CategoryName
                }));
                setCategories(normalized);
            })
            .catch((error) => {
                console.log("Category loading error", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const addMenuItem = async (menuData) => {
        try {
            await axios.post("https://localhost:44380/api/menuitems", menuData);
            await fetchMenu();
            return {
                success: true
            };
        }
        catch (err) {
            console.log(err);
            return {
                success: false,
                message: err.response?.data || "Failed to add item"
            };
        }
    };

    const updateMenuItem = async (id, menuData) => {
        try {
            await axios.put(`https://localhost:44380/api/menuitems/${id}`, menuData);
            await fetchMenu();
            return {
                success: true
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                message: err.response?.data || "Failed to update item"
            };
        }
    };

    const deleteMenuItem = async (id) => {
        try {
            await axios.delete(`https://localhost:44380/api/menuitems/${id}`);
            await fetchMenu();
            return {
                success: true
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                message: err.response?.data || "Failed to delete item"
            };
        }
    };

    return (
        <MenuContext.Provider
            value={{
                menuList,
                categories,
                loading,
                addMenuItem,
                updateMenuItem,
                deleteMenuItem
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};