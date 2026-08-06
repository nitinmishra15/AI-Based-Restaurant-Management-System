import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../../../public/FeaturedOffers.css';

export default function FeaturedOffers() {
  const navigate = useNavigate();

  const offers = [
    {
      id: 1,
      type: "Dinner Special",
      badgeBg: "bg-[#B41B00]",
      title: "Aged Wagyu Feast",
      description: "Complimentary truffle butter appetizer with every order.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
      buttonText: "Claim Offer",
      targetUrl: "/user/offers"
    },
    {
      id: 2,
      type: "Early Bird",
      badgeBg: "bg-[#9333EA]",
      title: "Sunrise Morning Party",
      description: "20% off all artisan breakfast bowls before 10 A.M.",
      image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&q=80&w=600",
      buttonText: "Explore Menu",
      targetUrl: "/user/menu"
    },
    {
      id: 3,
      type: "Happy Hour",
      badgeBg: "bg-[#FF775D]",
      title: "Mixology Night",
      description: "Buy one signature cocktail, get the second half-off.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600",
      buttonText: "View Drinks",
      targetUrl: "/user/menu?category=Drinks"
    },
  ];

  const handleCardClick = (url) => {
    navigate(url);
  };

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-[1440px] mx-auto">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.custom-swiper-pagination',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="w-full pb-10"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id} className="py-2">
              <div 
                onClick={() => handleCardClick(offer.targetUrl)}
                className="group relative h-[240px] w-full rounded-[32px] overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] hover:scale-[1.03] transition-all duration-500"
              >
                
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
                </div>
 
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  
                  {/* Top Badge */}
                  <div>
                    <span className={`inline-block px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-full ${offer.badgeBg}`}>
                      {offer.type}
                    </span>
                  </div>
 
                  {/* Bottom Text & Button */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-white/80 font-medium max-w-[90%] leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="mt-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(offer.targetUrl);
                        }}
                        className="px-5 py-2 text-xs font-bold text-[#2D2F2F] bg-white rounded-full transition-all duration-300 hover:bg-[#FF775D] hover:text-white active:scale-95 shadow-md cursor-pointer"
                      >
                        {offer.buttonText}
                      </button>
                    </div>
                  </div>
 
                </div>
 
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
 
        <div className="custom-swiper-pagination flex justify-center gap-2 mt-2" />
      </div>
    </section>
  );
}
