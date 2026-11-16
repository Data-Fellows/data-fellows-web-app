import type { ProductSlide } from "@/constants/products";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";

const SLIDE_DURATION = 6000;

const ProductSlideshow = ({ slides }: { slides: ProductSlide[] }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length < 2) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <div className="relative h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-black/20 sm:h-[380px]">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="(min-width: 1024px) 560px, 100vw"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
            <p className="text-sm font-semibold text-foreground">{slide.title}</p>
            <p>{slide.caption}</p>
          </div>
        </div>
      ))}

      {slides.length > 1 ? (
        <div className="absolute bottom-4 right-4 flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur">
          <button
            type="button"
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            onClick={() => setIsPaused((prev) => !prev)}
            className="rounded-full border border-border bg-background p-2 text-primary transition hover:border-primary"
          >
            {isPaused ? <FiPlay className="h-4 w-4" /> : <FiPause className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`slide-dot-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => {
                  setActiveSlide(index);
                  setIsPaused(false);
                }}
                className={`h-2 w-6 rounded-full transition ${
                  index === activeSlide ? "bg-primary" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductSlideshow;
