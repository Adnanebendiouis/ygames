import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Caroussel.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { API_BASE_URL } from '../constants/baseUrl';

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
const FADE_MS = 300;
const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD = 50;

const getImageUrl = (path: string) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};

// ---------------- Module-level cache ----------------
let carouselCache: Slide[] | null = null;

type Status = 'loading' | 'ready' | 'error';

const Carousel = () => {
  const [slides, setSlides] = useState<Slide[]>(carouselCache ?? []);
  const [status, setStatus] = useState<Status>(carouselCache ? 'ready' : 'loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [paused, setPaused] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchStartX = useRef<number | null>(null);

  // ---------------- Load slides ----------------
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error('Unexpected response shape');

        const sorted = [...(data as Slide[])].sort((a, b) => a.order - b.order);

        // Update only if data changed
        if (JSON.stringify(sorted) !== JSON.stringify(carouselCache)) {
          carouselCache = sorted;
          setSlides(sorted);
          // Keep the user's position unless it no longer exists
          setCurrentIndex(i => (i < sorted.length ? i : 0));
        }
        setStatus('ready');
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Carousel fetch error:', err);
        // If we already have cached slides, keep showing them
        setStatus(carouselCache ? 'ready' : 'error');
      }
    };

    load();
    return () => controller.abort();
  }, []);

  // Clear any pending fade timeout on unmount
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // ---------------- Slide change logic (single path for everything) ----------------
  const changeSlide = useCallback(
    (getNext: (prev: number) => number) => {
      if (slides.length < 2) return;
      clearTimeout(timeoutRef.current);
      setFade(false);
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(getNext);
        setFade(true);
      }, FADE_MS);
    },
    [slides.length]
  );

  const goToNext = useCallback(
    () => changeSlide(prev => (prev + 1) % slides.length),
    [changeSlide, slides.length]
  );

  const goToPrev = useCallback(
    () => changeSlide(prev => (prev - 1 + slides.length) % slides.length),
    [changeSlide, slides.length]
  );

  const goTo = (index: number) => {
    if (index === currentIndex) return;
    changeSlide(() => index);
  };

  // ---------------- Auto play (pauses on hover/focus, respects reduced motion) ----------------
  const goToNextRef = useRef(goToNext);
  useEffect(() => {
    goToNextRef.current = goToNext;
  }, [goToNext]);

useEffect(() => {
  if (slides.length < 2 || paused) return;

  const interval = setInterval(() => goToNextRef.current(), AUTOPLAY_MS);
  return () => clearInterval(interval);
}, [slides.length, paused]);

  // ---------------- Preload next image ----------------
  useEffect(() => {
    if (slides.length < 2) return;
    const next = slides[(currentIndex + 1) % slides.length];
    if (next?.image) new Image().src = getImageUrl(next.image);
  }, [currentIndex, slides]);

  // ---------------- Swipe support ----------------
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goToNext();
    else goToPrev();
  };

  // ---------------- Render ----------------
  if (status === 'error' && !slides.length) return null;

  // Reserve space while loading so the page doesn't jump
  if (!slides.length) {
    return (
      <div className="carousel" aria-hidden="true">
        <div className="carousel-slide carousel-skeleton" />
      </div>
    );
  }

  const currentSlide = slides[currentIndex] ?? slides[0];
  const hasMultiple = slides.length > 1;

  return (
<section
  className="carousel"
  aria-roledescription="carousel"
  aria-label="Featured slides"
  onFocus={e => e.target.matches(':focus-visible') && setPaused(true)}
  onBlur={() => setPaused(false)}
>
      <div
        className="carousel-slide active"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* key restarts the zoom animation on every slide change */}
        <img
          key={currentSlide.id}
          src={getImageUrl(currentSlide.image)}
          alt={currentSlide.title}
          className={fade ? 'fade-in' : 'fade-out'}
          loading="eager"
          draggable={false}
        />

        {currentSlide.badge && (
          <span className="carousel-badge">{currentSlide.badge}</span>
        )}

        {currentSlide.cta_text && currentSlide.cta_link && (
          <a href={currentSlide.cta_link} className="carousel-cta">
            {currentSlide.cta_text}
          </a>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              className="nav left"
              onClick={goToPrev}
              aria-label="Previous slide"
            >
              <ArrowBackIosNewIcon className="arrow-icon" />
            </button>

            <button
              type="button"
              className="nav right"
              onClick={goToNext}
              aria-label="Next slide"
            >
              <ArrowForwardIosIcon className="arrow-icon" />
            </button>

            <div className="pagination1">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Carousel;