import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, getImageUrl } from "../../../config/api";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menuList, setMenuList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.MENU_ITEMS);
            const normalized = (response.data || []).map(item => {
                const name = item.itemName !== undefined ? item.itemName : item.ItemName;
                const rawImg = item.imageUrl !== undefined ? item.imageUrl : item.ImageUrl;
                
                // Formulate the direct image URL from table column using getImageUrl helper
                let formattedImg = getImageUrl(rawImg);
                const lowercaseName = name ? name.toLowerCase() : "";

                if (
                    (!rawImg || rawImg.trim() === "" || rawImg.includes("coca-cola.jpg") || rawImg === "coke.png" || rawImg === "coke.jpg") &&
                    (lowercaseName.includes("coke") || lowercaseName.includes("coca-cola"))
                ) {
                    formattedImg = getImageUrl("/images/ee0d783c-95d0-478e-9054-7654cd3d0ab6_coca-cola.jpg", "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500");
                } else if (
                    (!rawImg || rawImg.trim() === "" || rawImg.includes("pepsi.jpg")) &&
                    lowercaseName.includes("pepsi")
                ) {
                    formattedImg = getImageUrl("/images/ad55d644-7af2-4ee0-b3cf-39365515c437_pepsi.jpg", "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500");
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

        axios.get(API_ENDPOINTS.CATEGORIES)
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
            await axios.post(API_ENDPOINTS.MENU_ITEMS, menuData);
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
            await axios.put(`${API_ENDPOINTS.MENU_ITEMS}/${id}`, menuData);
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
            await axios.delete(`${API_ENDPOINTS.MENU_ITEMS}/${id}`);
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