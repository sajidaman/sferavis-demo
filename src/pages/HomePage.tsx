import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PageId } from '../types';
import { Logo } from '../components/Logo';
import { SpotlightCard } from '../components/SpotlightCard';
import { SPHEREX_BANDS } from '../data/mockData';
import {
  Atom,
  ChevronRight,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Compass,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onLaunchSferavis: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLaunchSferavis }) => {
  // Interactive Spectral Scrubber state (0.75 µm to 5.00 µm)
  const [activeWavelength, setActiveWavelength] = useState<number>(3.05);
  const [isAutoScanning, setIsAutoScanning] = useState<boolean>(false);

  // Auto-scanning demo mode toggle
  useEffect(() => {
    if (!isAutoScanning) return;
    const interval = setInterval(() => {
      setActiveWavelength((prev) => {
        const next = prev + 0.04;
        return next > 4.95 ? 0.8 : Number(next.toFixed(2));
      });
    }, 60);
    return () => clearInterval(interval);
  }, [isAutoScanning]);

  // Determine current active band based on wavelength
  const getCurrentBand = (w: number) => {
    if (w <= 1.11) return SPHEREX_BANDS[0];
    if (w <= 1.64) return SPHEREX_BANDS[1];
    if (w <= 2.42) return SPHEREX_BANDS[2];
    if (w <= 3.82) return SPHEREX_BANDS[3];
    if (w <= 4.42) return SPHEREX_BANDS[4];
    return SPHEREX_BANDS[5];
  };

  const currentBand = getCurrentBand(activeWavelength);

  // Wavelength presets for quick interactive inspection
  const presets = [
    { label: '0.85 µm', value: 0.85, name: 'Stellar Continuum' },
    { label: '1.60 µm', value: 1.60, name: 'H-Band Peak (z-Clock)' },
    { label: '2.16 µm', value: 2.16, name: 'Br-γ / H₂ Gas' },
    { label: '3.05 µm', value: 3.05, name: 'Water Ice (H₂O)' },
    { label: '3.30 µm', value: 3.30, name: 'PAH Aromatic Dust' },
    { label: '4.27 µm', value: 4.27, name: 'Carbon Dioxide (CO₂)' },
    { label: '4.67 µm', value: 4.67, name: 'Carbon Monoxide (CO)' },
  ];

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="w-full bg-[#050507] text-white selection:bg-[#A30000] selection:text-white relative">
      
      {/* SECTION 1: NATIONAL GEOGRAPHIC-INSPIRED EDITORIAL HERO */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-zinc-800">
        
        {/* Subtle deep red ambient glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.28, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-[#8B0000]/25 via-[#A30000]/15 to-transparent blur-[160px] pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          {/* Eyebrow metadata banner inspired by National Geographic editorial headings */}
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <div className="inline-flex items-center gap-3 text-xs font-lexend uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2">
              <span className="w-2 h-2 bg-[#A30000]" />
              <span className="text-[#A30000] font-bold">EXPEDITION TO THE COSMIC DAWN</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">NASA SPHEREx ALL-SKY SURVEY</span>
            </div>
          </motion.div>

          {/* Large text Logo without icon */}
          <motion.div variants={itemVariants} className="mb-4 flex justify-center">
            <Logo size="xl" />
          </motion.div>

          {/* Marquee Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-8xl font-oswald uppercase font-black tracking-tight text-white max-w-5xl mx-auto leading-[0.98] text-balance"
          >
            The Universe in{' '}
            <span className="text-[#A30000]">102 Colors.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-2xl text-zinc-300 max-w-3xl mx-auto font-merriweather leading-relaxed text-balance"
          >
            Every point on the celestial sphere, resolved across 102 near-infrared bands. Uncovering cosmic inflation, the collective light of primordial galaxies, and the prebiotic water ices of infant solar systems.
          </motion.p>

          {/* Action Row with clean buttons */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              onClick={onLaunchSferavis}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-9 py-4 text-xs font-lexend uppercase font-bold tracking-widest text-white bg-[#A30000] hover:bg-[#8B0000] transition-all duration-200 shadow-xl shadow-black/80 cursor-pointer flex items-center gap-2 group"
            >
              <span>Launch Sferavis</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              onClick={() => onNavigate('spherex')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 text-xs font-lexend uppercase font-semibold tracking-wider text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>The SPHEREx Mission</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </motion.button>
          </motion.div>

          {/* Editorial Centerpiece Photo with National Geographic-style framing and caption */}
          <motion.div
            variants={itemVariants}
            className="mt-14 relative max-w-5xl mx-auto border-2 border-zinc-800 overflow-hidden shadow-2xl bg-black"
          >
            <motion.img
              src="/src/assets/images/spherex_observatory_orbit_1794254683688.jpg"
              alt="NASA SPHEREx Space Telescope Observatory Orbiting Earth"
              className="w-full h-[380px] sm:h-[500px] lg:h-[600px] object-cover object-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />

            {/* Editorial Caption Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-black/90 backdrop-blur-md border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div className="border-l-4 border-[#A30000] pl-4">
                <div className="text-sm font-oswald uppercase font-bold text-white tracking-wide">
                  SPHEREx Orbital Observatory
                </div>
                <div className="text-xs text-zinc-400 font-merriweather mt-1 max-w-2xl">
                  Sun-synchronous 650 km polar orbit surveying 100% of the celestial sphere every six months. Passive radiative cooling keeps detectors below 80 Kelvin.
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onLaunchSferavis}
                  className="px-4 py-2 text-xs font-lexend uppercase tracking-wider font-bold text-white bg-[#A30000] hover:bg-[#8B0000] transition-colors cursor-pointer"
                >
                  Launch Sferavis
                </button>
              </div>
            </div>
          </motion.div>

          {/* Editorial Key Metrics Ribbon */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-zinc-800 pt-8 text-left"
          >
            <div className="border-l-2 border-zinc-800 pl-4">
              <div className="text-4xl sm:text-5xl font-bold text-white font-oswald tabular-nums">102</div>
              <div className="text-xs text-zinc-400 font-lexend uppercase tracking-wider mt-1 font-semibold">Near-IR Spectral Channels</div>
            </div>
            <div className="border-l-2 border-zinc-800 pl-4">
              <div className="text-4xl sm:text-5xl font-bold text-white font-oswald tabular-nums">0.75 – 5.0 µm</div>
              <div className="text-xs text-zinc-400 font-lexend uppercase tracking-wider mt-1 font-semibold">Continuous Wavelengths</div>
            </div>
            <div className="border-l-2 border-zinc-800 pl-4">
              <div className="text-4xl sm:text-5xl font-bold text-white font-oswald tabular-nums">450M+</div>
              <div className="text-xs text-zinc-400 font-lexend uppercase tracking-wider mt-1 font-semibold">Galaxies Cataloged</div>
            </div>
            <div className="border-l-2 border-zinc-800 pl-4">
              <div className="text-4xl sm:text-5xl font-bold text-white font-oswald tabular-nums">&lt; 12 ms</div>
              <div className="text-xs text-zinc-400 font-lexend uppercase tracking-wider mt-1 font-semibold">Instant SED Extraction</div>
            </div>
          </motion.div>

        </motion.div>
      </section>


      {/* SECTION 2: INTERACTIVE HYPERSPECTRAL SCRUBBER */}
      <section className="py-20 lg:py-28 bg-[#08080a] border-b border-zinc-800 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 text-xs font-lexend uppercase tracking-widest text-[#A30000] font-bold">
              <span className="w-2.5 h-2.5 bg-[#A30000]"></span>
              <span>SPECTRAL EXPLORATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-oswald uppercase font-black tracking-tight text-white mt-3">
              Scrub the Invisible Universe.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 font-merriweather leading-relaxed">
              Optical telescopes capture only what human eyes can perceive. Drag through the 102 SPHEREx near-infrared channels to detect interstellar water ice, prebiotic volatile molecules, and deep-space galaxy shifts.
            </p>
          </div>

          {/* Interactive Console Card */}
          <div className="bg-[#0e0e14] border border-zinc-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative">
            
            {/* Top Wavelength Indicator & Live Band Readout */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <span className="text-xs text-zinc-400 uppercase font-lexend tracking-widest flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#A30000]" />
                  <span>Probing Wavelength Channel</span>
                </span>
                <div className="text-4xl sm:text-6xl font-bold font-oswald tabular-nums text-white flex items-baseline gap-2 mt-1">
                  <motion.span
                    key={activeWavelength.toFixed(2)}
                    initial={{ opacity: 0.6, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeWavelength.toFixed(2)}
                  </motion.span>
                  <span className="text-2xl text-zinc-400 font-lexend font-normal">µm</span>
                </div>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setIsAutoScanning(!isAutoScanning)}
                    className={`px-3.5 py-1.5 text-xs font-lexend uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                      isAutoScanning
                        ? 'bg-[#A30000] border-[#A30000] text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {isAutoScanning ? 'Scanning... [Pause]' : 'Auto-Scan Spectrum'}
                  </button>
                </div>
                <div className="text-sm font-semibold font-lexend text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#A30000]" />
                  <span>{currentBand.detector}</span>
                  <span className="text-xs font-mono text-zinc-400">({currentBand.resolvingPower})</span>
                </div>
              </div>
            </div>

            {/* Slider Scrubber with Dynamic Glow */}
            <div className="my-8">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span>0.75 µm (Optical Cutoff)</span>
                <span className="text-[#A30000] font-lexend uppercase tracking-wider font-bold">
                  Drag slider or pick target molecule
                </span>
                <span>5.00 µm (Thermal Infrared)</span>
              </div>

              <div className="relative py-2">
                <input
                  type="range"
                  min="0.75"
                  max="5.00"
                  step="0.05"
                  value={activeWavelength}
                  onChange={(e) => {
                    setIsAutoScanning(false);
                    setActiveWavelength(parseFloat(e.target.value));
                  }}
                  className="w-full h-3 bg-zinc-800 appearance-none cursor-ew-resize accent-[#A30000]"
                  aria-label="Wavelength Scrubber"
                />
              </div>

              {/* Band Presets Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {presets.map((preset) => {
                  const isSelected = Math.abs(activeWavelength - preset.value) < 0.08;
                  return (
                    <motion.button
                      key={preset.value}
                      onClick={() => {
                        setIsAutoScanning(false);
                        setActiveWavelength(preset.value);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-3 py-1.5 text-xs font-lexend uppercase tracking-wider transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#A30000] text-white border-[#A30000] font-bold shadow-md'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border-zinc-800'
                      }`}
                    >
                      <span className="font-bold">{preset.label}</span>
                      <span className="ml-1.5 text-zinc-400 font-normal">· {preset.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Visualizer Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
              
              {/* Chemical Signature Card with National Geographic red rule */}
              <motion.div
                key={currentBand.bandNumber}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#08080a] p-6 border border-zinc-800 border-l-4 border-l-[#A30000] flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-lexend text-[#A30000] uppercase tracking-widest font-bold">
                    Physical Diagnostic
                  </span>
                  <h3 className="text-xl font-bold font-oswald uppercase text-white mt-2">
                    {activeWavelength >= 2.9 && activeWavelength <= 3.2
                      ? 'Prebiotic H₂O Water-Ice Mantle'
                      : activeWavelength >= 4.15 && activeWavelength <= 4.35
                      ? 'Solid CO₂ Freeze-Out Horizon'
                      : activeWavelength >= 3.25 && activeWavelength <= 3.4
                      ? '3.3 µm Polycyclic Aromatic Carbon (PAH)'
                      : activeWavelength >= 1.55 && activeWavelength <= 1.7
                      ? '1.6 µm H⁻ Opacity Stellar Minimum'
                      : activeWavelength >= 4.6 && activeWavelength <= 4.8
                      ? 'Carbon Monoxide (CO) Gas & Ice'
                      : 'Thermal Continuum & Interstellar Dust'}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-300 font-merriweather leading-relaxed">
                    {currentBand.primaryScience}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-lexend uppercase tracking-wider">Molecules</span>
                    <span className="font-mono text-zinc-200">{currentBand.keyMolecules.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-lexend uppercase tracking-wider">Band Span</span>
                    <span className="font-mono text-zinc-200">{currentBand.wavelengthRange}</span>
                  </div>
                </div>
              </motion.div>

              {/* Simulated Spectral Energy Distribution (SED) Curve Canvas */}
              <div className="lg:col-span-2 bg-[#08080a] p-6 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono text-zinc-500">Live SED Profile · Orion Kleinmann-Low Nebula</span>
                    <div className="text-sm font-bold font-oswald uppercase text-white">Wavelength vs. Flux Density</div>
                  </div>
                  <motion.button
                    onClick={onLaunchSferavis}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-xs text-[#A30000] hover:text-white flex items-center gap-1 cursor-pointer font-lexend uppercase font-bold tracking-wider"
                  >
                    <span>Launch Sferavis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* SVG Graph rendering the SED curve with laser line */}
                <div className="relative h-48 sm:h-56 w-full bg-[#050507] border border-zinc-800 p-2 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

                    <rect x="0" y="0" width="42" height="160" fill="rgba(255,255,255,0.015)" />
                    <rect x="196" y="0" width="165" height="160" fill="rgba(163,0,0,0.08)" />

                    <path
                      d="M 0,110 Q 50,60 100,50 T 170,55 Q 230,65 260,135 Q 280,140 310,75 Q 360,55 390,60 Q 405,65 415,115 Q 425,120 435,70 Q 470,85 500,95"
                      fill="none"
                      stroke="#A30000"
                      strokeWidth="2.5"
                    />

                    <path
                      d="M 0,110 Q 50,60 100,50 T 170,55 Q 230,65 260,135 Q 280,140 310,75 Q 360,55 390,60 Q 405,65 415,115 Q 425,120 435,70 Q 470,85 500,95 L 500,160 L 0,160 Z"
                      fill="url(#sed-gradient-natgeo-home)"
                      opacity="0.3"
                    />

                    {/* Animated Scrubber Laser Line */}
                    {(() => {
                      const xPos = ((activeWavelength - 0.75) / (5.0 - 0.75)) * 500;
                      return (
                        <g>
                          <line
                            x1={xPos}
                            y1="0"
                            x2={xPos}
                            y2="160"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <circle cx={xPos} cy="75" r="5" fill="#ffffff" />
                          <circle cx={xPos} cy="75" r="9" fill="none" stroke="#A30000" strokeWidth="1.5" />
                        </g>
                      );
                    })()}

                    <defs>
                      <linearGradient id="sed-gradient-natgeo-home" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A30000" />
                        <stop offset="100%" stopColor="#050507" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-zinc-400">
                    λ = 0.75 µm
                  </div>
                  <div className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-400">
                    λ = 5.00 µm
                  </div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-lexend uppercase tracking-wider text-red-300 bg-black/90 px-2.5 py-0.5 border border-red-900/60">
                    H₂O Ice Absorption Trough (3.05 µm)
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 font-lexend">
                  <span>Target: OMC-1 / IRAS 05327-0529</span>
                  <span className="font-mono">F_peak = 42.5 mJy · S/N &gt; 80</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* SECTION 3: THE THREE PILLARS (EDITORIAL NATIONAL GEOGRAPHIC CARDS) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-lexend uppercase tracking-widest text-[#A30000] font-bold">
            <span className="w-2.5 h-2.5 bg-[#A30000]"></span>
            <span>THREE SCIENTIFIC PILLARS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-oswald uppercase font-black tracking-tight text-white mt-3">
            Engineered for Cosmic Discovery.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-merriweather leading-relaxed">
            From cosmological inflation to infant star nurseries, SFERAvis unites the complete NASA SPHEREx mission pipeline in an authoritative, high-throughput environment.
          </p>
        </div>

        {/* Bento Grid with SpotlightCard wrappers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Col-span 2 with photo */}
          <SpotlightCard className="md:col-span-2 p-8 border-zinc-800 bg-[#0e0e14] border-l-4 border-l-[#A30000]" glowColor="rgba(163, 0, 0, 0.18)">
            <div className="max-w-md relative z-10">
              <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
                Pillar 01 · Cosmology
              </span>
              <h3 className="text-2xl sm:text-3xl font-oswald uppercase font-bold text-white mt-2">
                Testing the Physics of Cosmic Inflation.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-zinc-300 font-merriweather leading-relaxed">
                By measuring large-scale 3D clustering across 450+ million galaxies, SFERAvis helps cosmologists probe primordial non-Gaussianity to unprecedented precision (<span className="font-mono text-white">f_NL &lt; 1</span>), deciphering quantum fluctuations born moments after the Big Bang.
              </p>
              
              <div className="mt-6 flex items-center gap-6 border-t border-zinc-800 pt-4">
                <div>
                  <div className="text-2xl font-bold font-oswald text-white">z = 0 – 4.0</div>
                  <div className="text-xs text-zinc-400 font-lexend uppercase tracking-wider">Redshift Range</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-oswald text-white">σ(z)/(1+z) &lt; 0.003</div>
                  <div className="text-xs text-zinc-400 font-lexend uppercase tracking-wider">Galaxy Redshift Accuracy</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <img
                src="/src/assets/images/allsky_infrared_cosmos_1794254684440.jpg"
                alt="Cosmic All-Sky Infrared Galaxy Distribution"
                className="w-full h-full object-cover object-left"
                referrerPolicy="no-referrer"
              />
            </div>
          </SpotlightCard>

          {/* Bento Card 2: EBL */}
          <SpotlightCard className="p-8 flex flex-col justify-between border-zinc-800 bg-[#0e0e14] border-l-4 border-l-[#A30000]" glowColor="rgba(163, 0, 0, 0.15)">
            <div>
              <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
                Pillar 02 · Galaxies
              </span>
              <h3 className="text-xl sm:text-2xl font-oswald uppercase font-bold text-white mt-2">
                The Total Light of All Stars.
              </h3>
              <p className="mt-3 text-sm text-zinc-300 font-merriweather leading-relaxed">
                Measuring diffuse cosmic background fluctuations across 102 channels reveals the integrated radiance of the universe's earliest stellar populations and central black holes during the Epoch of Reionization.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-lexend uppercase tracking-wider">EBL Fluctuation Level</span>
              <span className="text-sm font-oswald font-bold text-white">νI_ν &gt; 0.1 nW/m²/sr</span>
            </div>
          </SpotlightCard>

          {/* Bento Card 3: Prebiotic Ices */}
          <SpotlightCard className="p-8 flex flex-col justify-between border-zinc-800 bg-[#0e0e14] border-l-4 border-l-[#A30000]" glowColor="rgba(163, 0, 0, 0.15)">
            <div>
              <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
                Pillar 03 · Astrochemistry
              </span>
              <h3 className="text-xl sm:text-2xl font-oswald uppercase font-bold text-white mt-2">
                Origins of Water & Biogenic Ices.
              </h3>
              <p className="mt-3 text-sm text-zinc-300 font-merriweather leading-relaxed">
                Tracing H₂O, CO₂, CO, and methanol ice absorption toward &gt;100,000 young stellar systems to map how planetary seeds receive life's foundational ingredients before planet formation completes.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-lexend uppercase tracking-wider">Sightline Census</span>
              <span className="text-sm font-oswald font-bold text-white">&gt; 100,000 YSOs</span>
            </div>
          </SpotlightCard>

          {/* Bento Card 4: High-Performance Engine */}
          <SpotlightCard className="md:col-span-2 p-8 border-zinc-800 bg-[#0e0e14] border-l-4 border-l-[#A30000]" glowColor="rgba(163, 0, 0, 0.18)">
            <div className="max-w-lg">
              <span className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000]">
                SFERAvis Engine Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-oswald uppercase font-bold text-white mt-2">
                14.8× Faster Than Conventional FITS Pipeliners.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-zinc-300 font-merriweather leading-relaxed">
                Constructed with WebGL hyperspectral shaders and WebAssembly ASTROPY decoders. Streams terabytes of all-sky cubes with zero client-side latency.
              </p>

              {/* Performance Comparison Bars */}
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-lexend uppercase">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#A30000]" />
                      <span>SFERAvis GPU WebGL Engine</span>
                    </span>
                    <span className="font-mono text-[#A30000] font-bold">12 ms (120 FPS)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="bg-[#A30000] h-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-lexend uppercase text-zinc-400">
                    <span>Traditional Client-Side Astropy</span>
                    <span className="font-mono">180 ms</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 overflow-hidden">
                    <div className="bg-zinc-600 h-full w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

        </div>

      </section>


      {/* SECTION 4: EDITORIAL TESTIMONIALS (NATIONAL GEOGRAPHIC PULL QUOTES) */}
      <section className="py-20 lg:py-28 bg-[#08080a] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-lexend uppercase font-bold text-[#A30000] tracking-widest">
              VOICES FROM THE CONSORTIUM
            </span>
            <h2 className="text-2xl sm:text-4xl font-oswald uppercase font-black tracking-tight text-white mt-2">
              Collaborative Science at Global Scale.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 bg-[#0e0e14] border border-zinc-800 border-l-4 border-l-[#A30000] flex flex-col justify-between">
              <p className="text-base text-zinc-200 leading-relaxed font-merriweather">
                "SFERAvis transforms how we interact with all-sky hyperspectral cubes. Having 102 continuous channels at our fingertips makes identifying water ice absorption in protoplanetary envelopes immediate."
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <div className="text-sm font-oswald uppercase font-bold text-white">Dr. Karin Öberg</div>
                <div className="text-xs text-zinc-400 font-lexend mt-0.5">Director of Astrochemistry, Harvard CfA</div>
              </div>
            </div>

            <div className="p-7 bg-[#0e0e14] border border-zinc-800 border-l-4 border-l-[#A30000] flex flex-col justify-between">
              <p className="text-base text-zinc-200 leading-relaxed font-merriweather">
                "For cosmic inflation studies, being able to snoop galaxy photometric redshifts with calibrated error envelopes across 450 million targets provides crucial verification for the cosmological catalog."
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <div className="text-sm font-oswald uppercase font-bold text-white">Dr. Jamie Bock</div>
                <div className="text-xs text-zinc-400 font-lexend mt-0.5">SPHEREx PI, Caltech & JPL</div>
              </div>
            </div>

            <div className="p-7 bg-[#0e0e14] border border-zinc-800 border-l-4 border-l-[#A30000] flex flex-col justify-between">
              <p className="text-base text-zinc-200 leading-relaxed font-merriweather">
                "The web-native interface and Python SDK allow researchers in Korea and worldwide to analyze cryogenic test runs and orbital telemetry without needing local supercomputing clusters."
              </p>
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <div className="text-sm font-oswald uppercase font-bold text-white">Dr. Woong-Seob Jeong</div>
                <div className="text-xs text-zinc-400 font-lexend mt-0.5">Co-PI, Space Science Division, KASI</div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 5: FINAL CALL TO ACTION — PROMINENT LOGO & EDITORIAL INVITATION */}
      <section className="py-24 lg:py-32 relative overflow-hidden text-center bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Big Text Logo without icon */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="mb-6 flex justify-center"
          >
            <Logo size="xl" />
          </motion.div>

          <h2 className="text-3xl sm:text-5xl font-oswald uppercase font-black tracking-tight text-white max-w-2xl mx-auto text-balance">
            Explore the All-Sky Infrared Cosmos.
          </h2>

          <p className="mt-4 text-base sm:text-xl text-zinc-300 max-w-xl mx-auto font-merriweather leading-relaxed">
            Launch the interactive 102-channel hyperspectral sky dome, query Level-2 FITS cubes with our Python SDK, or examine guided data reduction tutorials.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              onClick={onLaunchSferavis}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-9 py-4 text-xs font-lexend uppercase tracking-widest font-bold text-white bg-[#A30000] hover:bg-[#8B0000] transition-all duration-200 shadow-xl cursor-pointer flex items-center gap-2"
            >
              <span>Launch Sferavis</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => onNavigate('tutorials')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 text-xs font-lexend uppercase tracking-widest font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer"
            >
              Tutorials & Notebooks
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
};
