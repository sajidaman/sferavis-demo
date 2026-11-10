import React, { useEffect, useRef } from 'react';

interface AstroBackgroundProps {
  isDark?: boolean;
}

export const AstroBackground: React.FC<AstroBackgroundProps> = ({ isDark = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const projectionRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Astronomical star catalogue: real-feeling magnitudes, spectral colors, and clusters
    const STAR_COUNT = 140;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      speedY: number;
      color: string;
      twinkleSpeed: number;
      phase: number;
    }> = [];

    // Spectral classes: O/B (cool blue-white), A (pure white), M (infrared red #A30000), K (warm amber)
    const spectralColors = isDark
      ? [
          'rgba(240, 246, 255, ',
          'rgba(255, 255, 255, ',
          'rgba(163, 0, 0, ',
          'rgba(225, 29, 72, ',
          'rgba(251, 191, 36, ',
          'rgba(186, 230, 253, ',
        ]
      : [
          'rgba(30, 41, 59, ',
          'rgba(71, 85, 105, ',
          'rgba(163, 0, 0, ',
          'rgba(100, 116, 139, ',
          'rgba(190, 18, 60, ',
        ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = Math.random() < 0.12 ? Math.random() * 2.0 + 1.2 : Math.random() * 1.1 + 0.35;
      const baseAlpha = isDark ? Math.random() * 0.6 + 0.25 : Math.random() * 0.45 + 0.15;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        alpha: baseAlpha,
        baseAlpha,
        speedY: (Math.random() * 0.14 + 0.02),
        color: spectralColors[Math.floor(Math.random() * spectralColors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.009,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Constellation lines: link nearby anchor stars
    const constellationPairs: Array<[number, number]> = [];
    for (let i = 0; i < 35; i++) {
      for (let j = i + 1; j < 35; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist > 35 && dist < 170 && Math.random() > 0.52) {
          constellationPairs.push([i, j]);
        }
      }
    }

    // Interactive mouse parallax tracking
    let targetX = width / 2;
    let targetY = height / 2;
    let mouseX = targetX;
    let mouseY = targetY;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;
    };
    const handlePointerLeave = () => {
      targetX = width / 2;
      targetY = height / 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    let frame = 0;

    const render = () => {
      frame++;
      mouseX += (targetX - mouseX) * 0.03;
      mouseY += (targetY - mouseY) * 0.03;

      const normalizedX = (mouseX - width / 2) / Math.max(width / 2, 1);
      const normalizedY = (mouseY - height / 2) / Math.max(height / 2, 1);
      const parallaxX = normalizedX * 22;
      const parallaxY = normalizedY * 22;

      // Move the astronomical projection at a slower depth than the stars.
      // Direct style updates avoid React renders on every animation frame.
      if (projectionRef.current) {
        projectionRef.current.style.transform =
          `translate3d(${normalizedX * 12}px, ${normalizedY * 12}px, 0) scale(1.018)`;
      }

      ctx.clearRect(0, 0, width, height);

      // A restrained cursor-following nebula glow gives the background depth
      // without obscuring page content.
      const glowRadius = Math.min(width, height) * 0.34;
      const cursorGlow = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, Math.max(glowRadius, 150)
      );
      cursorGlow.addColorStop(0, isDark ? 'rgba(163, 0, 0, 0.105)' : 'rgba(163, 0, 0, 0.055)');
      cursorGlow.addColorStop(0.42, isDark ? 'rgba(59, 130, 246, 0.035)' : 'rgba(59, 130, 246, 0.018)');
      cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw faint constellation alignment lines
      const lineColor = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(100, 116, 139, 0.18)';
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = lineColor;
      ctx.setLineDash([3, 4]);

      for (const [idxA, idxB] of constellationPairs) {
        const a = stars[idxA];
        const b = stars[idxB];
        if (!a || !b) continue;
        const ax = a.x - parallaxX * 0.6;
        const ay = a.y - parallaxY * 0.6;
        const bx = b.x - parallaxX * 0.6;
        const by = b.y - parallaxY * 0.6;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      ctx.setLineDash([]);

      // Draw celestial stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y -= s.speedY;
        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        // Twinkle modulation
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.phase);
        const currentAlpha = Math.max(0.06, Math.min(0.95, s.baseAlpha + twinkle * 0.28));

        const drawX = s.x - parallaxX * s.radius;
        const drawY = s.y - parallaxY * s.radius;

        // Core star point
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.fill();

        // Starlight glow halo for primary stars
        if (s.radius > 1.25) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.radius * 3.2, 0, Math.PI * 2);
          const haloAlpha = isDark ? currentAlpha * 0.22 : currentAlpha * 0.12;
          ctx.fillStyle = `${s.color}${haloAlpha})`;
          ctx.fill();

          // Delicate diffraction crosshair spikes on brightest stars
          if (s.radius > 1.55) {
            ctx.strokeStyle = `${s.color}${currentAlpha * 0.45})`;
            ctx.lineWidth = 0.7;
            const spike = s.radius * 4.2;
            ctx.beginPath();
            ctx.moveTo(drawX - spike, drawY);
            ctx.lineTo(drawX + spike, drawY);
            ctx.moveTo(drawX, drawY - spike);
            ctx.lineTo(drawX, drawY + spike);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Deep Celestial Coordinate Projection Grid (SVG Astronomical Chart) */}
      <svg
        ref={projectionRef}
        className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40 transition-opacity duration-500 will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.018)' }}
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Infrared Nebular Radial Glows */}
          <radialGradient id="astro-nebula-crimson" cx="22%" cy="28%" r="48%">
            <stop offset="0%" stopColor="#A30000" stopOpacity={isDark ? '0.20' : '0.065'} />
            <stop offset="55%" stopColor="#8B0000" stopOpacity={isDark ? '0.09' : '0.025'} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="astro-nebula-deepsky" cx="80%" cy="32%" r="55%">
            <stop offset="0%" stopColor={isDark ? '#1e3a8a' : '#3b82f6'} stopOpacity={isDark ? '0.22' : '0.05'} />
            <stop offset="60%" stopColor={isDark ? '#312e81' : '#60a5fa'} stopOpacity={isDark ? '0.08' : '0.015'} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="astro-nebula-warm" cx="50%" cy="85%" r="45%">
            <stop offset="0%" stopColor="#b45309" stopOpacity={isDark ? '0.12' : '0.035'} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Infrared Diffuse Cloud Layers */}
        <rect width="100%" height="100%" fill="url(#astro-nebula-crimson)" />
        <rect width="100%" height="100%" fill="url(#astro-nebula-deepsky)" />
        <rect width="100%" height="100%" fill="url(#astro-nebula-warm)" />

        {/* Celestial Great Circles & Coordinate Reticles */}
        <g stroke={isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(100, 116, 139, 0.24)'} strokeWidth="0.85" fill="none">
          {/* Primary Celestial Sphere Orbit Ring */}
          <circle cx="800" cy="500" r="580" strokeDasharray="5 7" />
          <circle cx="800" cy="500" r="420" />
          <circle cx="800" cy="500" r="240" strokeDasharray="3 5" stroke={isDark ? 'rgba(163,0,0,0.35)' : 'rgba(163,0,0,0.25)'} />

          {/* Coordinate ring degree tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 800 + Math.cos(rad) * 412;
            const y1 = 500 + Math.sin(rad) * 412;
            const x2 = 800 + Math.cos(rad) * 428;
            const y2 = 500 + Math.sin(rad) * 428;
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.2" />;
          })}

          {/* Curved Declination Parallels */}
          <ellipse cx="800" cy="500" rx="720" ry="240" />
          <ellipse cx="800" cy="500" rx="660" ry="120" strokeDasharray="6 6" />
          <ellipse cx="800" cy="500" rx="760" ry="360" strokeDasharray="4 6" />

          {/* Right Ascension Meridian Arcs */}
          <ellipse cx="800" cy="500" rx="180" ry="520" />
          <ellipse cx="800" cy="500" rx="360" ry="540" strokeDasharray="4 6" />
          <ellipse cx="800" cy="500" rx="540" ry="560" />

          {/* Ecliptic Plane Inclined Meridian (23.4° tilt) */}
          <line
            x1="100"
            y1="210"
            x2="1500"
            y2="790"
            stroke={isDark ? 'rgba(163, 0, 0, 0.42)' : 'rgba(163, 0, 0, 0.32)'}
            strokeWidth="1.4"
          />

          {/* Celestial Polar Axis */}
          <line x1="800" y1="10" x2="800" y2="990" strokeDasharray="4 6" />
          <line x1="10" y1="500" x2="1590" y2="500" strokeDasharray="4 6" />
        </g>

        {/* Astronomical Reticle Crosshairs & Survey Markings */}
        <g stroke={isDark ? 'rgba(163, 0, 0, 0.65)' : 'rgba(163, 0, 0, 0.5)'} strokeWidth="1" fill="none">
          {/* Center Target Reticle */}
          <circle cx="800" cy="500" r="18" />
          <circle cx="800" cy="500" r="32" strokeDasharray="2 4" />
          <line x1="768" y1="500" x2="832" y2="500" />
          <line x1="800" y1="468" x2="800" y2="532" />

          {/* Northern Survey Field Marker */}
          <circle cx="340" cy="280" r="12" />
          <line x1="322" y1="280" x2="358" y2="280" />
          <line x1="340" y1="262" x2="340" y2="298" />

          {/* Galactic Center Pointing Node */}
          <circle cx="1260" cy="680" r="14" />
          <circle cx="1260" cy="680" r="30" strokeDasharray="2 3" />
          <line x1="1238" y1="680" x2="1282" y2="680" />
          <line x1="1260" y1="658" x2="1260" y2="702" />
        </g>

        {/* Coordinate Annotations (Astronomical Editorial Cartography) */}
        <g
          fontFamily="JetBrains Mono, monospace"
          fontSize="9.5"
          letterSpacing="1.5"
          fill={isDark ? 'rgba(148, 163, 184, 0.65)' : 'rgba(71, 85, 105, 0.75)'}
        >
          <text x="818" y="490">α: 17h 45m 40s · δ: -29° 00' 28"</text>
          <text x="360" y="284">NEP CALIBRATION TILE · QR2</text>
          <text x="1280" y="684">Sgr A* GALACTIC NUCLEUS</text>
          <text x="120" y="230" fill={isDark ? 'rgba(239, 68, 68, 0.85)' : 'rgba(163, 0, 0, 0.85)'}>
            ECLIPTIC EQUATOR ε = 23.4°
          </text>
          <text x="815" y="55">POLARIS / NORTH CELESTIAL POLE (+90°)</text>
          <text x="815" y="960">SOUTH CELESTIAL POLE (-90°)</text>
          <text x="1225" y="415">0° RA · EQUINOX</text>
          <text x="375" y="415">180° RA · AUTUMN</text>
        </g>
      </svg>

      {/* 2. Interactive Twinkling Starfield & Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85 dark:opacity-80"
      />
    </div>
  );
};
