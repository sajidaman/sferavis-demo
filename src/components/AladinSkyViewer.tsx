import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import A, { type AladinInstance } from 'aladin-lite';
import {
  Activity,
  AlertTriangle,
  ExternalLink,
  Grid3X3,
  Minus,
  Navigation,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Telescope,
} from 'lucide-react';

const SPHEREX_HIPS = 'CDS/P/SPHEREx/QR2/D3';
const SPHEREX_HIPS_URL = 'https://alasky.cds.unistra.fr/SPHEREx/D3';
const SPHEREX_HIPS_MIRROR_URL = 'https://alaskybis.cds.unistra.fr/SPHEREx/D3';
const DSS2_SURVEY = 'P/DSS2/color';
const DSS2_HIPS_URL = 'https://alasky.cds.unistra.fr/DSS/DSSColor';
const INITIAL_RA = 266.414089;
const INITIAL_DEC = -29.006111;
// The SPHEREx QR2 registry publishes this as its recommended observation FoV.
const INITIAL_FOV = 0.4580648549089874;

function createSpherexHiPS(url = SPHEREX_HIPS_URL, onError?: (error: unknown) => void) {
  return A.HiPS(SPHEREX_HIPS, {
    name: 'NASA SPHEREx QR2 D3',
    url,
    maxOrder: 7,
    minOrder: 0,
    tileSize: 512,
    imgFormat: 'png',
    cooFrame: 'equatorial',
    requestMode: 'cors',
    requestCredentials: 'omit',
    errorCallback: (error: unknown) => onError?.(error),
  });
}

interface AladinSkyViewerProps {
  className?: string;
}

type ViewerStatus = 'loading' | 'ready' | 'init-error';

