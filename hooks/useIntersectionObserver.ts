import { useState, useEffect, RefObject } from 'react';

// This custom hook encapsulates the Intersection Observer API logic,
// making it easy to detect when an element is visible in the viewport.
// It's more performant than attaching event listeners to the scroll event.

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
  }: IntersectionObserverOptions
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    // Ensure we have an element to observe
    if (!element) {
      return;
    }

    // The callback function to execute when the intersection status changes
    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      // Update state with the new intersection status
      setIsIntersecting(entry.isIntersecting);
    };
    
    // Create the observer instance with the defined options
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });
    
    // Start observing the target element
    observer.observe(element);

    // Cleanup function to unobserve the element when the component unmounts
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, root, rootMargin]);

  return isIntersecting;
};

export default useIntersectionObserver;