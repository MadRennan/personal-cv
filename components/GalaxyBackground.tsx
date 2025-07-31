import React, { useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, isTransitioning } = useTheme();
  const mouse = useRef({ x: -1000, y: -1000 });

  const dotsRef = useRef<any[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseRadius = 1.2;
    const maxRadius = 3.5;
    const interactionRadius = 150;
    const animationSpeed = 0.00015;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dotsRef.current = [];
      const numDots = Math.floor((window.innerWidth * window.innerHeight) / 900);
      for (let i = 0; i < numDots; i++) {
        const ox = Math.random() * window.innerWidth;
        const oy = Math.random() * window.innerHeight;
        dotsRef.current.push({
          x: ox,
          y: oy,
          ox: ox,
          oy: oy,
          targetRadius: baseRadius,
          currentRadius: baseRadius,
          animOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };
    
    // Update dot properties (expensive part)
    const updateDots = (time: number) => {
       dotsRef.current.forEach(dot => {
        const dxMouse = mouse.current.x - dot.ox;
        const dyMouse = mouse.current.y - dot.oy;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        let scale = 0;
        if (distMouse < interactionRadius) {
          scale = 1 - distMouse / interactionRadius;
        }
        dot.targetRadius = baseRadius + (maxRadius - baseRadius) * Math.pow(scale, 2);
        dot.currentRadius += (dot.targetRadius - dot.currentRadius) * 0.1;

        const waveX = Math.sin(time * animationSpeed + dot.animOffset) * 5;
        const waveY = Math.cos(time * animationSpeed + dot.animOffset) * 5;

        dot.x = dot.ox + waveX;
        dot.y = dot.oy + waveY;
      });
    }

    // Draw frame (cheap part)
    const drawFrame = () => {
      const lightBg = '#fafafa'; // neutral-50
      const darkBg = '#09090b';   // neutral-950
      const lightDotColor = 'rgba(8, 145, 178, 0.6)'; // primary-600
      const darkDotColor = 'rgba(103, 232, 249, 0.5)'; // primary-300

      ctx.fillStyle = theme === 'dark' ? darkBg : lightBg;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.fillStyle = theme === 'dark' ? darkDotColor : lightDotColor;

      dotsRef.current.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const animate = (time: number) => {
      // Only run expensive calculations when not transitioning
      if (!isTransitioning) {
        updateDots(time);
      }
      // Always draw the canvas to prevent it from being blank
      drawFrame();
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    if (dotsRef.current.length === 0) {
      resizeCanvas();
    }

    animationFrameId.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme, isTransitioning]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default GalaxyBackground;