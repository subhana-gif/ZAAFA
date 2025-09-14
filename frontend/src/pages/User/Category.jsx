import {useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft,ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


export default function CategoryCarousel({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const API_URL = "https://zaafa-backend.onrender.com/api/categories/user"
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_URL);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

const handleClick = (categoryId) => {
  console.log("Category clicked:", categoryId); // 🔥 debug log
  if (onCategorySelect) onCategorySelect(categoryId);
};

  const getImageUrl = (base64Image) => `data:image/jpeg;base64,${base64Image}`;

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-12 bg-gray-50 relative">
      {/* Left Arrow */}
      <div
        ref={prevRef}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
      >
        <ChevronLeft size={24} />
      </div>

      {/* Right Arrow */}
      <div
        ref={nextRef}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
      >
        <ChevronRight size={24} />
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={16}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <div
              onClick={() => handleClick(category._id)}
              className="relative cursor-pointer w-full aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              {category.image ? (
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-yellow-300 to-yellow-500 flex items-center justify-center rounded-2xl">
                  <span className="text-white text-3xl font-extrabold">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 rounded-2xl">
                <h3 className="text-white font-bold text-lg sm:text-xl text-center w-full">
                  {category.name}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