export const AladinSkyViewer: React.FC<AladinSkyViewerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinRef = useRef<AladinInstance | null>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const containerId = `sferavis-aladin-${rawId}`;
  const initializationIdRef = useRef(0);

  const [status, setStatus] = useState<ViewerStatus>('loading');
  const [initErrorMsg, setInitErrorMsg] = useState<string | null>(null);
  const [initDiagnostic, setInitDiagnostic] = useState<string | null>(null);
  const [surveyErrorMsg, setSurveyErrorMsg] = useState<string | null>(null);

  const [survey, setSurvey] = useState<'spherex' | 'reference'>('spherex');
  const [projection, setProjection] = useState<'AIT' | 'TAN' | 'SIN'>('AIT');
  const [gridEnabled, setGridEnabled] = useState(true);
  const [raInput, setRaInput] = useState(String(INITIAL_RA));
  const [decInput, setDecInput] = useState(String(INITIAL_DEC));
  const [fov, setFov] = useState(INITIAL_FOV);
  const [coordinateError, setCoordinateError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const surveyRef = useRef(survey);
  const gridEnabledRef = useRef(gridEnabled);
  surveyRef.current = survey;
  gridEnabledRef.current = gridEnabled;

  // Initialize Aladin Lite
  const initializeViewer = useCallback(async () => {
    const initializationId = ++initializationIdRef.current;
    const isCurrentInitialization = () => initializationId === initializationIdRef.current;
    setStatus('loading');
    setInitErrorMsg(null);
    setInitDiagnostic(null);
    setSurveyErrorMsg(null);

    // Clean up any previous viewer inside the container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    aladinRef.current = null;

    try {
      // 1. Verify WebGL2 support explicitly for clean diagnostic
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2');
      if (!gl) {
        throw new Error(
          'WebGL 2.0 is not supported or is disabled in your browser environment. Aladin Lite requires WebGL 2.0 to render astronomical all-sky projection maps.'
        );
      }

      // 2. Wait for module WebAssembly initialization
      if (!A || !A.init) {
        throw new Error(
          'Aladin Lite module export missing A.init promise. Verify that the official aladin-lite NPM package is loaded.'
        );
      }

      try {
        await A.init;
      } catch (wasmErr) {
        const msg = wasmErr instanceof Error ? wasmErr.message : String(wasmErr);
        throw new Error(
          `Aladin Lite WebAssembly core initialization failed: ${msg}. Check browser WebAssembly support or Content Security Policy.`
        );
      }
      if (!isCurrentInitialization()) return;

      // Wait until the modal has completed layout; Aladin measures its mount node at creation.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!isCurrentInitialization()) return;
      if (!containerRef.current) return;
      if (containerRef.current.clientWidth < 2 || containerRef.current.clientHeight < 2) {
        throw new Error('The planetarium viewport has no measurable size. Close and reopen Launch Sferavis, then retry.');
      }

      // Ensure the container has the expected id attribute
      containerRef.current.id = containerId;

      // Start with the known optical reference layer so the canvas is never an empty black panel
      // while the SPHEREx HiPS metadata and tiles are being requested.
      const targetSurvey = surveyRef.current === 'spherex' ? SPHEREX_HIPS_URL : DSS2_HIPS_URL;
      const aladin = A.aladin(`#${containerId}`, {
        survey: DSS2_HIPS_URL,
        target: `${INITIAL_RA} ${INITIAL_DEC}`,
        fov: INITIAL_FOV,
        projection: 'AIT',
        cooFrame: 'ICRS',
        showCooGrid: true,
        showCooGridControl: false,
        showSimbadPointerControl: true,
        showReticle: true,
        showLayersControl: true,
        showFullscreenControl: false,
        showGotoControl: false,
      });

      if (!aladin) {
        throw new Error('A.aladin() returned null or undefined. Viewer element could not be instantiated.');
      }

      // Style overlay elements & grid to match Sferavis deep red theme
      aladin.setDefaultColor('#A30000');
      aladin.setCooGrid({
        enabled: gridEnabledRef.current,
        color: '#A30000',
        opacity: 0.42,
        labelSize: 10,
      });

      aladinRef.current = aladin;

      setStatus('ready');

      // Load SPHEREx using its published HiPS URL and known metadata.
      loadSurveyLayer(targetSurvey);
    } catch (err) {
      if (!isCurrentInitialization()) return;
      console.error('[Sferavis Aladin Lite Init Error]', err);
      const message = err instanceof Error ? err.message : String(err);
      setStatus('init-error');
      setInitErrorMsg(message);
      setInitDiagnostic(
        'Diagnostic: Library initialization error (WebGL 2.0 / WebAssembly / DOM instantiation). Check browser graphics acceleration and WebAssembly execution permissions.'
      );
    }
  }, [containerId]);

  // Load the survey directly through Aladin Lite. The SPHEREx registry confirms
  // order 7, 512px tiles, equatorial frame, and PNG availability. Passing these
  // values to A.HiPS prevents a fragile browser-side properties fetch.
  const loadSurveyLayer = (surveyUrl: string) => {
    const aladin = aladinRef.current;
    if (!aladin) return;

    if (surveyUrl !== SPHEREX_HIPS_URL) {
      aladin.setBaseImageLayer(DSS2_HIPS_URL);
      setSurveyErrorMsg(null);
      return;
    }

    const mirrorError = (cause: unknown) => {
      const detail = cause instanceof Error ? cause.message : String(cause);
      setSurveyErrorMsg(`SPHEREx QR2 could not be loaded from either official HiPS host. Details: ${detail}`);
    };

    const primaryError = (cause: unknown) => {
      const detail = cause instanceof Error ? cause.message : String(cause);
      setSurveyErrorMsg(`The primary SPHEREx host failed (${detail}). Trying the official mirror…`);

      if (aladinRef.current) {
        const mirrorLayer = createSpherexHiPS(SPHEREX_HIPS_MIRROR_URL, mirrorError);
        aladinRef.current.setBaseImageLayer(mirrorLayer);
      }
    };

    try {
      const layer = createSpherexHiPS(SPHEREX_HIPS_URL, primaryError);
      aladin.setBaseImageLayer(layer);
      setSurveyErrorMsg(null);
    } catch (error) {
      primaryError(error);
    }
  };

  useEffect(() => {
    void initializeViewer();
    return () => {
      initializationIdRef.current += 1;
      aladinRef.current = null;
    };
  }, [initializeViewer, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const changeSurvey = (nextSurvey: 'spherex' | 'reference') => {
    setSurvey(nextSurvey);
    setSurveyErrorMsg(null);
    const surveyUrl = nextSurvey === 'spherex' ? SPHEREX_HIPS_URL : DSS2_HIPS_URL;

    try {
      loadSurveyLayer(surveyUrl);
      if (nextSurvey === 'spherex' && aladinRef.current) {
        aladinRef.current.gotoRaDec(INITIAL_RA, INITIAL_DEC);
        aladinRef.current.setFoV(INITIAL_FOV);
        setFov(INITIAL_FOV);
      }
    } catch (error) {
      console.error('[Survey Change Error]', error);
      setSurveyErrorMsg(
        `Failed to switch survey layer: ${error instanceof Error ? error.message : String(error)}`
      );
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
    if (aladinRef.current) {
      aladinRef.current.gotoRaDec(ra, dec);
      setCoordinateError('');
    }
  };

  const updateFov = (next: number) => {
    const bounded = Math.min(360, Math.max(0.02, next));
    setFov(bounded);
    if (aladinRef.current) {
      aladinRef.current.setFoV(bounded);
    }
  };

  const toggleGrid = () => {
    const next = !gridEnabled;
    setGridEnabled(next);
    if (aladinRef.current) {
      aladinRef.current.setCooGrid({
        enabled: next,
        color: '#A30000',
        opacity: 0.42,
        labelSize: 10,
      });
    }
  };

  const changeProjection = (item: 'AIT' | 'TAN' | 'SIN') => {
    setProjection(item);
    if (aladinRef.current) {
      aladinRef.current.setProjection(item);
    }
  };

  const resetView = () => {
    if (aladinRef.current) {
      aladinRef.current.gotoRaDec(INITIAL_RA, INITIAL_DEC);
      updateFov(INITIAL_FOV);
      setProjection('AIT');
      aladinRef.current.setProjection('AIT');
      setRaInput(String(INITIAL_RA));
      setDecInput(String(INITIAL_DEC));
      setCoordinateError('');
    }
  };

  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#0a1020] text-zinc-100 ${className}`}
      aria-label="Sferavis SPHEREx planetarium"
    >
      {/* Top Header Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-[#111a2a] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-[#A30000]/60 bg-[#A30000]/10 text-[#d34a4a]">
            <Telescope className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-oswald text-sm font-bold uppercase tracking-[0.16em] text-white">
                Sferavis Planetarium
              </p>
              <span className="border border-[#A30000]/40 bg-[#A30000]/20 px-1.5 py-0.5 font-lexend text-[8px] font-semibold uppercase tracking-wider text-[#ff8080]">
                Aladin Lite v3 · ESM
              </span>
            </div>
            <p className="font-lexend text-[9px] uppercase tracking-[0.17em] text-zinc-500">
              SPHEREx All-Sky Explorer · ICRS Coordinate System
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <span
            className={`flex items-center gap-2 border px-2.5 py-1.5 font-lexend text-[9px] uppercase tracking-wider ${
              status === 'ready'
                ? 'border-emerald-900/70 bg-emerald-950/30 text-emerald-300'
                : status === 'init-error'
                ? 'border-red-900 bg-red-950/30 text-red-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-400'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === 'ready'
                  ? 'bg-emerald-400'
                  : status === 'init-error'
                  ? 'bg-red-400'
                  : 'animate-pulse bg-amber-400'
              }`}
            />
            {status === 'ready' ? 'Viewer Ready' : status === 'init-error' ? 'Init Error' : 'Initializing WASM'}
          </span>

          {/* Reset View Button */}
          <button
            onClick={resetView}
            className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 font-lexend text-[9px] uppercase tracking-wider text-zinc-300 transition-colors hover:border-[#A30000] hover:text-white"
          >
            <RotateCcw className="h-3 w-3" /> Reset View
          </button>
        </div>
      </div>

      {/* Survey Diagnostic Warning Banner (if survey tile network failure occurs) */}
      {surveyErrorMsg && status === 'ready' && (
        <div className="flex items-center justify-between border-b border-amber-900/60 bg-amber-950/40 px-4 py-2 font-lexend text-[10px] text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>{surveyErrorMsg}</span>
          </div>
          <button
            onClick={() => loadSurveyLayer(survey === 'spherex' ? SPHEREX_HIPS_URL : DSS2_HIPS_URL)}
            className="shrink-0 underline hover:text-white"
          >
            Recheck service
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Sky View Canvas Container */}
        <div className="relative min-h-0 flex-[0_0_45%] bg-[#080f20] lg:flex-1">
          {/* Aladin Mount Node */}
          <div
            id={containerId}
            ref={containerRef}
            className="aladin-viewport-container absolute inset-0 h-full w-full"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Loading Overlay */}
          {status === 'loading' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050507]/90 text-zinc-300 backdrop-blur-sm">
              <div className="max-w-xs text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#A30000]" />
                <p className="font-lexend text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Loading Aladin Lite WASM
                </p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-400">
                  Compiling WebAssembly core and binding WebGL 2.0 graphics pipeline…
                </p>
              </div>
            </div>
          )}

          {/* Library Initialization Error Overlay with In-Place Retry */}
          {status === 'init-error' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050507] px-6 text-center">
              <div className="max-w-lg border border-red-900/60 bg-red-950/20 p-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border border-red-700 bg-red-950 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h4 className="font-oswald text-base font-bold uppercase tracking-wider text-red-300">
                  Aladin Lite Initialization Failed
                </h4>
                <p className="mt-3 text-xs leading-relaxed text-zinc-300">{initErrorMsg}</p>
                {initDiagnostic && (
                  <p className="mt-3 border-l-2 border-red-800 bg-black/60 p-2 text-left font-mono text-[10px] text-zinc-400">
                    {initDiagnostic}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="flex items-center gap-2 bg-[#A30000] px-4 py-2 font-lexend text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Retry Viewer Without Reload
                  </button>
                  <button
                    type="button"
                    onClick={() => changeSurvey('reference')}
                    className="border border-zinc-700 bg-zinc-900 px-4 py-2 font-lexend text-xs uppercase tracking-wider text-zinc-300 hover:text-white"
                  >
                    Try DSS2 Fallback
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Viewport Meta Badges */}
          <div className="pointer-events-none absolute left-4 top-4 z-[5] border border-white/10 bg-black/80 px-3 py-2 backdrop-blur">
            <p className="font-lexend text-[9px] uppercase tracking-[0.18em] text-zinc-200">
              {survey === 'spherex' ? 'NASA SPHEREx · QR2 D3 Composite' : 'Optical Reference · DSS2 Color'}
            </p>
            <p className="mt-1 font-mono text-[10px] text-zinc-400">
              {projection} Projection · {fov.toFixed(fov < 1 ? 3 : 1)}° FoV
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 z-[5] flex items-center gap-2 border border-white/10 bg-black/80 px-2.5 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A30000]" />
            <span className="font-lexend text-[9px] uppercase tracking-wider text-zinc-300">
              {survey === 'spherex' ? 'Near-Infrared Spectrophotometric Survey' : 'Digitized Sky Survey (Optical)'}
            </span>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="planetarium-controls z-10 min-h-0 w-full flex-1 overflow-y-auto border-t border-slate-700 bg-[#172235] shadow-[-12px_0_32px_rgba(0,0,0,0.22)] lg:w-[310px] lg:flex-none lg:border-l lg:border-t-0">
          <div className="space-y-4 p-4">
            {/* Survey Switcher */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                  Image Survey
                </h3>
                <Activity className="h-3.5 w-3.5 text-[#A30000]" />
              </div>
              <div className="grid grid-cols-2 gap-1 border border-zinc-800 bg-black p-1">
                <button
                  type="button"
                  onClick={() => changeSurvey('spherex')}
                  className={`px-2 py-2 font-lexend text-[9px] uppercase tracking-wider transition-colors ${
                    survey === 'spherex' ? 'bg-[#A30000] font-bold text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  SPHEREx QR2
                </button>
                <button
                  type="button"
                  onClick={() => changeSurvey('reference')}
                  className={`px-2 py-2 font-lexend text-[9px] uppercase tracking-wider transition-colors ${
                    survey === 'reference' ? 'bg-[#A30000] font-bold text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  DSS2 Reference
                </button>
              </div>
              <div className="mt-2 border-l-2 border-[#A30000] bg-black/50 px-3 py-2">
                <p className="font-mono text-[10px] font-semibold text-zinc-200">
                  {survey === 'spherex' ? SPHEREX_HIPS : DSS2_SURVEY}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-zinc-400">
                  {survey === 'spherex'
                    ? 'NASA SPHEREx Quicklook Composite (D3). Bandpass 1.63–2.41 µm. Rendered from CDS HiPS network tiles.'
                    : 'Optical all-sky baseline (DSS2) for visual identification of stellar fields and extended galaxies.'}
                </p>
              </div>
            </section>

            {/* Coordinate Navigation */}
            <section className="border-t border-zinc-800 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                  Target Coordinates
                </h3>
                <Navigation className="h-3.5 w-3.5 text-[#A30000]" />
              </div>
              <form onSubmit={goToCoordinates} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block font-lexend text-[9px] uppercase tracking-wider text-zinc-500">
                      RA (0° – 360°)
                    </span>
                    <input
                      value={raInput}
                      onChange={(e) => setRaInput(e.target.value)}
                      inputMode="decimal"
                      className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#A30000]"
                      placeholder="266.414"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block font-lexend text-[9px] uppercase tracking-wider text-zinc-500">
                      Dec (−90° – +90°)
                    </span>
                    <input
                      value={decInput}
                      onChange={(e) => setDecInput(e.target.value)}
                      inputMode="decimal"
                      className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#A30000]"
                      placeholder="-29.006"
                    />
                  </label>
                </div>
                {coordinateError && <p className="text-[10px] text-red-400">{coordinateError}</p>}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 bg-[#A30000] px-3 py-2 font-lexend text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000]"
                >
                  <Search className="h-3 w-3" /> Go To Coordinates
                </button>
              </form>
            </section>

            {/* Field of View Slider */}
            <section className="border-t border-zinc-800 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                  Field of View
                </h3>
                <span className="font-mono text-[10px] text-zinc-400">{fov.toFixed(fov < 1 ? 3 : 1)}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateFov(fov * 1.5)}
                  aria-label="Zoom out"
                  className="border border-zinc-700 bg-black p-2 text-zinc-300 transition-colors hover:border-[#A30000] hover:text-white"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  aria-label="Field of view"
                  type="range"
                  min={Math.log(0.02)}
                  max={Math.log(360)}
                  step="0.01"
                  value={Math.log(fov)}
                  onChange={(e) => updateFov(Math.exp(Number(e.target.value)))}
                  className="min-w-0 flex-1 accent-[#A30000]"
                />
                <button
                  type="button"
                  onClick={() => updateFov(fov / 1.5)}
                  aria-label="Zoom in"
                  className="border border-zinc-700 bg-black p-2 text-zinc-300 transition-colors hover:border-[#A30000] hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9px] text-zinc-600">
                <span>0.02° (Close-up)</span>
                <span>360° (Full Sky)</span>
              </div>
            </section>

            {/* Projection & Grid Controls */}
            <section className="border-t border-zinc-800 pt-4">
              <h3 className="mb-2 font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                Cartographic Projection
              </h3>
              <div className="grid grid-cols-3 gap-1">
                {(['AIT', 'TAN', 'SIN'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeProjection(item)}
                    className={`border px-2 py-2 font-mono text-[10px] transition-colors ${
                      projection === item
                        ? 'border-[#A30000] bg-[#A30000]/20 font-bold text-white'
                        : 'border-zinc-800 bg-black text-zinc-500 hover:text-zinc-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={toggleGrid}
                className={`mt-2 flex w-full items-center justify-between border px-3 py-2 text-[10px] transition-colors ${
                  gridEnabled
                    ? 'border-[#A30000]/50 bg-[#A30000]/10 text-zinc-200'
                    : 'border-zinc-800 bg-black text-zinc-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 className="h-3.5 w-3.5" /> Coordinate Grid
                </span>
                <span className="font-lexend uppercase tracking-wider">{gridEnabled ? 'On' : 'Off'}</span>
              </button>
            </section>

            {/* Scientific Notice */}
            <section className="border-t border-zinc-800 pt-4">
              <h3 className="mb-2 font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                SPHEREx Data Notice
              </h3>
              <p className="text-[10px] leading-relaxed text-zinc-500">
                This public HiPS layer is a D3 quicklook composite, not the individual 102-channel spectral cube. Its service metadata lists 1.63–2.41 µm coverage. Calibrated FITS science products are distributed through NASA/IPAC IRSA.
              </p>
              <a
                href="https://irsa.ipac.caltech.edu/Missions/spherex.html"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-lexend text-[9px] uppercase tracking-wider text-[#d34a4a] hover:text-white"
              >
                SPHEREx Archive at IRSA <ExternalLink className="h-3 w-3" />
              </a>
            </section>
          </div>
        </aside>
      </div>

      {/* Footer Info Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-700 bg-[#111a2a] px-4 py-2 text-[9px] text-slate-400">
        <span className="font-lexend uppercase tracking-wider">Sferavis · Explore the Invisible Universe</span>
        <span>Sky Rendering: Aladin Lite v3 (WASM) · Data: NASA / JPL-Caltech / CDS</span>
      </div>
    </section>
  );
};
