

import React, { useState, useEffect } from 'react';
import { generateAndCacheImage } from '../utils/gemini';

interface GenerativeImageProps {
  imageId: string;
  prompt: string;
  alt: string;
  className?: string;
  aspectRatio?: '4:3' | '16:9';
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-rose-500/70">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
  
const ImagePlaceholder: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-full h-full bg-neutral-200 dark:bg-neutral-800 ${className}`}>
        <div className="w-full h-full shimmer-bg" />
    </div>
);
  
const ErrorFallback: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-full h-full bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center ${className}`}>
      <ErrorIcon />
    </div>
);

const GenerativeImage: React.FC<GenerativeImageProps> = ({ imageId, prompt, alt, className, aspectRatio = '4:3' }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;
        
        const fetchImage = async () => {
            setError(null);
            try {
                const validAspectRatio = aspectRatio === '16:9' ? '16:9' : '4:3';
                const base64Bytes = await generateAndCacheImage(imageId, prompt, validAspectRatio);
                if (!isCancelled) {
                    setImageUrl(`data:image/jpeg;base64,${base64Bytes}`);
                }
            } catch (err) {
                if (!isCancelled) {
                    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
                    // Don't show "API_KEY not set" to the end user.
                    if(message.includes("API_KEY")) {
                         setError("Image generation is currently unavailable.");
                    } else {
                         setError(message);
                    }
                }
            }
        };

        fetchImage();

        return () => {
            isCancelled = true;
        };
    }, [imageId, prompt, aspectRatio]);
    
    if (error) {
        return <ErrorFallback className={className} />;
    }

    if (!imageUrl) {
        return <ImagePlaceholder className={className} />;
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={`${className} animate-fade-in`}
            style={{ animationDuration: '400ms' }}
            loading="lazy"
            decoding="async"
        />
    );
};

export default GenerativeImage;