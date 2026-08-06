import { Heart, Star, Plus } from "lucide-react";
import { useCart } from "../../../shared/hooks/useCart";

function FoodCard({ item }) {
  const { addToCart } = useCart();
  const name = item.name || item.itemName || "Delicious Dish";
  const image = item.image || item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
  const type = item.type || "veg";
  const rating = item.rating || "4.8";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">

      {/* Image */}
      <div className="relative">

        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover"
        />

        {/* Favourite Button */}
        <button className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
          <Heart size={20} />
        </button>

        {/* Veg / Non Veg */}
        <div className="absolute bottom-4 left-4 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow">

          {type === "veg" ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-green-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              </div>

              <span className="font-semibold text-xs uppercase">
                Veg
              </span>
            </>
          ) : (
            <>
              <div className="w-3.5 h-3.5 border-2 border-red-600 flex items-center justify-center">
                <div
                  className="
                    w-0
                    h-0
                    border-l-[4px]
                    border-r-[4px]
                    border-b-[7px]
                    border-l-transparent
                    border-r-transparent
                    border-b-red-600
                  "
                ></div>
              </div>

              <span className="font-semibold text-xs uppercase">
                Non-Veg
              </span>
            </>
          )}

        </div>

      </div>

      {/* Content */}

      <div className="p-5">

        <div className="flex justify-between items-start">

          <h2 className="text-xl font-bold line-clamp-1">
            {name}
          </h2>

          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-lg">

            <Star
              size={14}
              fill="#facc15"
              color="#facc15"
            />

            <span className="font-bold text-xs">
              {rating}
            </span>

          </div>

        </div>

        <p className="text-gray-600 mt-2 text-sm line-clamp-2">
          {item.description}
        </p>

        <div className="flex justify-between items-center mt-4">

          <h2 className="text-xl font-bold text-red-600">
            ₹{item.price}
          </h2>

          <button 
            onClick={() => {
              addToCart({
                id: item.id,
                name: name,
                price: item.price,
                image: image
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 flex items-center gap-1.5 text-xs font-semibold"
          >

            <Plus size={16} />

            Add

          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;