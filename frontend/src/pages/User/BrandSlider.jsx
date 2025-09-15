import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function BrandCarousel({ onBrandSelect }) {
  const [brands, setBrands] = useState([]);
  const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://zaafa-backend.onrender.com/api";

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/brands/user`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };
    fetchBrands();
  }, []);

  const handleClick = (brandId) => {
    if (onBrandSelect) onBrandSelect(brandId);
  };

  return (
    <section className="w-full py-10 bg-gray-100">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        navigation
        loop
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand._id} onClick={() => handleClick(brand._id)}>
            <div className="flex items-center justify-center cursor-pointer">
              <img
                src={
                  brand.image
                    ? `data:image/jpeg;base64,${brand.image}`
                    : "https://via.placeholder.com/100"
                }
                alt={brand.name}
                className="h-24 w-24 object-contain bg-white rounded-full shadow-md p-2"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
