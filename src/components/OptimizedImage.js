import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/performance';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  sizes = '100vw',
  priority = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // If priority is true, load immediately
    if (priority) {
      loadImage();
      return;
    }

    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observerRef.current.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      loadImage();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority]);

  const loadImage = () => {
    if (!src) return;

    const optimizedSrc = getOptimizedImageUrl(src, width, 80);
    
    const img = new Image();
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setError(true);
      setImageSrc(placeholder);
    };
    img.src = optimizedSrc;
  };

  const handleError = () => {
    setError(true);
    setImageSrc(placeholder);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${imageLoaded ? 'loaded' : 'loading'} ${error ? 'error' : ''}`}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      onError={handleError}
      style={{
        opacity: imageLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease-in-out',
        ...props.style,
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
