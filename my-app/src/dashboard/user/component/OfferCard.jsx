import { ArrowRight } from "lucide-react";

function OfferCard({ offer }) {
  const handleClaim = () => {
    if (offer.badge && offer.badge !== "PROMO") {
      navigator.clipboard.writeText(offer.badge);
      alert(`🎉 Coupon Code "${offer.badge}" copied to clipboard!\nUse this coupon code at checkout to apply your discount.`);
    } else {
      alert(`🎉 Promo Applied: "${offer.title}"!\nThis offer will be applied automatically at checkout.`);
    }
  };

  return (
    <div
      className="
      bg-white
      rounded-2xl
      overflow-hidden
      border
      border-red-100
      shadow-lg
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-300
      flex
      flex-col
      "
    >
      {/* Image */}

      <div className="relative overflow-hidden">

        <img
          src={offer.image}
          alt={offer.title}
          className="
          w-full
          h-72
          object-cover
          transition-transform
          duration-500
          hover:scale-110
          "
        />

        {/* Badge */}

        <div
          className="
          absolute
          top-4
          left-4
          text-white
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          uppercase
          tracking-wider
          animate-pulse
          "
          style={{
            backgroundColor: offer.badgeColor,
          }}
        >
          {offer.badge}
        </div>

      </div>

      {/* Content */}

      <div className="p-6 flex flex-col flex-1">

        <h2 className="text-3xl font-bold mb-2">
          {offer.title}
        </h2>

        <p className="text-gray-600 mb-8">
          {offer.description}
        </p>

        <button
          onClick={handleClaim}
          className="
          mt-auto
          bg-[#ff5233]
          hover:bg-[#ff3f1d]
          text-white
          rounded-full
          h-14
          flex
          justify-center
          items-center
          gap-2
          font-semibold
          transition
          cursor-pointer
          "
        >
          Claim Offer

          <ArrowRight size={20} />

        </button>

      </div>
    </div>
  );
}

export default OfferCard;