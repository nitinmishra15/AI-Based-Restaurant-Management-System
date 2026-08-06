import { Camera, Mail, Phone, Pencil } from "lucide-react";

function ProfileOverviewHeader({ profile }) {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 mb-12">
      <div className="relative">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
        />

        <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
          <Camera size={18} />
        </button>
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-bold text-[#271814]">
          {profile.name}
        </h1>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
            <Mail size={18} />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
            <Phone size={18} />
            <span>{profile.mobile}</span>
          </div>
        </div>

        <button className="mt-6 flex items-center gap-2 bg-[#FF5233] text-white px-6 py-3 rounded-full hover:bg-[#e64a2d] transition">
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>
    </section>
  );
}

export default ProfileOverviewHeader;