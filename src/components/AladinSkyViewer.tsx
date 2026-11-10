import React, { useEffect, useId, useRef, useState } from 'react';
import { Activity, Crosshair, Grid3X3, Minus, Plus, RotateCcw, Search, Telescope } from 'lucide-react';

declare global {
  interface Window {
    A?: {
      init: Promise<void>;
      aladin: (selector: string, options?: Record<string, unknown>) => AladinInstance;
    };
  }
}

type AladinInstance = {
  setBaseImageLayer: (survey: string) => void;
  gotoRaDec: (ra: number, dec: number) => void;
  setFoV: (fov: number) => void;
  setProjection: (projection: string) => void;
  setCooGrid: (options: { enabled?: boolean; color?: string; opacity?: number; labelSize?: number }) => void;
  setDefaultColor: (color: string) => void;
};

const ALADIN_SCRIPT = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js';
const SPHEREX_HIPS = 'CDS/P/SPHEREx/QR2/D3';
const DSS2_SURVEY = 'P/DSS2/color';
const INITIAL_RA = 266.414089;
const INITIAL_DEC = -29.006111;

let aladinScriptPromise: Promise<void> | null = null;

function loadAladin(): Promise<void> {
  if (window.A?.init) return window.A.init;
  if (aladinScriptPromise) return aladinScriptPromise;

  aladinScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-sferavis-aladin]');
    const script = existing ?? document.createElement('script');

    const onLoad = () => {
      if (!window.A?.init) {
        reject(new Error('Aladin Lite loaded, but its API was not found.'));
        return;
      }
      window.A.init.then(resolve).catch(reject);
    };

    if (existing) {
      if (window.A?.init) {
        window.A.init.then(resolve).catch(reject);
      } else {
        existing.addEventListener('load', onLoad, { once: true });
        existing.addEventListener('error', () => reject(new Error('Could not load Aladin Lite.')), { once: true });
      }
      return;
    }

    script.src = ALADIN_SCRIPT;
    script.async = true;
    script.dataset.sferavisAladin = 'true';
    script.charset = 'utf-8';
    script.onload = onLoad;
    script.onerror = () => reject(new Error('Could not load Aladin Lite. Check your internet connection or content-security settings.'));
    document.head.appendChild(script);
  }).catch((error) => {
    aladinScriptPromise = null;
    throw error;
  });

  return aladinScriptPromise;
}

interface AladinSkyViewerProps {
  className?: string;
}

