import React, { useState, useEffect, useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const ScrambleText: React.FC<{
  text: string;
  className?: string;
  animationDelay?: number;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  scrambleMultiplier?: number;
}> = ({ text, className = '', animationDelay = 0, as: Component = 'p', scrambleMultiplier = 2 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isIntersecting = useIntersectionObserver(ref, {
    threshold: 0.5,
  });

  const scrambleChars = '!<>-_\\/[]{}—=+*^?#';

  useEffect(() => {
    if (isIntersecting && !isAnimationStarted) {
      const timer = setTimeout(() => {
        setIsAnimationStarted(true);
      }, animationDelay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, isAnimationStarted, animationDelay]);

  useEffect(() => {
    if (!isAnimationStarted || !text) return;
    setDisplayText(''.padStart(text.length, ' ')); // Start with blank spaces to prevent layout shift

    let frame = 0;
    const animate = () => {
      frame++;
      const newText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          // Start decoding after a small delay based on character index
          if (frame < index * scrambleMultiplier) {
            return scrambleChars.charAt(Math.floor(Math.random() * scrambleChars.length));
          }
          return char;
        })
        .join('');

      setDisplayText(newText);

      if (newText !== text) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimationStarted, text, scrambleMultiplier]);

  return (
    // @ts-ignore
    <Component ref={ref} className={className} aria-label={text}>
      {isAnimationStarted ? displayText : ''}
    </Component>
  );
};

export default ScrambleText;