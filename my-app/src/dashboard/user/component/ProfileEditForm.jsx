import { useState } from "react";
import { Badge } from "lucide-react";

function ProfileEditForm({ profile }) {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0px_12px_30px_rgba(0,0,0,0.08)] transition-all duration-200">

      {/* Heading */}

      <div className="flex items-center gap-3 mb-8">
        <Badge className="text-[#b51c01]" size={24} />

        <h2 className="text-2xl font-bold text-[#271814]">
          Edit Profile
        </h2>
      </div>

      {/* Form */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

        {/* Full Name */}

        <div className="flex flex-col gap-2">

          <label className="text-sm font-semibold text-gray-500 px-1">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 bg-white px-4 rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#FF5233] focus:ring-2 focus:ring-[#FF5233]/10 transition-all"
          />

        </div>

        {/* Email */}

        <div className="flex flex-col gap-2">

          <label className="text-sm font-semibold text-gray-500 px-1">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 bg-white px-4 rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#FF5233] focus:ring-2 focus:ring-[#FF5233]/10 transition-all"
          />

        </div>

        {/* Mobile */}

        <div className="flex flex-col gap-2">

          <label className="text-sm font-semibold text-gray-500 px-1">
            Mobile Number
          </label>

          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full h-12 bg-white px-4 rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#FF5233] focus:ring-2 focus:ring-[#FF5233]/10 transition-all"
          />

        </div>

        {/* Work Phone */}

        <div className="flex flex-col gap-2 opacity-40">

          <label className="text-sm font-semibold text-gray-500 px-1">
            Work Phone (Optional)
          </label>

          <input
            type="text"
            name="workPhone"
            value={formData.workPhone}
            onChange={handleChange}
            placeholder="Add phone"
            className="w-full h-12 bg-white px-4 rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#FF5233] focus:ring-2 focus:ring-[#FF5233]/10 transition-all"
          />

        </div>

        {/* Address */}

        <div className="flex flex-col gap-2 md:col-span-2">

          <label className="text-sm font-semibold text-gray-500 px-1">
            Delivery Address
          </label>

          <textarea
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-white p-4 rounded-lg border border-[#E5E7EB] resize-none focus:outline-none focus:border-[#FF5233] focus:ring-2 focus:ring-[#FF5233]/10 transition-all"
          />

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-10 flex justify-end">

        <button className="px-6 py-2 text-gray-500 font-semibold hover:text-black transition-colors">
          Discard
        </button>

        <button className="ml-4 px-10 py-2 bg-[#271814] text-white rounded-lg font-semibold hover:bg-black active:scale-95 transition-all">
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default ProfileEditForm;