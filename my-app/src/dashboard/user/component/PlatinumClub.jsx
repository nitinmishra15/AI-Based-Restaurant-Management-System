import { Tag } from "lucide-react";

function PlatinumClub() {
  return (
    <section className="mt-10 bg-[#fff3f0] border border-red-100 rounded-2xl p-6">

      <div className="flex flex-col md:flex-row items-center justify-between gap-5">

        {/* Left */}

        <div className="flex items-center gap-5">

          <div className="w-14 h-14 rounded-full bg-[#d9371b] flex items-center justify-center">

            <Tag className="text-white" size={28} />

          </div>

          <div>

            <h2 className="text-xl font-bold">
              Join the Platinum Club
            </h2>

            <p className="text-gray-500 mt-1">
              Get early access to exclusive menu items and
              priority reservations.
            </p>

          </div>

        </div>

        {/* Right */}

        <button
          className="
          bg-[#2d1d19]
          hover:bg-black
          text-white
          px-8
          py-3
          rounded-full
          font-semibold
          transition
          "
        >
          LEARN MORE
        </button>

      </div>

    </section>
  );
}

export default PlatinumClub;