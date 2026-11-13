import React, { useRef, useState } from 'react';
import spherexObservatoryImage from '../assets/images/spherex_observatory_orbit_1794254683688.jpg';
import { motion } from 'motion/react';
import { PageId, SpectralBand } from '../types';
import { SPHEREX_BANDS } from '../data/mockData';
import { ArrowRight, Orbit, Compass, Layers, ShieldCheck, RotateCcw, RotateCw } from 'lucide-react';

interface SpherexPageProps {
  onNavigate: (page: PageId) => void;
  onLaunchSferavis?: () => void;
}

const CustomSpherexModel: React.FC = () => {
  const [orientation, setOrientation] = useState({ x: -18, y: -28 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; rotateX: number; rotateY: number } | null>(null);

  const rotateBy = (amount: number) => {
    setOrientation((current) => ({ ...current, y: current.y + amount }));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      rotateX: orientation.x,
      rotateY: orientation.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    setOrientation({
      x: Math.max(-48, Math.min(32, dragStart.current.rotateX - deltaY * 0.35)),
      y: dragStart.current.rotateY + deltaX * 0.55,
    });
  };

  const stopDragging = () => {
    dragStart.current = null;
    setIsDragging(false);
  };

  const resetOrientation = () => setOrientation({ x: -18, y: -28 });
  return (
    <section className="mx-auto mt-14 max-w-5xl" aria-labelledby="custom-spherex-model-title">
      <div className="mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a30000]">Sferavis 3D concept</p>
        <h2 id="custom-spherex-model-title" className="mt-2 text-xl font-oswald font-bold uppercase tracking-wide text-slate-950 dark:text-white sm:text-2xl">
          SPHEREx — Interactive Spacecraft Model
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 dark:text-zinc-400 sm:text-sm">
          Explore an illustrative concept of the observatory’s telescope, sunshield and solar arrays. Drag to rotate.
        </p>
      </div>
      <div className="relative isolate flex min-h-[390px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#07101d] px-3 py-12 shadow-[0_30px_90px_rgba(2,8,18,.45)] sm:min-h-[500px] sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 28%, rgba(255,255,255,.9) 0 1px, transparent 1.5px), radial-gradient(circle at 78% 17%, rgba(180,215,255,.8) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 72%, rgba(255,255,255,.7) 0 1px, transparent 1.5px), radial-gradient(circle at 31% 78%, rgba(160,198,235,.7) 0 1px, transparent 1.5px), radial-gradient(ellipse at 50% 48%, rgba(42,91,138,.32), transparent 58%)',
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[min(78vw,38rem)] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border border-sky-200/10 sm:h-72" />
        <div
          className="relative z-10 h-[260px] w-[min(92vw,650px)] touch-none select-none sm:h-[330px]"
          style={{ perspective: '1100px', cursor: isDragging ? 'grabbing' : 'grab' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onLostPointerCapture={stopDragging}
          role="img"
          aria-label="Interactive illustrative 3D concept of the SPHEREx spacecraft. Drag to rotate the model."
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${orientation.x}deg) rotateY(${orientation.y}deg)`,
              transition: isDragging ? 'none' : 'transform 450ms cubic-bezier(.2,.7,.25,1)',
            }}
          >
            <div className="absolute left-[2%] top-[39%] h-[78px] w-[31%] -skew-y-2 border border-sky-100/70 bg-gradient-to-br from-slate-300 via-slate-100 to-slate-500 p-[5px] shadow-[0_0_24px_rgba(93,174,238,.18)] sm:h-[94px]">
              <div className="grid h-full grid-cols-6 gap-[2px] border border-slate-500/60 bg-slate-600 p-[2px]">
                {Array.from({ length: 24 }, (_, i) => <span key={i} className="border border-sky-200/40 bg-gradient-to-br from-[#28628b] via-[#123756] to-[#071b30]" />)}
              </div>
              <div className="absolute -right-5 top-1/2 h-1.5 w-5 -translate-y-1/2 bg-gradient-to-r from-zinc-500 to-zinc-200" />
            </div>
            <div className="absolute right-[2%] top-[39%] h-[78px] w-[31%] skew-y-2 border border-sky-100/70 bg-gradient-to-bl from-slate-300 via-slate-100 to-slate-500 p-[5px] shadow-[0_0_24px_rgba(93,174,238,.18)] sm:h-[94px]">
              <div className="grid h-full grid-cols-6 gap-[2px] border border-slate-500/60 bg-slate-600 p-[2px]">
                {Array.from({ length: 24 }, (_, i) => <span key={i} className="border border-sky-200/40 bg-gradient-to-br from-[#28628b] via-[#123756] to-[#071b30]" />)}
              </div>
              <div className="absolute -left-5 top-1/2 h-1.5 w-5 -translate-y-1/2 bg-gradient-to-l from-zinc-500 to-zinc-200" />
            </div>

            <div className="absolute left-1/2 top-[18%] h-[68%] w-[27%] -translate-x-1/2" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 border border-[#f1e4c2]/70 bg-gradient-to-b from-[#efe5ca]/70 via-[#9b927f]/55 to-[#273444]/80 shadow-[0_10px_30px_rgba(0,0,0,.45)]" style={{ clipPath: 'polygon(32% 0,68% 0,100% 100%,0 100%)', transform: 'translateZ(-20px)' }} />
              <div className="absolute inset-x-[12%] top-[8%] h-[90%] border-x-[3px] border-t-[3px] border-[#e7d6ae]/80 bg-gradient-to-b from-[#d6c7a6]/70 via-[#706c62]/70 to-[#182638]/85" style={{ clipPath: 'polygon(32% 0,68% 0,100% 100%,0 100%)', transform: 'translateZ(-4px)' }} />
              <div className="absolute inset-x-[24%] top-[17%] h-[80%] border-x-2 border-t-2 border-[#f2e7ca]/80 bg-gradient-to-b from-[#f2e7ca]/70 via-[#9c927b]/75 to-[#26384a]/90" style={{ clipPath: 'polygon(32% 0,68% 0,100% 100%,0 100%)', transform: 'translateZ(12px)' }} />
              <div className="absolute left-1/2 top-[25%] h-[55%] w-[2px] -translate-x-1/2 bg-[#eadbb9]/80" style={{ transform: 'translateX(-50%) translateZ(14px)' }} />
            </div>

            <div className="absolute left-1/2 top-[52%] h-[76px] w-[76px]" style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%,-50%) translateZ(42px)' }}>
              <div className="absolute inset-0 border border-white/70 bg-gradient-to-br from-[#f2efe6] via-[#b8b8b2] to-[#646d77] shadow-[inset_-12px_-10px_18px_rgba(20,30,40,.35)]" style={{ transform: 'translateZ(38px)' }}>
                <div className="absolute inset-2 border border-slate-500/60 bg-[linear-gradient(135deg,rgba(255,255,255,.35),transparent_48%),repeating-linear-gradient(90deg,transparent_0_7px,rgba(42,52,62,.18)_7px_9px)]" />
                <div className="absolute left-2 top-2 h-2 w-2 rounded-full bg-[#a30000] shadow-[0_0_9px_rgba(163,0,0,.8)]" />
                <div className="absolute bottom-2 right-2 h-3 w-5 border border-slate-600/70 bg-slate-700/80" />
              </div>
              <div className="absolute inset-0 border border-white/30 bg-gradient-to-r from-[#59616b] via-[#c8c8c0] to-[#747a80]" style={{ transform: 'rotateY(90deg) translateZ(38px)' }} />
              <div className="absolute inset-0 border border-white/25 bg-gradient-to-br from-[#424b57] to-[#a5a79f]" style={{ transform: 'rotateY(180deg) translateZ(38px)' }} />
              <div className="absolute inset-0 border border-white/30 bg-gradient-to-l from-[#555e68] via-[#c2c2b9] to-[#727980]" style={{ transform: 'rotateY(-90deg) translateZ(38px)' }} />
              <div className="absolute inset-0 border border-white/30 bg-gradient-to-br from-[#eee7d6] to-[#8c9295]" style={{ transform: 'rotateX(90deg) translateZ(38px)' }} />
              <div className="absolute inset-0 border border-white/20 bg-[#4b5663]" style={{ transform: 'rotateX(-90deg) translateZ(38px)' }} />
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-[#d6d3ca] bg-[#111c2a] shadow-[0_0_20px_rgba(107,185,235,.38)]" style={{ transform: 'translate(-50%,-50%) translateZ(40px)' }}>
                <div className="absolute inset-1 rounded-full border border-sky-200/70 bg-[radial-gradient(circle_at_35%_30%,#c9f0ff,#377ca7_35%,#0b2137_75%)]" />
              </div>
            </div>
            <div className="absolute left-1/2 top-[48%] h-11 w-11 rounded-full border-[6px] border-[#a9aaa5] bg-gradient-to-b from-[#727a81] to-[#252e38] shadow-[0_12px_18px_rgba(0,0,0,.55)]" style={{ transform: 'translate(-50%,-50%) translateZ(92px)' }}>
              <div className="absolute inset-1 rounded-full border border-sky-100/70 bg-[radial-gradient(circle_at_35%_30%,#d7f4ff,#467d9a_38%,#071523_78%)]" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_8px_white]" />
            </div>
            <div className="absolute left-1/2 top-[71%] h-[2px] w-20 bg-gradient-to-r from-transparent via-zinc-300 to-transparent" style={{ transform: 'translateX(-50%) translateZ(-26px)' }} />
            <div className="absolute left-1/2 top-[31%] h-12 w-12 rounded-full border border-[#d4c9ac]/70 bg-[radial-gradient(circle_at_40%_35%,#f4ead1,#77776f_58%,#333d49)] shadow-lg" style={{ transform: 'translate(-50%,-50%) translateZ(20px)' }}>
              <div className="absolute inset-[28%] rounded-full border border-white/40 bg-[#182637]" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 hidden text-[9px] font-mono uppercase tracking-[0.18em] text-slate-400 sm:block">
          Illustrative concept · Not to scale
        </div>
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0a1422]/80 p-1.5 backdrop-blur-md sm:bottom-4 sm:right-4">
          <button type="button" onClick={() => rotateBy(-35)} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold uppercase tracking-wider text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-label="Rotate model left">
            <RotateCcw size={14} aria-hidden="true" /><span className="hidden sm:inline">Rotate</span>
          </button>
          <button type="button" onClick={resetOrientation} className="h-9 rounded-full px-3 text-[10px] font-semibold uppercase tracking-wider text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
            Reset
          </button>
          <button type="button" onClick={() => rotateBy(35)} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold uppercase tracking-wider text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-label="Rotate model right">
            <RotateCw size={14} aria-hidden="true" /><span className="hidden sm:inline">Rotate</span>
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-500 dark:text-zinc-500">
        Sferavis-built visual concept for exploration; proportions and component details are illustrative, not engineering specifications.
      </p>
    </section>
  );
};

export const SpherexPage: React.FC<SpherexPageProps> = ({ onNavigate, onLaunchSferavis }) => {
  const [selectedBandIndex, setSelectedBandIndex] = useState<number>(3); // Default to Band 4 (Water Ice)

  const selectedBand = SPHEREX_BANDS[selectedBandIndex];

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 selection:bg-[#A30000] selection:text-white">
      
      {/* HEADER SECTION - NATIONAL GEOGRAPHIC STYLE */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-zinc-200 dark:border-slate-800">
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#A30000]/10 dark:bg-[#A30000]/15 blur-[140px] pointer-events-none rounded-full" 
          aria-hidden="true" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <header className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">
              The SPHEREx Mission<span className="text-[#a30000]">.</span>
            </h1>
</header>

          <p className="mt-6 text-sm sm:text-base text-slate-700 dark:text-zinc-300 max-w-3xl mx-auto text-center font-merriweather leading-relaxed text-balance">
            SPHEREx is surveying the entire celestial sphere every six months across 102 distinct near-infrared bands (0.75 – 5.0 µm), delivering the first all-sky near-infrared hyperspectral atlas to humanity.
          </p>
          <div className="mt-4 text-center">
            <a
              href="https://science.nasa.gov/mission/spherex/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto inline-flex items-center gap-2 border border-[#a30000]/25 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a30000] transition-colors hover:border-[#a30000] hover:bg-[#a30000] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a30000]"
            >
              Official SPHEREx Website <ArrowRight size={13} />
            </a>
            <a
              href="https://irsa.ipac.caltech.edu/Missions/spherex.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-2 inline-flex items-center gap-2 border border-[#a30000]/25 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a30000] transition-colors hover:border-[#a30000] hover:bg-[#a30000] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a30000]"
            >
              SPHEREx Archive & Data <ArrowRight size={13} />
            </a>
          </div>

          <CustomSpherexModel />

</div>
      </section>


      {/* THE THREE SCIENTIFIC PILLARS */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-slate-800">
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-lexend uppercase tracking-widest text-[#A30000] font-bold">
            <span className="w-2.5 h-2.5 bg-[#A30000]"></span>
            <span>THREE SCIENTIFIC FRONTIERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-oswald uppercase font-black tracking-tight text-slate-950 dark:text-white mt-3">
            Primary Mission Objectives
          </h2>
          <p className="mt-3 text-slate-600 dark:text-zinc-300 text-base sm:text-lg font-merriweather leading-relaxed">
            Formulated to answer three fundamental questions at the frontier of modern astrophysics and cosmology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-7 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000] mb-2">
                Pillar 01
              </div>
              <h3 className="text-xl sm:text-2xl font-oswald uppercase font-bold text-slate-950 dark:text-white">
                Cosmic Inflation
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                Probe the physics of the inflationary era 10⁻³⁶ seconds after the Big Bang by measuring primordial non-Gaussianity (<span className="font-mono text-slate-900 dark:text-white font-bold">f_NL</span>) through the large-scale spatial clustering of hundreds of millions of galaxies.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-200 dark:border-slate-800 space-y-2 text-xs font-lexend">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Target Sample</span>
                <span className="font-bold text-slate-900 dark:text-white">&gt;450 Million Galaxies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Precision Goal</span>
                <span className="font-mono text-[#A30000] font-bold">σ(f_NL) &lt; 1</span>
              </div>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-7 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000] mb-2">
                Pillar 02
              </div>
              <h3 className="text-xl sm:text-2xl font-oswald uppercase font-bold text-slate-950 dark:text-white">
                Origin of Galaxies
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                Measure the total Extragalactic Background Light (EBL) produced by all stars and accreting black holes throughout cosmic history, including the earliest Population III stars that ionized the primeval cosmos.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-200 dark:border-slate-800 space-y-2 text-xs font-lexend">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Measurement</span>
                <span className="font-bold text-slate-900 dark:text-white">EBL Spatial Fluctuations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Epoch Range</span>
                <span className="font-mono text-[#A30000] font-bold">z = 6 – 10 (Reionization)</span>
              </div>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-4 border-l-[#A30000] p-7 flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="text-xs font-lexend uppercase tracking-widest font-bold text-[#A30000] mb-2">
                Pillar 03
              </div>
              <h3 className="text-xl sm:text-2xl font-oswald uppercase font-bold text-slate-950 dark:text-white">
                Origin of Water & Ices
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                Determine the abundance and chemical composition of prebiotic interstellar ices (H₂O, CO₂, CO, methanol) in dense molecular clouds and young planet-forming disks across our Milky Way galaxy.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-zinc-200 dark:border-slate-800 space-y-2 text-xs font-lexend">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Ice Sightlines</span>
                <span className="font-bold text-slate-900 dark:text-white">&gt;100,000 Absorption Lines</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Key Features</span>
                <span className="font-mono text-[#A30000] font-bold">H₂O (3.05 µm), CO₂ (4.27 µm)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* INTERACTIVE INSTRUMENT & 6-LVF DETECTOR INSPECTOR */}
      <section className="py-20 lg:py-28 bg-white/70 dark:bg-[#090f1d]/70 border-b border-zinc-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 text-xs font-lexend uppercase tracking-widest text-[#A30000] font-bold">
              <span className="w-2.5 h-2.5 bg-[#A30000]"></span>
              <span>SPECTROSCOPIC INNOVATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-oswald uppercase font-black tracking-tight text-slate-950 dark:text-white mt-3">
              Linear Variable Filters (LVF)
            </h2>
            <p className="mt-3 text-slate-600 dark:text-zinc-300 text-base sm:text-lg font-merriweather leading-relaxed">
              Instead of bulky moving gratings or prisms, SPHEREx mounts wedged dielectric optical coatings directly on its 2048 × 2048 HgCdTe focal plane arrays. Click any band to inspect technical parameters.
            </p>
          </div>

          {/* 6 Band Selector Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {SPHEREX_BANDS.map((band: SpectralBand, idx: number) => {
              const isSelected = selectedBandIndex === idx;
              return (
                <button
                  key={band.bandNumber}
                  onClick={() => setSelectedBandIndex(idx)}
                  className={`p-4 text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white dark:bg-[#152038] border-[#A30000] border-l-4 shadow-md'
                      : 'bg-white/80 dark:bg-[#0e1628] border-zinc-200 dark:border-slate-800 hover:border-zinc-400 dark:hover:border-slate-700 text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-oswald uppercase font-bold text-slate-900 dark:text-white">LVF {band.bandNumber}</span>
                    <span className={`w-2.5 h-2.5 ${isSelected ? 'bg-[#A30000]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                  </div>
                  <div className="text-xs font-lexend text-slate-900 dark:text-white font-bold">{band.wavelengthRange}</div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 font-mono">{band.resolvingPower}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Inspector Panel for Selected Band */}
          <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10 border-l-4 border-l-[#A30000] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 text-xs font-lexend text-[#A30000] uppercase tracking-widest mb-2 font-bold">
                  <span>Detector Assembly Specifications</span>
                  <span>·</span>
                  <span>Band {selectedBand.bandNumber} of 6</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-oswald uppercase font-bold text-slate-950 dark:text-white">
                  {selectedBand.detector}
                </h3>
                
                <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
                  {selectedBand.primaryScience}
                </p>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-lexend tracking-wider">Wavelength Span</span>
                    <div className="text-base font-bold font-oswald text-slate-900 dark:text-white mt-1">{selectedBand.wavelengthRange}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-lexend tracking-wider">Spectral Resolution</span>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">{selectedBand.resolvingPower}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-lexend tracking-wider">Pixel Scale</span>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">6.2″ per pixel</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-lexend tracking-widest block mb-2 font-bold">
                    Primary Diagnostic Molecules & Lines
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedBand.keyMolecules.map((m: string) => (
                      <span
                        key={m}
                        className="px-3 py-1 text-xs font-mono bg-slate-100 dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 text-slate-800 dark:text-zinc-200"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graphical representation of the Linear Variable Filter */}
              <div className="bg-slate-50 dark:bg-[#090f1d] p-6 border border-zinc-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-lexend text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Dielectric Dispersion Wedge</span>
                  <div className="text-sm font-oswald font-bold text-slate-900 dark:text-white mt-1 uppercase">Continuous Channel Mapping</div>
                  
                  {/* Visual Filter Wedge */}
                  <div className="my-6 relative h-32 border border-zinc-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-900">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-slate-900 via-[#8B0000] to-[#A30000] opacity-85"
                      style={{
                        transform: `scaleY(${1 + (selectedBandIndex * 0.15)})`,
                      }}
                    />
                    <div className="relative z-10 text-center font-mono text-xs text-white">
                      <div className="font-bold">2048 × 2048 Pixels</div>
                      <div className="text-[10px] text-zinc-300 mt-1">
                        Dispersion along Y-axis: R = {selectedBand.resolvingPower}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-400 font-mono">
                  <div className="flex justify-between">
                    <span>Operating Temp:</span>
                    <span className="text-slate-900 dark:text-white font-bold">&lt;80 Kelvin</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Readout Mode:</span>
                    <span className="text-slate-900 dark:text-white">Sample-Up-The-Ramp</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dark Current:</span>
                    <span className="text-slate-900 dark:text-white">&lt; 0.1 e⁻/s/pixel</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* SPACECRAFT HARDWARE & PASSIVE COOLING */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-lexend uppercase tracking-widest text-[#A30000] font-bold">
              <span className="w-2.5 h-2.5 bg-[#A30000]"></span>
              <span>CRYOGENIC INNOVATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-oswald uppercase font-black tracking-tight text-slate-950 dark:text-white mt-3">
              100% Passive Cooling. Zero Liquid Cryogens.
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
              To operate in the thermal infrared up to 5.0 µm, telescope optics and detectors must be kept cryogenic to avoid being blinded by their own thermal glow.
            </p>
            <p className="mt-3 text-base text-slate-600 dark:text-zinc-300 font-merriweather leading-relaxed">
              SPHEREx uses three nested conical V-groove radiation shields made of vapor-deposited aluminum. Radiation bounces out into deep space, chilling the telescope passively to 80 K without a heavy tank of liquid helium, guaranteeing infinite cryogenic lifespan.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-2 border-l-[#A30000] p-5 shadow-sm">
                <div className="text-3xl font-bold font-oswald text-slate-950 dark:text-white">20 cm</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend uppercase mt-1">Telescope Aperture (TMA)</div>
              </div>
              <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-2 border-l-[#A30000] p-5 shadow-sm">
                <div className="text-3xl font-bold font-oswald text-slate-950 dark:text-white">3.5° × 11°</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend uppercase mt-1">Field of View</div>
              </div>
              <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-2 border-l-[#A30000] p-5 shadow-sm">
                <div className="text-3xl font-bold font-oswald text-slate-950 dark:text-white">650 km</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend uppercase mt-1">Polar Sun-Sync Orbit</div>
              </div>
              <div className="bg-white dark:bg-[#0e1628] border border-zinc-200 dark:border-slate-800 border-l-2 border-l-[#A30000] p-5 shadow-sm">
                <div className="text-3xl font-bold font-oswald text-slate-950 dark:text-white">4 Passes</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-lexend uppercase mt-1">All-Sky Coverage</div>
              </div>
            </div>
          </div>

          <div className="relative border-2 border-zinc-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-black">
            <img
              src={spherexObservatoryImage}
              alt="NASA SPHEREx Observatory Conical Passive Shields"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-6">
              <div className="text-xs font-merriweather text-zinc-300 border-l-2 border-[#A30000] pl-3">
                Conical nested V-groove thermal shields radiating satellite heat directly into 3K deep space.
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
