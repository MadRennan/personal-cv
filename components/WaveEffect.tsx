import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

const WaveEffect: React.FC = () => {
  const { languageChangeOrigin } = useLanguage();
  const { theme } = useTheme();
  const [wave, setWave] = useState<{ x: number; y: number; id: number } | null>(null);

  useEffect(() => {
    if (languageChangeOrigin) {
      setWave({ ...languageChangeOrigin, id: Date.now() });
    }
  }, [languageChangeOrigin]);

  if (!wave) {
    return null;
  }

  const handleAnimationEnd = () => {
    setWave(null);
  };
  
  const startOpacity = theme === 'light' ? 0.7 : 0.8;

  const waveStyle: React.CSSProperties & { '--wave-start-opacity': number } = {
    top: `${wave.y}px`,
    left: `${wave.x}px`,
    width: '300vmax',
    height: '300vmax',
    transform: 'translate(-50%, -50%) scale(0)',
    // Faster, more impactful animation for language change ripple
    animation: 'wave-ripple 600ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
    willChange: 'transform, opacity',
    '--wave-start-opacity': startOpacity,
  };
  
  const keyframes = `
    @keyframes wave-ripple {
      from {
        transform: translate(-50%, -50%) scale(0);
        opacity: var(--wave-start-opacity);
      }
      to {
        transform: translate(-50%, -50%) scale(1.1); /* Scale slightly larger for a more dynamic feel */
        opacity: 0;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        key={wave.id}
        className="fixed pointer-events-none z-[99] bg-primary-600 dark:bg-primary-400 rounded-full"
        style={waveStyle}
        onAnimationEnd={handleAnimationEnd}
      />
    </>
  );
};

export default WaveEffect;