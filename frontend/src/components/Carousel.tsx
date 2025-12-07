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

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return <div className="carousel-empty">No images available</div>;
  }

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={goToPrevious}>
        ‹
      </button>
      
      <div className="carousel-content">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />
      </div>

      <button className="carousel-button next" onClick={goToNext}>
        ›
      </button>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};