export const AladinSkyViewer: React.FC<AladinSkyViewerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinRef = useRef<AladinInstance | null>(null);
  const containerId = useId().replace(/:/g, '');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState<'spherex' | 'reference'>('spherex');
  const [projection, setProjection] = useState<'AIT' | 'TAN' | 'SIN'>('AIT');
  const [gridEnabled, setGridEnabled] = useState(true);
  const [raInput, setRaInput] = useState(String(INITIAL_RA));
  const [decInput, setDecInput] = useState(String(INITIAL_DEC));
  const [fov, setFov] = useState(120);
  const [coordinateError, setCoordinateError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        await loadAladin();
        if (cancelled || !containerRef.current || !window.A) return;

        const aladin = window.A.aladin(`#${containerId}`, {
          survey: SPHEREX_HIPS,
          target: `${INITIAL_RA} ${INITIAL_DEC}`,
          fov: 120,
          projection: 'AIT',
          cooFrame: 'ICRS',
          showCooGrid: true,
          showCooGridControl: false,
          showSimbadPointerControl: true,
          showReticle: true,
          showLayersControl: true,
          showFullscreenControl: false,
        });

        aladin.setDefaultColor('#A30000');
        aladin.setCooGrid({ enabled: true, color: '#A30000', opacity: 0.42, labelSize: 10 });
        aladinRef.current = aladin;
        if (!cancelled) setStatus('ready');
      } catch (cause) {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : 'An unknown error occurred while starting Aladin Lite.');
        setStatus('error');
      }
    };

    initialize();
    return () => {
      cancelled = true;
      aladinRef.current = null;
    };
  }, [containerId]);

  const changeSurvey = (nextSurvey: 'spherex' | 'reference') => {
    setSurvey(nextSurvey);
    if (!aladinRef.current) return;
    aladinRef.current.setBaseImageLayer(nextSurvey === 'spherex' ? SPHEREX_HIPS : DSS2_SURVEY);
    if (nextSurvey === 'spherex') {
      aladinRef.current.gotoRaDec(INITIAL_RA, INITIAL_DEC);
      aladinRef.current.setFoV(120);
      setFov(120);
    }
  };

  const goToCoordinates = (event: React.FormEvent) => {
    event.preventDefault();
    const ra = Number(raInput);
    const dec = Number(decInput);
    if (!Number.isFinite(ra) || !Number.isFinite(dec) || ra < 0 || ra > 360 || dec < -90 || dec > 90) {
      setCoordinateError('Enter RA from 0–360° and Dec from −90° to +90°.');
      return;
    }
    aladinRef.current?.gotoRaDec(ra, dec);
    setCoordinateError('');
  };

  const updateFov = (next: number) => {
    const bounded = Math.min(360, Math.max(0.02, next));
    setFov(bounded);
    aladinRef.current?.setFoV(bounded);
  };

  const resetView = () => {
    aladinRef.current?.gotoRaDec(INITIAL_RA, INITIAL_DEC);
    updateFov(120);
    setProjection('AIT');
    aladinRef.current?.setProjection('AIT');
  };

  return (
    <section className={`relative flex h-full min-h-[520px] w-full flex-col overflow-hidden bg-[#050507] text-zinc-100 ${className}`} aria-label="Sferavis SPHEREx planetarium">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-[#0d0d12] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-[#A30000]/60 bg-[#A30000]/10 text-[#d34a4a]">
            <Telescope className="h-4 w-4" />
          </div>
          <div>
            <p className="font-oswald text-sm font-bold uppercase tracking-[0.16em] text-white">Sferavis Planetarium</p>
            <p className="font-lexend text-[9px] uppercase tracking-[0.17em] text-zinc-500">SPHEREx all-sky explorer · ICRS</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-2 border px-2.5 py-1.5 font-lexend text-[9px] uppercase tracking-wider ${status === 'ready' ? 'border-emerald-900/70 bg-emerald-950/30 text-emerald-300' : status === 'error' ? 'border-red-900 bg-red-950/30 text-red-300' : 'border-zinc-700 bg-zinc-900 text-zinc-400'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status === 'ready' ? 'bg-emerald-400' : status === 'error' ? 'bg-red-400' : 'animate-pulse bg-amber-400'}`} />
            {status === 'ready' ? 'Viewer ready' : status === 'error' ? 'Connection error' : 'Initializing'}
          </span>
          <button onClick={resetView} className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 font-lexend text-[9px] uppercase tracking-wider text-zinc-300 transition-colors hover:border-[#A30000] hover:text-white">
            <RotateCcw className="h-3 w-3" /> Reset view
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-[390px] flex-1 bg-[#020204] lg:min-h-0">
          <div id={containerId} ref={containerRef} className="absolute inset-0 h-full w-full" />

          {status === 'loading' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050507] text-zinc-300">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#A30000]" />
                <p className="font-lexend text-xs uppercase tracking-[0.2em]">Initializing SPHEREx sky</p>
                <p className="mt-2 text-[10px] text-zinc-500">Connecting to the public HiPS image service…</p>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050507] px-6 text-center">
              <div className="max-w-md">
                <p className="font-lexend text-sm uppercase tracking-widest text-red-400">Planetarium unavailable</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{error}</p>
                <button type="button" onClick={() => window.location.reload()} className="mt-5 border border-zinc-700 px-4 py-2 text-xs uppercase tracking-wider text-zinc-200 hover:border-[#A30000]">Reload Sferavis</button>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute left-4 top-4 z-[5] border border-white/10 bg-black/75 px-3 py-2 backdrop-blur">
            <p className="font-lexend text-[9px] uppercase tracking-[0.18em] text-zinc-200">{survey === 'spherex' ? 'NASA SPHEREx · QR2' : 'Reference survey · DSS2'}</p>
            <p className="mt-1 font-mono text-[10px] text-zinc-500">{projection} projection · {fov.toFixed(fov < 1 ? 3 : 1)}° FoV</p>
          </div>
          <div className="absolute bottom-3 left-3 z-[5] flex items-center gap-2 border border-white/10 bg-black/75 px-2.5 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A30000]" />
            <span className="font-lexend text-[9px] uppercase tracking-wider text-zinc-300">{survey === 'spherex' ? 'SPHEREx quicklook layer' : 'Optical reference layer'}</span>
          </div>
        </div>

        <aside className="z-10 w-full shrink-0 border-t border-zinc-800 bg-[#0d0d12] lg:w-[286px] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div className="space-y-5 p-4">
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">Image survey</h3>
                <Activity className="h-3.5 w-3.5 text-[#A30000]" />
              </div>
              <div className="grid grid-cols-2 gap-1 border border-zinc-800 bg-black p-1">
                <button onClick={() => changeSurvey('spherex')} className={`px-2 py-2 font-lexend text-[9px] uppercase tracking-wider transition-colors ${survey === 'spherex' ? 'bg-[#A30000] font-bold text-white' : 'text-zinc-400 hover:text-white'}`}>SPHEREx QR2</button>
                <button onClick={() => changeSurvey('reference')} className={`px-2 py-2 font-lexend text-[9px] uppercase tracking-wider transition-colors ${survey === 'reference' ? 'bg-[#A30000] font-bold text-white' : 'text-zinc-400 hover:text-white'}`}>DSS2 reference</button>
              </div>
              <div className="mt-2 border-l-2 border-[#A30000] bg-black/40 px-3 py-2">
                <p className="font-mono text-[10px] text-zinc-200">{survey === 'spherex' ? 'CDS/P/SPHEREx/QR2/D3' : 'P/DSS2/color'}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">{survey === 'spherex' ? 'Public SPHEREx QR2 HiPS quicklook. D3 composite; metadata wavelength coverage 1.63–2.41 µm.' : 'Optical sky reference for visual comparison; not SPHEREx data.'}</p>
              </div>
            </section>

            <section className="border-t border-zinc-800 pt-4">
              <h3 className="mb-3 font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">Navigate the sky</h3>
              <form onSubmit={goToCoordinates} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block font-lexend text-[9px] uppercase tracking-wider text-zinc-500">Right ascension °</span>
                    <input value={raInput} onChange={(e) => setRaInput(e.target.value)} inputMode="decimal" className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#A30000]" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-lexend text-[9px] uppercase tracking-wider text-zinc-500">Declination °</span>
                    <input value={decInput} onChange={(e) => setDecInput(e.target.value)} inputMode="decimal" className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#A30000]" />
                  </label>
                </div>
                {coordinateError && <p className="text-[10px] text-red-400">{coordinateError}</p>}
                <button type="submit" className="flex w-full items-center justify-center gap-2 bg-[#A30000] px-3 py-2 font-lexend text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000]">
                  <Search className="h-3 w-3" /> Go to coordinates
                </button>
              </form>
            </section>

            <section className="border-t border-zinc-800 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">Field of view</h3>
                <span className="font-mono text-[10px] text-zinc-400">{fov.toFixed(fov < 1 ? 3 : 1)}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateFov(fov * 1.5)} aria-label="Zoom out" className="border border-zinc-700 bg-black p-2 text-zinc-300 hover:border-[#A30000] hover:text-white"><Minus className="h-3.5 w-3.5" /></button>
                <input aria-label="Field of view" type="range" min="0.02" max="360" step="0.01" value={fov} onChange={(e) => updateFov(Number(e.target.value))} className="min-w-0 flex-1 accent-[#A30000]" />
                <button onClick={() => updateFov(fov / 1.5)} aria-label="Zoom in" className="border border-zinc-700 bg-black p-2 text-zinc-300 hover:border-[#A30000] hover:text-white"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9px] text-zinc-600"><span>0.02°</span><span>360°</span></div>
            </section>

            <section className="border-t border-zinc-800 pt-4">
              <h3 className="mb-2 font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">Projection</h3>
              <div className="grid grid-cols-3 gap-1">
                {(['AIT', 'TAN', 'SIN'] as const).map((item) => (
                  <button key={item} onClick={() => { setProjection(item); aladinRef.current?.setProjection(item); }} className={`border px-2 py-2 font-mono text-[10px] transition-colors ${projection === item ? 'border-[#A30000] bg-[#A30000]/15 text-white' : 'border-zinc-800 bg-black text-zinc-500 hover:text-zinc-200'}`}>{item}</button>
                ))}
              </div>
              <button onClick={() => { const next = !gridEnabled; setGridEnabled(next); aladinRef.current?.setCooGrid({ enabled: next, color: '#A30000', opacity: 0.42, labelSize: 10 }); }} className={`mt-2 flex w-full items-center justify-between border px-3 py-2 text-[10px] transition-colors ${gridEnabled ? 'border-[#A30000]/50 bg-[#A30000]/10 text-zinc-200' : 'border-zinc-800 bg-black text-zinc-500'}`}>
                <span className="flex items-center gap-2"><Grid3X3 className="h-3.5 w-3.5" /> Coordinate grid</span>
                <span className="font-lexend uppercase tracking-wider">{gridEnabled ? 'On' : 'Off'}</span>
              </button>
            </section>

            <section className="border-t border-zinc-800 pt-4">
              <h3 className="mb-2 font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">SPHEREx data note</h3>
              <p className="text-[10px] leading-relaxed text-zinc-500">This public HiPS layer is a D3 quicklook composite, not the individual 102-channel spectral cube. Its service metadata lists 1.63–2.41 µm coverage. Per-band science analysis requires the calibrated FITS products from IRSA.</p>
              <a href="https://irsa.ipac.caltech.edu/Missions/spherex.html" target="_blank" rel="noreferrer" className="mt-2 inline-block font-lexend text-[9px] uppercase tracking-wider text-[#d34a4a] hover:text-white">SPHEREx archive at IRSA ↗</a>
            </section>
          </div>
        </aside>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-800 bg-[#08080a] px-4 py-2 text-[9px] text-zinc-500">
        <span className="font-lexend uppercase tracking-wider">Sferavis · Explore the invisible universe</span>
        <span>Sky rendering by Aladin Lite · SPHEREx data courtesy NASA / JPL-Caltech</span>
      </div>
    </section>
  );
};
