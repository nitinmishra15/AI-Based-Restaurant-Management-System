import { LogOut } from "lucide-react";

function LogoutCard({ profile }) {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">

      <button
        className="
          flex
          items-center
          gap-3
          px-10
          py-4
          rounded-xl
          border-2
          border-transparent
          text-red-500
          hover:border-red-500
          hover:bg-red-50
          transition-all
        "
      >
        <LogOut size={24} />

        <span className="text-lg font-bold">
          Logout Session
        </span>
      </button>

      <p className="mt-4 text-sm text-gray-500">
        {profile.lastLogin}
      </p>

    </section>
  );
}

export default LogoutCard;