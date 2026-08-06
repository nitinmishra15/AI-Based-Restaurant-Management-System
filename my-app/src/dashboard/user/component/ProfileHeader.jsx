import { Camera, Mail, Phone, ArrowLeft } from "lucide-react";

function ProfileHeader({ profile }) {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 mb-12">

      {/* Profile Image */}

      <div className="relative group">

        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">

          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

        </div>

        <button
          className="
          absolute
          bottom-2
          right-2
          bg-white
          text-[#b51c01]
          p-2
          rounded-full
          shadow-md
          hover:bg-[#fff0ee]
          transition-colors
        "
        >
          <Camera size={18} />
        </button>

      </div>

      {/* Right Side */}

      <div className="flex-1 text-center md:text-left">

        <h1 className="text-[32px] font-bold text-[#271814] mb-1">
          {profile.name}
        </h1>

        <div className="flex flex-col gap-1 mb-6">

          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">

            <Mail size={18} />

            <span className="text-base">
              {profile.email}
            </span>

          </div>

          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">

            <Phone size={18} />

            <span className="text-base">
              {profile.mobile}
            </span>

          </div>

        </div>

        <button
          className="
          px-8
          py-3
          border
          border-[#E5E7EB]
          rounded-full
          hover:bg-[#fff0ee]
          active:scale-95
          transition-all
          flex
          items-center
          gap-2
          mx-auto
          md:mx-0
        "
        >
          <ArrowLeft size={18} />

          Back to Profile

        </button>

      </div>

    </section>
  );
}

export default ProfileHeader;