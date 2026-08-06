import { CreditCard, Bell, ChevronRight } from "lucide-react";

function AccountActionCards({ profile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {/* Payment Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition cursor-pointer">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <CreditCard size={22} className="text-[#FF5233]" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Payment Methods
              </h3>

              <p className="text-gray-500 text-sm">
                {profile.payment}
              </p>
            </div>

          </div>

          <ChevronRight className="text-gray-400" />

        </div>

      </div>

      {/* Notification Card */}

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition cursor-pointer">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Bell size={22} className="text-[#FF5233]" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Notifications
              </h3>

              <p className="text-gray-500 text-sm">
                {profile.notifications}
              </p>
            </div>

          </div>

          <ChevronRight className="text-gray-400" />

        </div>

      </div>

    </div>
  );
}

export default AccountActionCards;