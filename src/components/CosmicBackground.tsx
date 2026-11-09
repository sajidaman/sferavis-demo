import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup: mix of distant faint stars, glowing near-infrared nodes, and crimson dust specs
    const STAR_COUNT = 85;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
      color: string;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    const colors = [
      'rgba(255, 255, 255, ',
      'rgba(225, 29, 72, ', // Crimson
      'rgba(245, 158, 11, ', // Amber
      'rgba(244, 63, 94, ',  // Ruby
      'rgba(210, 220, 255, ', // Cool Blue
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: (Math.random() * 0.25 + 0.05),
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Interactive mouse tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let tick = 0;

    const render = () => {
      tick++;
      // Smooth lerp for mouse
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const offsetX = (mouseX - width / 2) * 0.03;
      const offsetY = (mouseY - height / 2) * 0.03;

      ctx.clearRect(0, 0, width, height);

      // Draw each star
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Drift upward slowly
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Calculate pulsing brightness
        const pulse = Math.sin(tick * star.pulseSpeed + star.pulseOffset);
        const currentAlpha = Math.max(0.1, Math.min(0.9, star.alpha + pulse * 0.25));

        // Parallax position
        const drawX = star.x - offsetX * star.radius;
        const drawY = star.y - offsetY * star.radius;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${currentAlpha})`;
        ctx.fill();

        // Subtle glowing halo for larger stars
        if (star.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${currentAlpha * 0.15})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40"
      aria-hidden="true"
    />
  );
};
