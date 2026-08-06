import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../app/providers/AuthContextApi/AuthProvider";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Edit3, Save, X, ArrowLeft } from "lucide-react";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:44383/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = response.data;
      const loadedProfile = {
        name: data.name || data.Name || "",
        email: data.email || data.Email || "",
        mobile: data.mobile || data.Mobile || "",
        role: data.role || data.Role || "Customer"
      };
      setProfile(loadedProfile);
      setFormData({
        name: loadedProfile.name,
        email: loadedProfile.email,
        mobile: loadedProfile.mobile
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

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
      await axios.put("https://localhost:44383/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Profile updated successfully!");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold text-orange-600 animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md border border-gray-150">
          <span className="text-red-500 text-5xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-8">
          
          {/* Header block with only profile icon */}
          <div className="flex flex-col items-center mb-8 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">{profile.name}</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 mt-1 bg-orange-50 px-3 py-1 rounded-full">
              {profile.role}
            </span>
          </div>

          {!isEditing ? (
            /* Details View */
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                <p className="text-lg font-semibold text-gray-800 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100">{profile.name}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                <p className="text-lg font-semibold text-gray-800 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100">{profile.email}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Mobile Number</label>
                <p className="text-lg font-semibold text-gray-800 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100">{profile.mobile}</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2c1713] text-white font-bold rounded-xl hover:bg-black active:scale-95 transition-all"
                >
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* Edit Mode View */
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: profile.name, email: profile.email, mobile: profile.mobile });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;