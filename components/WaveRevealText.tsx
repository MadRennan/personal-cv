import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const WaveRevealText: React.FC<{ text: string; className?: string; }> = ({ text, className = '' }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  // Trigger when the element is 60% visible for a more intentional feel
  const isIntersecting = useIntersectionObserver(ref, { threshold: 0.6 });

  return (
    <h2
      ref={ref}
      // The component applies the base class and the animation trigger class
      className={`${className} wave-reveal-text ${isIntersecting ? 'animate' : ''}`}
      // The text is passed as an aria-label for the CSS pseudo-element to use
      aria-label={text}
    >
      {/* The original text is kept for SEO and accessibility (e.g., screen readers) */}
      {text}
    </h2>
  );
};

export default WaveRevealText;
