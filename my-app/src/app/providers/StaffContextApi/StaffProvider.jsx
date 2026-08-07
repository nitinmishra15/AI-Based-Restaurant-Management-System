import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StaffContext = createContext();

const StaffProvider = ({ children }) => {

    const [staffs, setStaffs] = useState([]);

    const API = "https://localhost:7155/api/Staff";

    // GET ALL STAFF

    const getAllStaff = async () => {
        try {
            const response = await axios.get(API);
            setStaffs(response.data);
        }
        catch (error) {
            console.log(error);
        }
    };

    // ADD STAFF

   const addStaff = async (staff) => {

    try {

        const formData = new FormData();

        formData.append("Name", staff.name);
        formData.append("Role", staff.role);
        formData.append("Department", staff.department);
        formData.append("Email", staff.email);
        formData.append("Phone", staff.phone);
        formData.append("Status", staff.status);
        formData.append("Image", staff.image);

        await axios.post(API, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        getAllStaff();

    }
    catch (error) {

        console.log(error);

    }
};

    // UPDATE STAFF
const updateStaff = async (id, staff) => {

    try {

        const formData = new FormData();

        formData.append("Name", staff.name);
        formData.append("Role", staff.role);
        formData.append("Department", staff.department);
        formData.append("Email", staff.email);
        formData.append("Phone", staff.phone);
        formData.append("Status", staff.status);

        if (staff.image) {
            formData.append("Image", staff.image);
        }

      const response = await axios.put(`${API}/${id}`, formData, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});

console.log(response.data);

        getAllStaff();

    }
    catch (error) {

        console.log(error.response);
        console.log(error);

    }

};
    // DELETE STAFF

  const deleteStaff = async (id) => {

    try {

        if (!window.confirm("Are you sure you want to delete this staff?"))
            return;

        await axios.delete(`${API}/${id}`);

        getAllStaff();

    }
    catch (error) {

        console.log(error);

    }
};

    useEffect(() => {

        getAllStaff();

    }, []);

    return (

        <StaffContext.Provider
            value={{
                staffs,
                getAllStaff,
                addStaff,
                updateStaff,
                deleteStaff
            }}
        >

            {children}

        </StaffContext.Provider>

    );
};

export default StaffProvider;