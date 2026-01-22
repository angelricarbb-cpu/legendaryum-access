import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: "1",
    title: "New Games",
    subtitle: "We challenge your gamer skills",
    cta: "Go to games",
    ctaLink: "/games",
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
  },
  {
    id: "2",
    title: "Rankings Live",
    subtitle: "Compete and win real rewards",
    cta: "Join now",
    ctaLink: "/rankings",
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    id: "3",
    title: "Weekly Missions",
    subtitle: "Complete tasks, earn prizes",
    cta: "View missions",
    ctaLink: "/missions",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
  },
  {
    id: "4",
    title: "Premium Events",
    subtitle: "Exclusive tournaments with big prizes",
    cta: "See events",
    ctaLink: "/events",
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[280px] md:h-[380px] lg:h-[420px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 translate-x-0" 
                : index < currentSlide 
                  ? "opacity-0 -translate-x-full" 
                  : "opacity-0 translate-x-full"
            }`}
          >
            {/* Background with gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative h-full container flex flex-col justify-center items-start px-8 md:px-16">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
                {slide.subtitle}
              </p>
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
              >
                <Link to={slide.ctaLink}>{slide.cta}</Link>
              </Button>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 py-4 bg-background">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentSlide(index); setIsAutoPlaying(false); }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
