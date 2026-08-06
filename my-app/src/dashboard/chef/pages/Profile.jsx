import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Award,
    Edit3,
    Save,
    X,
    User,
} from "lucide-react";

export default function Profile() {
    const [chefData, setChefData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
    const [saving, setSaving] = useState(false);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://localhost:44383/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data;
            const loadedChef = {
                name: data.name || data.Name || "Chef",
                role: data.role || data.Role || "Chef",
                email: data.email || data.Email || "",
                phone: data.mobile || data.Mobile || "",
                experience: "10 Years",
                specialization: "North Indian Cuisine",
                address: "Bhopal, Madhya Pradesh",
                orders: 1268,
                rating: 4.9,
                dishes: 52,
                shift: "Morning",
            };
            setChefData(loadedChef);
            setFormData({
                name: loadedChef.name,
                email: loadedChef.email,
                mobile: loadedChef.phone
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load chef profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.mobile) {
            alert("Please fill in all fields.");
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put("https://localhost:44383/api/profile", {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Chef profile updated successfully!");
            setIsEditing(false);
            await fetchProfile();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile details.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl font-bold text-gray-600 animate-pulse">Loading Profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <div className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    const chef = chefData;

    return (
        <div className="bg-gray-100 min-h-screen p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        My Profile
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your profile information.
                    </p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold active:scale-95 transition-all"
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Top Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 flex items-center gap-8">
                {/* Profile icon instead of image */}
                <div className="w-36 h-36 rounded-full border-4 border-orange-500 bg-gray-50 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-600" />
                </div>

                <div>
                    <h2 className="text-4xl font-bold">
                        {chef.name}
                    </h2>
                    <p className="text-orange-500 font-semibold text-lg mt-2">
                        {chef.role}
                    </p>
                    <div className="flex gap-8 mt-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Mail size={18} />
                            {chef.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={18} />
                            {chef.phone}
                        </div>
                    </div>
                </div>
            </div>

            {!isEditing ? (
                /* Details View */
                <>
                    {/* Statistics */}
                    <div className="grid grid-cols-4 gap-6 mt-8">
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <h3 className="text-gray-500">Orders Completed</h3>
                            <h1 className="text-4xl font-bold mt-3 text-orange-500">{chef.orders}</h1>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <h3 className="text-gray-500">Rating</h3>
                            <h1 className="text-4xl font-bold mt-3 text-green-600">⭐ {chef.rating}</h1>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <h3 className="text-gray-500">Signature Dishes</h3>
                            <h1 className="text-4xl font-bold mt-3 text-blue-600">{chef.dishes}</h1>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow">
                            <h3 className="text-gray-500">Shift</h3>
                            <h1 className="text-4xl font-bold mt-3 text-purple-600">{chef.shift}</h1>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-8 mt-8">
                        {/* Personal Info */}
                        <div className="bg-white rounded-3xl shadow p-8">
                            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Mail className="text-orange-500" />
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <h3 className="font-semibold">{chef.email}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="text-orange-500" />
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <h3 className="font-semibold">{chef.phone}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="text-orange-500" />
                                    <div>
                                        <p className="text-gray-500">Address</p>
                                        <h3 className="font-semibold">{chef.address}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="bg-white rounded-3xl shadow p-8">
                            <h2 className="text-2xl font-bold mb-6">Professional Details</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Briefcase className="text-orange-500" />
                                    <div>
                                        <p className="text-gray-500">Experience</p>
                                        <h3 className="font-semibold">{chef.experience}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Award className="text-orange-500" />
                                    <div>
                                        <p className="text-gray-500">Specialization</p>
                                        <h3 className="font-semibold">{chef.specialization}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Edit Mode View */
                <div className="bg-white rounded-3xl shadow-lg p-8 mt-8 space-y-6 max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4">Edit Profile details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-1">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({ name: chef.name, email: chef.email, mobile: chef.phone });
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} />
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Save size={16} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}