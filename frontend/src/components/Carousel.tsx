import React, { useState, useEffect } from 'react';
import '../styles/Carousel.css';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  images, 
  autoPlay = true, 
  interval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay logic
  useEffect(() => {
    if (!autoPlay || !Array.isArray(images) || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images]);

  const goToPrevious = () => {
    if (!Array.isArray(images)) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    if (!Array.isArray(images)) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Fallback dacă nu există imagini
  if (!Array.isArray(images) || images.length === 0) {
    return <div className="carousel-empty">No images available</div>;
  }

  const safeIndex = currentIndex >= images.length ? 0 : currentIndex;

  return (
    <div className="carousel" key={images.join(",")}>
      {images.length > 1 && (
        <button className="carousel-button prev" onClick={goToPrevious}>
          ‹
        </button>
      )}
      
      <div className="carousel-content">
        <img 
          src={images[safeIndex]} 
          alt={`Slide ${safeIndex + 1}`}
          className="carousel-image"
        />
      </div>

      {images.length > 1 && (
        <button className="carousel-button next" onClick={goToNext}>
          ›
        </button>
      )}

      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === safeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
