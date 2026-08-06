import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { resolveUploadUrl } from "../../api/axios";

export interface ExploreItem {
  id: string;
  to: string;
  title: string;
  category: string;
  thumbnail: string | null;
}

export function ExploreCarousel({ items }: { items: ExploreItem[] }) {
  if (items.length === 0) return null;

  return (
    <Swiper
      modules={[EffectCoverflow, Autoplay]}
      effect="coverflow"
      grabCursor
      centeredSlides
      loop={items.length > 3}
      slidesPerView="auto"
      spaceBetween={20}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 120,
        modifier: 1.5,
        slideShadows: false,
      }}
      autoplay={{ delay: 3200, disableOnInteraction: true }}
      className="!py-8"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} className="!w-64 sm:!w-72">
          <Link to={item.to} className="card group block overflow-hidden transition-[filter] duration-300">
            <div className="relative h-44 w-full overflow-hidden bg-secondary/5">
              {item.thumbnail ? (
                <>
                  <img
                    src={resolveUploadUrl(item.thumbnail)}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-secondary/30">Tidak ada foto</div>
              )}
              <span className="absolute bottom-2 left-3 text-xs font-semibold uppercase tracking-wide text-white/90">
                {item.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-1 text-base font-semibold text-secondary">{item.title}</h3>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
