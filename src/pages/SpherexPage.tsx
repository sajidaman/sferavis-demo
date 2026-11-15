import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageId, SpectralBand } from '../types';
import { SPHEREX_BANDS } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

interface SpherexPageProps {
  onNavigate: (page: PageId) => void;
}

export const SpherexPage: React.FC<SpherexPageProps> = ({ onNavigate }) => {
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
            SPHEREx is surveying the entire celestial sphere every six months across 102 distinct near-infrared bands (0.75 – 5.0 µm), providing a comprehensive near-infrared spectral survey of the entire sky.
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
              src="https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia26/pia26531/PIA26531.jpg"
              alt="Artist’s concept of the SPHEREx spacecraft in low Earth orbit, showing its distinctive conical photon shields."
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-6">
              <div className="text-xs font-merriweather text-zinc-300 border-l-2 border-[#A30000] pl-3">
                Artist’s concept of SPHEREx in orbit. Its conical photon shields protect the telescope from infrared light and heat from the Sun and Earth.
              </div>
            </div>
          </div>
          <p className="mt-3 text-right text-[10px] leading-relaxed text-slate-500 dark:text-zinc-500">
            Image: <a href="https://images.nasa.gov/details/PIA26531" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#A30000]">SPHEREx in Orbit (Artist’s Concept), PIA26531</a> · NASA/JPL-Caltech
          </p>

        </div>
      </section>

    </div>
  );
};
