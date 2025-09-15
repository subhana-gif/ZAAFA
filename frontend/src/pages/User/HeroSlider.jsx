import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/hero-images/user"
    : "https://zaafa-backend.onrender.com/api/hero-images/user";

export default function HeroSlider() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // only active images
        setImages(data.filter((img) => img.isActive));
      })
      .catch((err) => console.error(err));
  }, []);

  if (images.length === 0) return null;

  return (
<section className="relative w-full aspect-[16/9] max-h-[350px] md:max-h-[450px] lg:max-h-[500px]">
  <Swiper
    modules={[Navigation, Autoplay]}
    navigation={true}
    autoplay={{ 
      delay: 3000, 
      disableOnInteraction: false,
      pauseOnMouseEnter: true 
    }}
    loop={images.length > 1}
    spaceBetween={0}
    slidesPerView={1}
    speed={500}
    className="w-full h-full"
    style={{
      "--swiper-navigation-color": "#fff",
      "--swiper-navigation-size": "20px",
    }}
  >
{images.map((img) => (
  <SwiperSlide key={img._id}>
    <div className="w-full h-full relative flex items-center justify-center bg-black/10">
      <img
        src={img.imageUrl}
        alt={img.title || "hero"}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20"></div>

      {img.title && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <h2 className="text-2xl md:text-5xl font-bold mb-4">{img.title}</h2>
          {img.description && (
            <p className="text-sm md:text-xl">{img.description}</p>
          )}
        </div>
      )}
    </div>
  </SwiperSlide>
))}
  </Swiper>
</section>

  );
}
