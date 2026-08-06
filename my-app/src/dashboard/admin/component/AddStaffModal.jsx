import React, { useContext, useState } from "react";
import { StaffContext } from "../../../app/providers/StaffContextApi/StaffProvider";

const AddStaffModal = ({ close, staffData }) => {

    const { addStaff, updateStaff } = useContext(StaffContext);

    console.log(staffData);

    const [staff, setStaff] = useState({
        name: staffData?.name || "",
        role: staffData?.role || "",
        department: staffData?.department || "",
        email: staffData?.email || "",
        phone: staffData?.phone || "",
        status: staffData?.status || "On Duty",
        image: null
    });

    const handleChange = (e) => {

        setStaff({
            ...staff,
            [e.target.name]: e.target.value
        });

    };

    const handleImageChange = (e) => {

        setStaff({
            ...staff,
            image: e.target.files[0]
        });

    };

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if (staffData) {

        console.log("ID =", staffData.staffId);
console.log("Staff =", staff);

            await updateStaff(staffData.staffId, staff);

            alert("Staff Updated Successfully");

        }
        else {

            await addStaff(staff);

            alert("Staff Added Successfully");

        }

        close();

    }
    catch (error) {

        alert("Something went wrong.");

    }

};

    return (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

            <div className="bg-white w-[500px] rounded-lg p-6">

                <h2 className="text-2xl font-bold mb-5">

                    {staffData ? "Update Staff" : "Add Staff"}

                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={staff.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="text"
                        name="role"
                        placeholder="Role"
                        value={staff.role}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={staff.department}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={staff.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={staff.phone}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="status"
                        value={staff.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option>On Duty</option>
                        <option>Off Duty</option>
                    </select>

                    <div>

                        <label className="font-semibold">

                            Choose Image

                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border p-2 rounded mt-2"
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={close}
                            className="bg-gray-300 px-5 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-5 py-2 rounded"
                        >
                            {staffData ? "Update" : "Save"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default AddStaffModal;