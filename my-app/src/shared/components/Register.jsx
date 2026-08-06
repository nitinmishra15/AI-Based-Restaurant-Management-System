import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContextApi/AuthProvider";

export default function Register() {
  const { addStaff } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    role: "Chef",
    dutyPeriod: "",
    password: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file
      }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    // 1. Email Validation
    const email = formData.email;
    if (!email.includes("@")) {
      setErrorMsg("Email must include '@'.");
      setSubmitting(false);
      return;
    }
    if (/^[0-9]/.test(email)) {
      setErrorMsg("Email must not start with a number.");
      setSubmitting(false);
      return;
    }
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Email must have a valid domain structure (e.g. name@domain.com).");
      setSubmitting(false);
      return;
    }

    // Allowed Domains Whitelist
    const emailParts = email.split("@");
    const domain = emailParts[emailParts.length - 1].toLowerCase();
    const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com"];
    if (!allowedDomains.includes(domain)) {
      setErrorMsg("Only gmail.com, hotmail.com, and outlook.com email domains are allowed.");
      setSubmitting(false);
      return;
    }

    // 2. Mobile Number Validation
    const mobile = formData.mobileNumber;
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setErrorMsg("Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.");
      setSubmitting(false);
      return;
    }

    // 2. Password Validation
    const password = formData.password;
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setErrorMsg("Password must be at least 8 characters long.");
      setSubmitting(false);
      return;
    }
    if (!hasUpperCase) {
      setErrorMsg("Password must contain at least one capital letter.");
      setSubmitting(false);
      return;
    }
    if (!hasLowerCase) {
      setErrorMsg("Password must contain at least one small letter.");
      setSubmitting(false);
      return;
    }
    if (!hasSpecialChar) {
      setErrorMsg("Password must contain at least one special symbol.");
      setSubmitting(false);
      return;
    }

    // 3. Compile Multipart FormData
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("mobileNumber", formData.mobileNumber);
    data.append("role", formData.role);
    const isAdminRole = formData.role.trim().toLowerCase() === "admin";
    data.append("dutyPeriod", isAdminRole ? "" : formData.dutyPeriod);
    data.append("password", formData.password);
    data.append("isOnDuty", true);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const response = await addStaff(data);
    if (response.success) {
      alert("Registration Successful! Please log in.");
      navigate("/login");
    } else {
      setErrorMsg(response.message || "Failed to register account.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Register Staff Account</h1>
          <p className="text-xs text-gray-400 mt-1">Create your Chef or Admin login account</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg text-left font-bold">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Staff Name (Username)</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. Karan Sharma"
              className="w-full px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. karan@qrdining.com"
              className="w-full px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="10 digit number"
              maxLength={10}
              className="w-full px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Chef, Admin"
              className="w-full px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required
            />
          </div>

          {formData.role.trim().toLowerCase() !== "admin" && (
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-700">Duty Period</label>
              <input
                type="text"
                name="dutyPeriod"
                value={formData.dutyPeriod}
                onChange={handleChange}
                placeholder="e.g. 9 AM - 6 PM"
                className="w-full px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters, 1 Cap, 1 Small, 1 Special"
              className="w-full px-4 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-700">Profile Photo</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#B71F04]/10 file:text-[#B71F04] hover:file:bg-[#B71F04]/20 cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 mt-2 rounded-lg bg-[#B71F04] text-white font-semibold text-xs hover:bg-[#FD745A] disabled:opacity-50 transition-colors duration-200 cursor-pointer"
          >
            {submitting ? "Registering Account..." : "Register Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-xs text-gray-500">Already have an account? </span>
          <span
            onClick={() => navigate("/login")}
            className="text-xs text-[#B71F04] font-bold hover:underline cursor-pointer"
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
}
