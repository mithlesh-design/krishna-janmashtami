import React, { useEffect, useRef, useState } from 'react';

import { HERO_IMAGES, HERO_IMAGES_MOBILE } from '../constants/heroImages';
export { HERO_IMAGES, HERO_IMAGES_MOBILE };

/**
 * KrishnaMotionScene
 * Displays the 6 images covering the entire hero area with:
 * - Smooth crossfade transitions between all 6 images
 * - Subtle slow zoom/pan motion
 * - Vignette and multi-stop gradient overlays ensuring right-side player legibility
 * - 60FPS dynamic Canvas particle system (golden stardust, floating petals, glowing bokeh)
 * - Mouse parallax effect
 */
export default function KrishnaMotionScene({ activeImageIndex = 0 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Mouse Parallax tracking
  useEffect(() => {
    if (isReducedMotion) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setMousePos((prev) => ({ ...prev, targetX: x, targetY: y }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReducedMotion]);

  // Smooth lerp for mouse parallax
  useEffect(() => {
    if (isReducedMotion) return;

    let animId;
    const lerp = () => {
      setMousePos((prev) => {
        const dx = prev.targetX - prev.x;
        const dy = prev.targetY - prev.y;
        return {
          ...prev,
          x: prev.x + dx * 0.05,
          y: prev.y + dy * 0.05,
        };
      });
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [isReducedMotion]);

  // Canvas Particle System: Golden Stardust & Floating Petals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 35 : 70;
    const petalCount = isMobile ? 14 : 28;
    const bokehCount = isMobile ? 6 : 12;

    let stars = [];
    let petals = [];
    let bokehs = [];

    const initParticles = () => {
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.75 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.45 - 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }));

      petals = Array.from({ length: petalCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 0.65 + 0.35,
        speedX: Math.random() * 0.3 - 0.15,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.016,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.02 + 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.4 ? 'lotus' : Math.random() > 0.5 ? 'marigold' : 'gold',
      }));

      bokehs = Array.from({ length: bokehCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 65 + 30,
        alpha: Math.random() * 0.14 + 0.05,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        color: Math.random() > 0.45 ? '#F4B942' : '#E879A9',
      }));
    };

    initParticles();

    let lastTime = performance.now();
    const render = (time) => {
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      // A. Bokeh lights
      bokehs.forEach((b) => {
        b.x += b.speedX;
        b.y += b.speedY;
        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = height + b.radius;
        if (b.y > height + b.radius) b.y = -b.radius;

        const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        radGrad.addColorStop(0, b.color === '#F4B942' ? 'rgba(244, 185, 66, 0.2)' : 'rgba(232, 121, 169, 0.16)');
        radGrad.addColorStop(1, 'rgba(7, 24, 46, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // B. Golden Stardust
      stars.forEach((s) => {
        s.phase += s.pulseSpeed;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
        s.y += s.speedY;
        s.x += s.speedX;

        if (s.y < -5) {
          s.y = height + 5;
          s.x = Math.random() * width;
        }
        if (s.x < -5) s.x = width + 5;
        if (s.x > width + 5) s.x = -5;

        ctx.fillStyle = `rgba(253, 230, 138, ${currentAlpha})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#F4B942';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // C. Floating Petals
      petals.forEach((p) => {
        p.swayPhase += 0.015;
        p.angle += p.angularSpeed;
        p.flip += p.flipSpeed;

        p.y += p.speedY;
        p.x += Math.sin(p.swayPhase) * 0.75 + p.speedX;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(1, Math.sin(p.flip));

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.6, -p.size * 0.5, 0, -p.size);

        const petalGrad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        if (p.colorType === 'lotus') {
          petalGrad.addColorStop(0, 'rgba(251, 207, 232, 0.9)');
          petalGrad.addColorStop(0.6, 'rgba(232, 121, 169, 0.75)');
          petalGrad.addColorStop(1, 'rgba(185, 74, 122, 0.45)');
        } else if (p.colorType === 'marigold') {
          petalGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          petalGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.8)');
          petalGrad.addColorStop(1, 'rgba(194, 65, 12, 0.45)');
        } else {
          petalGrad.addColorStop(0, 'rgba(255, 245, 223, 0.9)');
          petalGrad.addColorStop(0.7, 'rgba(244, 185, 66, 0.7)');
          petalGrad.addColorStop(1, 'rgba(184, 134, 11, 0.45)');
        }

        ctx.fillStyle = petalGrad;
        ctx.fill();
        ctx.restore();
      });

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Base */}
      <div className="absolute inset-0 bg-[#07182E]" />

      {/* 2A. Mobile Background Coverage with Vertical 9:16 Artworks */}
      <div className="block lg:hidden absolute inset-0 w-full h-full">
        {HERO_IMAGES_MOBILE.map((img, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <div
              key={img.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.02]"
              />
            </div>
          );
        })}

        {/* Subtle, minimal vignettes on mobile to keep Krishna image as the clear main focus */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#07182E]/60 via-[#07182E]/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07182E]/70 to-transparent pointer-events-none" />
      </div>

      {/* 2B. Complete Desktop Hero Coverage with the 6 Images & Smooth Crossfade */}
      <div
        className="hidden lg:block absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: `scale(1.02) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
        }}
      >
        {HERO_IMAGES.map((img, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <div
              key={img.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04]"
              />
            </div>
          );
        })}

        {/* 3. Cinematic Vignettes & Gradients for UI clarity */}
        {/* Top bar header protection */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#07182E]/80 to-transparent pointer-events-none" />

        {/* Right Side gentle atmospheric backdrop for the liquid glass panel */}
        <div className="absolute top-0 bottom-0 right-0 w-full md:w-3/5 bg-gradient-to-l from-[#07182E]/80 via-[#07182E]/40 to-transparent pointer-events-none" />

        {/* Bottom subtle edge feather */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07182E]/80 to-transparent pointer-events-none" />

        {/* Center gentle ambient warm spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 35% 50%, transparent 40%, rgba(7, 24, 46, 0.4) 75%, rgba(7, 24, 46, 0.8) 100%)',
          }}
        />
      </div>

      {/* 4. Divine Golden Aura Pulse (Desktop only) */}
      <div
        className="hidden lg:block absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none animate-divine-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(244, 185, 66, 0.22) 0%, rgba(232, 121, 169, 0.06) 45%, transparent 70%)',
        }}
      />

      {/* 5. Live Canvas for Falling Petals and Stardust */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
}
