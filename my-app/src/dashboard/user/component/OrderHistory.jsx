import { History, UtensilsCrossed } from "lucide-react";

function OrderHistory() {
  return (
    <div className="mt-16">

      {/* Older Orders */}

      <div className="text-center mb-14">

        <div className="flex justify-center mb-4">
          <History size={50} className="text-gray-400" />
        </div>

        <h2 className="text-xl font-semibold text-gray-700">
          Looking for older orders?
        </h2>

        <p className="text-gray-500 mt-2">
          Your order history is automatically archived after 90 days.
        </p>

      </div>

      {/* Browse Restaurants */}

      <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white p-10 text-center">

        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <UtensilsCrossed size={30} className="text-gray-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Hungry for more?
        </h2>

        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Explore new premium restaurants curated just for your palate.
        </p>

        <button
          className="
            mt-8
            bg-[#ff5233]
            hover:bg-[#ff3f1d]
            text-white
            px-8
            py-3
            rounded-full
            font-semibold
            transition-all
            hover:scale-105
          "
        >
          Browse Restaurants
        </button>

      </div>

    </div>
  );
}

export default OrderHistory;