import { Badge } from "lucide-react";

function PersonalInfoCard({ profile }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mt-8">

      <div className="flex items-center gap-3 mb-8">
        <Badge size={24} className="text-[#FF5233]" />

        <h2 className="text-2xl font-bold text-[#271814]">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
            Full Name
          </p>

          <p className="text-lg font-semibold">
            {profile.name}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
            Email Address
          </p>

          <p className="text-lg font-semibold">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
            Mobile Number
          </p>

          <p className="text-lg font-semibold">
            {profile.mobile}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
            Work Phone
          </p>

          <p className="text-lg text-gray-400">
            {profile.workPhone}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
            Delivery Address
          </p>

          <p className="text-lg">
            {profile.address}
          </p>
        </div>

      </div>

    </div>
  );
}

export default PersonalInfoCard;