
function OrderCard({ order, onCancel }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        p-6
        flex
        flex-col
        md:flex-row
        gap-6
      "
    >
      {/* Food Image */}
      <img
        src={order.image}
        alt={order.restaurant}
        className="w-24 h-24 rounded-xl object-cover"
      />

      {/* Order Details */}
      <div className="flex-1">

        <div className="flex justify-between items-start flex-wrap gap-3">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {order.restaurant}
            </h2>

            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Order #{order.orderId} • {order.date}
            </p>
          </div>

          {/* Status Badge */}

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.statusColor === "green"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <p className="text-gray-600 mt-3">
          {order.items}
        </p>

        <div className="flex justify-between items-end mt-4">
          <h3 className="text-2xl font-bold text-[#ff5233]">
            {order.price}
          </h3>

          {order.status && order.status.toLowerCase() === "pending" && (
            <button
              onClick={() => onCancel(order.id)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-all duration-200 active:scale-95 shadow-sm"
            >
              Cancel Order
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default OrderCard;