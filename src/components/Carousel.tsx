import { useState, useEffect } from 'react';
import '../styles/Caroussel.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { API_BASE_URL } from "../constants/baseUrl";

interface Slide {
  id: number;
  title: string;
  image: string;
  cta_text?: string;
  cta_link?: string;
  badge?: string;
  order: number;
}

const API_URL = `${API_BASE_URL}/api/carousel/`;

const getImageUrl = (path: string) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

// ---------------- Module-level cache ----------------
let carouselCache: Slide[] | null = null;

const Carousel = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // ---------------- Load slides ----------------
  const loadSlides = async () => {
    try {
      // 1️⃣ Load from cache first
      if (carouselCache) {
        setSlides(carouselCache);
        setCurrentIndex(0);
      }

      // 2️⃣ Always fetch fresh data in background
      const res = await fetch(API_URL);
      const data: Slide[] = await res.json();

      // 3️⃣ Update only if data changed
      if (JSON.stringify(data) !== JSON.stringify(carouselCache)) {
        setSlides(data);
        setCurrentIndex(0);
        carouselCache = data;
      }
    } catch (err) {
      console.error("Carousel fetch error:", err);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // ---------------- Slide change logic ----------------
  const handleSlideChange = (newIndex: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFade(true);
    }, 300);
  };

  const goToPrev = () => {
    if (!slides.length) return;
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    handleSlideChange(newIndex);
  };

  const goToNext = () => {
    if (!slides.length) return;
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    handleSlideChange(newIndex);
  };

  // ---------------- Auto play ----------------
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  if (!slides.length) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="carousel">
      <button className="nav left" onClick={goToPrev}>
        <ArrowBackIosNewIcon className="arrow-icon" />
      </button>

      <div className="carousel-slide">
        <img
          src={getImageUrl(currentSlide.image)}
          alt={currentSlide.title}
          className={fade ? 'fade-in' : 'fade-out'}
        />

        {currentSlide.badge && (
          <span className="carousel-badge">
            {currentSlide.badge}
          </span>
        )}

        {currentSlide.cta_text && currentSlide.cta_link && (
          <div className="carousel-cta-wrapper">
            <a
              href={currentSlide.cta_link}
              className="carousel-cta animated-cta"
            >
              {currentSlide.cta_text}
            </a>
          </div>
        )}
      </div>

      <button className="nav right" onClick={goToNext}>
        <ArrowForwardIosIcon className="arrow-icon" />
      </button>

      <div className="pagination1">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleSlideChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
