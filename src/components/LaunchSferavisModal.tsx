import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CELESTIAL_TARGETS } from '../data/mockData';
import { Logo } from './Logo';
import { AladinSkyViewer } from './AladinSkyViewer';
import {
  PlanetariumTutorial,
  PLANETARIUM_TUTORIAL_STORAGE_KEY,
} from './PlanetariumTutorial';
import {
  X,
  Download,
  Copy,
  Maximize2,
  Minimize2,
  ExternalLink,
  Compass,
  Activity,
  Sparkles,
  Info,
  BookOpen,
} from 'lucide-react';

interface LaunchSferavisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchSferavisModal: React.FC<LaunchSferavisModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'atlas' | 'analyzer'>('atlas');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('orion-kl');
  const [hoveredPoint, setHoveredPoint] = useState<{ wavelengthUm: number; fluxMjy: number; error: number } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlanetariumTutorialOpen, setIsPlanetariumTutorialOpen] = useState(false);
  const hasCheckedTutorialRef = useRef(false);

  // Listen for message from embedded Sky Atlas to close
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SFERAVIS_CLOSE_STUDIO') {
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('atlas');
      setIsFullscreen(false);
      if (!hasCheckedTutorialRef.current) {
        hasCheckedTutorialRef.current = true;
        try {
          setIsPlanetariumTutorialOpen(
            localStorage.getItem(PLANETARIUM_TUTORIAL_STORAGE_KEY) !== 'true'
          );
        } catch (error) {
          console.warn('Could not read the planetarium tutorial preference:', error);
          setIsPlanetariumTutorialOpen(true);
        }
      }
    } else {
      setIsPlanetariumTutorialOpen(false);
    }
  }, [isOpen]);

  const finishPlanetariumTutorial = () => {
    try {
      localStorage.setItem(PLANETARIUM_TUTORIAL_STORAGE_KEY, 'true');
    } catch (error) {
      console.warn('Could not save the planetarium tutorial preference:', error);
    }
    setIsPlanetariumTutorialOpen(false);
  };

  const currentTarget = useMemo(() => {
    return CELESTIAL_TARGETS.find((t) => t.id === selectedTargetId) || CELESTIAL_TARGETS[0];
  }, [selectedTargetId]);

  const maxFlux = useMemo(() => {
    return Math.max(...currentTarget.sedPoints.map((p) => p.fluxMjy)) * 1.15;
  }, [currentTarget]);

  if (!isOpen) return null;

  const handleCopyFits = () => {
    const fitsHeader = `SIMPLE  =                    T / IAU FITS Standard 4.0
OBJECT  = '${currentTarget.designation}' / Target catalog designation
RA      = '${currentTarget.ra}' / Right Ascension (ICRS)
DEC     = '${currentTarget.dec}' / Declination (ICRS)
WAVE_MIN=                 0.75 / Minimum wavelength (um)
WAVE_MAX=                 5.00 / Maximum wavelength (um)
N_BANDS =                  102 / SPHEREx Near-IR Hyperspectral Channels
ICE_TAU =                ${currentTarget.iceAbsorptionDepth.toFixed(3)} / H2O Ice Optical Depth at 3.05um`;
    navigator.clipboard.writeText(fitsHeader);
    setCopyFeedback('FITS Header copied!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleDownloadCsv = () => {
    let csv = `wavelength_um,flux_mjy,error_mjy\n`;
    currentTarget.sedPoints.forEach((p) => {
      csv += `${p.wavelengthUm},${p.fluxMjy},${p.error}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentTarget.id}_Sferavis_102band_SED.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopyFeedback('Downloaded CSV Spectrum!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const atlasUrl = 'https://irsa.ipac.caltech.edu/Missions/spherex.html';

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl transition-all duration-300 ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 lg:p-6'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`dark relative w-full bg-[#070b14] border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'h-screen w-screen rounded-none border-none'
            : 'max-w-7xl h-[94vh] rounded-2xl'
        }`}
      >
        {/* National Geographic Editorial Studio Header */}
        <header className="px-5 py-3.5 border-b border-slate-800 bg-[#0e1628] flex items-center justify-between gap-4 shrink-0 z-20">
          
          {/* Logo & Mode Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <span className="hidden md:inline-block text-[11px] font-lexend uppercase tracking-widest text-slate-300 border-l border-slate-700 pl-3">
                SPHEREx Planetarium & Analysis
              </span>
            </div>

            {/* Mode Navigation Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-none border border-slate-800">
              <button
                onClick={() => setActiveTab('atlas')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-lexend uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'atlas'
                    ? 'bg-[#A30000] text-white shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>SPHEREx Planetarium</span>
              </button>

              <button
                onClick={() => setActiveTab('analyzer')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-lexend uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'analyzer'
                    ? 'bg-[#A30000] text-white shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Spectral Analyzer</span>
              </button>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            {copyFeedback && (
              <span className="text-[11px] font-mono text-zinc-200 bg-zinc-900 px-3 py-1 border border-zinc-700">
                {copyFeedback}
              </span>
            )}

            <a
              href={atlasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-lexend uppercase tracking-wider text-zinc-200 transition-colors cursor-pointer"
              title="Open the official SPHEREx data archive in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Data Archive</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setActiveTab('atlas');
                setIsPlanetariumTutorialOpen(true);
              }}
              className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-lexend uppercase tracking-wider text-zinc-200 transition-colors hover:bg-zinc-800"
              aria-label="Open planetarium guide"
              title="Open planetarium guide"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Guide</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-lexend uppercase tracking-wider bg-[#A30000] hover:bg-[#8B0000] text-white transition-colors cursor-pointer"
              aria-label="Close Studio"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </header>

        {/* Tab 1: Interactive Themed Sky Atlas */}
        {activeTab === 'atlas' && (
          <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-black">
            <AladinSkyViewer className="h-full" />
            {isPlanetariumTutorialOpen && (
              <PlanetariumTutorial
                onDismiss={() => setIsPlanetariumTutorialOpen(false)}
                onFinish={finishPlanetariumTutorial}
              />
            )}
          </div>
        )}

        {/* Tab 2: Target Hyperspectral Analyzer */}
        {activeTab === 'analyzer' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#070b14]">
            
            {/* Target Ribbon */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-lexend uppercase tracking-widest text-slate-300 font-bold">
                  Select Astronomical Target
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Calibrated across 102 Near-IR Channels (0.75 – 5.0 µm)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {CELESTIAL_TARGETS.map((target) => {
                  const isSelected = target.id === currentTarget.id;
                  return (
                    <button
                      key={target.id}
                      onClick={() => setSelectedTargetId(target.id)}
                      className={`p-3 text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#152038] border-[#A30000] border-l-4 shadow-md'
                          : 'bg-[#0e1628] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-white truncate font-oswald tracking-wide uppercase">
                        {target.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-lexend truncate mt-0.5">
                        {target.category}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Banner with National Geographic-inspired red rule */}
            <div className="bg-[#0e1628] border border-slate-800 border-l-4 border-l-[#A30000] p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400 font-lexend">
                  <span className="text-[#A30000] font-bold uppercase tracking-wider">{currentTarget.category}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-300">{currentTarget.designation}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-oswald uppercase text-white tracking-tight">
                  {currentTarget.name}
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 font-merriweather mt-2 max-w-3xl leading-relaxed">
                  {currentTarget.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyFits}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-lexend uppercase tracking-wider text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy FITS</span>
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-4 py-2 bg-[#A30000] hover:bg-[#8B0000] text-xs font-lexend uppercase tracking-wider font-bold text-white flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Hyperspectral Profile Chart */}
            <div className="bg-[#0e1628] border border-slate-800 p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-lexend text-[#A30000] uppercase tracking-widest block font-bold">
                    102-Band Spectral Energy Distribution (SED)
                  </span>
                  <div className="text-sm font-bold font-oswald uppercase text-white tracking-wide mt-0.5">
                    Flux Density (mJy) vs Wavelength (0.75 – 5.00 µm)
                  </div>
                </div>

                <div className="text-xs font-mono text-zinc-300 bg-black px-3.5 py-1.5 border border-zinc-800">
                  {hoveredPoint ? (
                    <span className="text-white font-semibold">
                      λ = {hoveredPoint.wavelengthUm.toFixed(2)} µm · F_ν = {hoveredPoint.fluxMjy.toFixed(2)} ± {hoveredPoint.error.toFixed(2)} mJy
                    </span>
                  ) : (
                    <span>Hover over spectral nodes to inspect wavelength channels</span>
                  )}
                </div>
              </div>

              {/* SED SVG Curve */}
              <div className="relative h-64 sm:h-72 w-full bg-[#050507] border border-zinc-800 p-2 overflow-hidden select-none">
                <svg
                  className="w-full h-full cursor-crosshair"
                  viewBox="0 0 600 200"
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />

                  {/* Water & CO2 Ice Absorption Windows */}
                  <rect x="290" y="0" width="70" height="200" fill="rgba(163,0,0,0.12)" />
                  <rect x="480" y="0" width="30" height="200" fill="rgba(139,0,0,0.12)" />

                  {/* Spectral Curve and Area */}
                  {(() => {
                    const points = currentTarget.sedPoints;
                    const minW = 0.75;
                    const maxW = 5.00;

                    const coords = points.map((p) => {
                      const x = ((p.wavelengthUm - minW) / (maxW - minW)) * 600;
                      const y = 190 - (p.fluxMjy / maxFlux) * 170;
                      return { x, y, data: p };
                    });

                    const pathString = coords.reduce(
                      (acc, curr, idx) => (idx === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`),
                      ''
                    );
                    const areaString = `${pathString} L 600,200 L 0,200 Z`;

                    return (
                      <g>
                        <path d={areaString} fill="url(#modal-sed-gradient-natgeo)" opacity="0.3" />
                        <path d={pathString} fill="none" stroke="#A30000" strokeWidth="2.5" />
                        {coords.map((c, i) => (
                          <g key={i}>
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r={hoveredPoint?.wavelengthUm === c.data.wavelengthUm ? 5 : 2}
                              fill={hoveredPoint?.wavelengthUm === c.data.wavelengthUm ? '#ffffff' : '#A30000'}
                              onMouseEnter={() => setHoveredPoint(c.data)}
                            />
                            <rect
                              x={c.x - 4}
                              y="0"
                              width="8"
                              height="200"
                              fill="transparent"
                              onMouseEnter={() => setHoveredPoint(c.data)}
                            />
                          </g>
                        ))}
                      </g>
                    );
                  })()}

                  <defs>
                    <linearGradient id="modal-sed-gradient-natgeo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A30000" />
                      <stop offset="100%" stopColor="#050507" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute top-2.5 left-1/2 -translate-x-12 text-[10px] font-lexend uppercase tracking-wider text-red-300 bg-black/85 px-2.5 py-0.5 border border-red-900/60">
                  H₂O Ice Window (3.05 µm)
                </div>
                <div className="absolute top-2.5 right-16 text-[10px] font-lexend uppercase tracking-wider text-red-300 bg-black/85 px-2.5 py-0.5 border border-red-900/60">
                  CO₂ Ice Window (4.27 µm)
                </div>
              </div>
            </div>

            {/* Astrophysical Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#0e1628] p-5 border border-slate-800 shadow-md">
              <div>
                <span className="text-slate-400 uppercase block text-[10px] font-lexend tracking-widest mb-1">RA (ICRS)</span>
                <span className="text-white font-bold font-mono text-sm">{currentTarget.ra}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase block text-[10px] font-lexend tracking-widest mb-1">DEC (ICRS)</span>
                <span className="text-white font-bold font-mono text-sm">{currentTarget.dec}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase block text-[10px] font-lexend tracking-widest mb-1">Distance / Redshift</span>
                <span className="text-white font-bold font-mono text-sm">
                  {currentTarget.redshift ? `z = ${currentTarget.redshift}` : currentTarget.distanceLightYears}
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase block text-[10px] font-lexend tracking-widest mb-1">H₂O Ice Optical Depth</span>
                <span className="text-[#A30000] font-bold font-mono text-sm">
                  {currentTarget.iceAbsorptionDepth > 0 ? `τ = ${currentTarget.iceAbsorptionDepth.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Footer Bar */}
        <footer className="px-5 py-3 bg-[#0e1628] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#A30000]"></span>
            <span className="font-lexend text-[11px] uppercase tracking-wider text-slate-300">SPHEREx QR2 HiPS Quicklook · IRSA Data Access</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === 'atlas' ? 'analyzer' : 'atlas')}
              className="text-xs font-lexend uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Switch to {activeTab === 'atlas' ? 'Spectral Analyzer' : 'Sky Atlas'} →
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer font-lexend uppercase tracking-wider text-xs"
            >
              Close Studio
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
