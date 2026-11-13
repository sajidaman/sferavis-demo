import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import A, { type AladinCatalog, type AladinGraphicOverlay, type AladinInstance } from 'aladin-lite';
import { AlertTriangle, RefreshCw, RotateCcw, X } from 'lucide-react';
import { loadAnalysisDataset } from '../data/analysisDatasets';

const SPHEREX_HIPS = 'CDS/P/SPHEREx/QR2/D3';
const SPHEREX_HIPS_URL = 'https://alasky.cds.unistra.fr/SPHEREx/D3';
const SPHEREX_HIPS_MIRROR_URL = 'https://alaskybis.cds.unistra.fr/SPHEREx/D3';
const DSS2_HIPS_URL = 'https://alasky.cds.unistra.fr/DSS/DSSColor';
const INITIAL_RA = 180;
const INITIAL_DEC = 0;
const INITIAL_FOV = 0.25;

function numberOrNull(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

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
  const analysisLayersRef = useRef<Array<AladinCatalog | AladinGraphicOverlay>>([]);
  const analysisRequestIdRef = useRef(0);

  const [status, setStatus] = useState<ViewerStatus>('loading');
  const [initErrorMsg, setInitErrorMsg] = useState<string | null>(null);
  const [initDiagnostic, setInitDiagnostic] = useState<string | null>(null);
  const [surveyErrorMsg, setSurveyErrorMsg] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedAnalysisSource, setSelectedAnalysisSource] = useState<Record<string, string | number | boolean | null> | null>(null);
  const [survey, setSurvey] = useState<'spherex' | 'reference'>('spherex');
  const [retryCount, setRetryCount] = useState(0);
  const surveyRef = useRef(survey);
  surveyRef.current = survey;

  const loadSurveyLayer = useCallback((surveyUrl: string) => {
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
    }, []);

    const primaryError = (cause: unknown) => {
      const detail = cause instanceof Error ? cause.message : String(cause);
      setSurveyErrorMsg(`The primary SPHEREx host failed (${detail}). Trying the official mirror…`);
      if (aladinRef.current) {
        aladinRef.current.setBaseImageLayer(createSpherexHiPS(SPHEREX_HIPS_MIRROR_URL, mirrorError));
      }
    };

    try {
      aladin.setBaseImageLayer(createSpherexHiPS(SPHEREX_HIPS_URL, primaryError));
      setSurveyErrorMsg(null);
    } catch (error) {
      primaryError(error);
    }
  };

  const initializeViewer = useCallback(async () => {
    const initializationId = ++initializationIdRef.current;
    const isCurrentInitialization = () => initializationId === initializationIdRef.current;
    setStatus('loading');
    setInitErrorMsg(null);
    setInitDiagnostic(null);
    setSurveyErrorMsg(null);

    if (containerRef.current) containerRef.current.innerHTML = '';
    aladinRef.current = null;

    try {
      const testCanvas = document.createElement('canvas');
      if (!testCanvas.getContext('webgl2')) {
        throw new Error(
          'WebGL 2.0 is not supported or is disabled in your browser. Aladin Lite requires WebGL 2.0 to render the sky map.'
        );
      }
      if (!A?.init) {
        throw new Error('Aladin Lite did not expose its initialization promise. Verify the aladin-lite package.');
      }

      try {
        await A.init;
      } catch (wasmError) {
        const detail = wasmError instanceof Error ? wasmError.message : String(wasmError);
        throw new Error(`Aladin Lite WebAssembly initialization failed: ${detail}`);
      }
      if (!isCurrentInitialization()) return;

      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!isCurrentInitialization()) return;
      if (!containerRef.current) return;
      if (containerRef.current.clientWidth < 2 || containerRef.current.clientHeight < 2) {
        throw new Error('The sky map has no measurable size. Close and reopen the atlas, then retry.');
      }

      containerRef.current.id = containerId;
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
        showLayersControl: false,
        showFullscreenControl: false,
        showGotoControl: false,
      });

      if (!aladin) throw new Error('Aladin Lite could not create the sky map.');

      aladin.setDefaultColor('#A30000');
      aladin.setCooGrid({ enabled: true, color: '#A30000', opacity: 0.42, labelSize: 10 });
      aladinRef.current = aladin;
      setStatus('ready');
      loadSurveyLayer(targetSurvey);
    } catch (error) {
      if (!isCurrentInitialization()) return;
      console.error('[Sferavis Aladin Lite Init Error]', error);
      setStatus('init-error');
      setInitErrorMsg(error instanceof Error ? error.message : String(error));
      setInitDiagnostic(
        'Check browser graphics acceleration and WebAssembly support, then retry the atlas.'
      );
    }
  }, [containerId, loadSurveyLayer]);

  useEffect(() => {
    void initializeViewer();
    return () => {
      initializationIdRef.current += 1;
      aladinRef.current = null;
    };
  }, [initializeViewer, retryCount]);

  useEffect(() => {
    const aladin = aladinRef.current;
    if (status !== 'ready' || !aladin) return;

    const requestId = ++analysisRequestIdRef.current;
    const removePreviousLayers = () => {
      for (const layer of analysisLayersRef.current) aladin.removeOverlay(layer);
      analysisLayersRef.current = [];
    };

    removePreviousLayers();
    setAnalysisError(null);
    setSelectedAnalysisSource(null);

    void Promise.all([
      loadAnalysisDataset('tracklets-known-check'),
      loadAnalysisDataset('tracklet-members'),
    ])
      .then(([trackletTable, memberTable]) => {
        if (analysisRequestIdRef.current !== requestId || aladinRef.current !== aladin) return;

        const tracklets = trackletTable.rows;
        const addTrackletCatalog = (known: boolean) => {
          const rows = tracklets.filter((row) => (row.known_status === 'known') === known);
          if (rows.length === 0) return;
          const catalog = A.catalog({
            name: known ? 'Known-object tracklets' : 'Unmatched tracklet candidates',
            color: known ? '#f2b84b' : '#f06b6b',
            sourceSize: 10,
            shape: known ? 'rhomb' : 'circle',
            onClick: (source) => setSelectedAnalysisSource(source.data),
          });
          catalog.addSources(rows.flatMap((row) => {
            const ra = Number(row.ra_mid);
            const dec = Number(row.dec_mid);
            if (!Number.isFinite(ra) || !Number.isFinite(dec)) return [];
            return [A.source(ra, dec, {
              Tracklet: row.tracklet_id,
              'Known-object status': row.known_status || 'not supplied',
              'Known-object name': row.known_name || 'No name supplied',
              'Detection count': numberOrNull(row.n_det),
              'Motion rate (arcsec/hour)': numberOrNull(row.rate_arcsec_hr),
              'Position angle (degrees)': numberOrNull(row.pa_deg),
              'Tracklet RMS (arcsec)': numberOrNull(row.rms_arcsec),
              'Mean SNR': numberOrNull(row.mean_snr),
              'Midpoint MJD': numberOrNull(row.mjd_mid),
            })];
          }));
          aladin.addCatalog(catalog);
          analysisLayersRef.current.push(catalog);
        };

        addTrackletCatalog(true);
        addTrackletCatalog(false);

        const trackletIds = new Set(tracklets.map((row) => row.tracklet_id));
        const memberGroups = new Map<string, Array<Record<string, string>>>();
        for (const member of memberTable.rows) {
          if (!trackletIds.has(member.tracklet_id)) continue;
          const group = memberGroups.get(member.tracklet_id) ?? [];
          group.push(member);
          memberGroups.set(member.tracklet_id, group);
        }

        for (const known of [true, false]) {
          const groupTrackletIds = tracklets
            .filter((row) => (row.known_status === 'known') === known)
            .map((row) => row.tracklet_id);
          if (groupTrackletIds.length === 0) continue;

          const color = known ? '#f2b84b' : '#f06b6b';
          const overlay = A.graphicOverlay({
            name: known ? 'Known-object track paths' : 'Unmatched candidate track paths',
            color,
            lineWidth: 2,
          });
          let hasPaths = false;
          for (const trackletId of groupTrackletIds) {
            const coordinates = (memberGroups.get(trackletId) ?? [])
              .sort((left, right) => Number(left.mjd) - Number(right.mjd))
              .flatMap((member) => {
                const ra = Number(member.ra);
                const dec = Number(member.dec);
                return Number.isFinite(ra) && Number.isFinite(dec) ? [[ra, dec] as [number, number]] : [];
              });
            if (coordinates.length < 2) continue;
            overlay.add(A.polyline(coordinates, { color, opacity: 0.8, lineWidth: 2 }));
            hasPaths = true;
          }
          if (hasPaths) {
            aladin.addOverlay(overlay);
            analysisLayersRef.current.push(overlay);
          }
        }
      })
      .catch((error: unknown) => {
        if (analysisRequestIdRef.current !== requestId) return;
        setAnalysisError(error instanceof Error ? error.message : String(error));
      });

    return () => {
      analysisRequestIdRef.current += 1;
      removePreviousLayers();
    };
  }, [status]);

  const handleRetry = () => setRetryCount((current) => current + 1);

  const showReferenceSurvey = () => {
    setSurvey('reference');
    setSurveyErrorMsg(null);
    if (aladinRef.current) loadSurveyLayer(DSS2_HIPS_URL);
    else setRetryCount((current) => current + 1);
  };

  const resetView = () => {
    if (!aladinRef.current) return;
    aladinRef.current.gotoRaDec(INITIAL_RA, INITIAL_DEC);
    aladinRef.current.setFoV(INITIAL_FOV);
    aladinRef.current.setProjection('AIT');
  };

  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#080f20] text-zinc-100 ${className}`}
      aria-label="Interactive sky map"
    >
      <div className="relative min-h-0 flex-1 bg-black">
        <div
          id={containerId}
          ref={containerRef}
          className="aladin-viewport-container absolute inset-0 h-full w-full"
          style={{ width: '100%', height: '100%' }}
        />

        <div
          aria-label="Tracklet legend"
          className="absolute bottom-3 left-3 z-10 flex items-center gap-3 border border-white/15 bg-black/75 px-3 py-2 text-[10px] text-zinc-200"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rotate-45 bg-[#f2b84b]" aria-hidden="true" />
            Known match
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f06b6b]" aria-hidden="true" />
            Candidate
          </span>
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === 'ready' ? 'bg-emerald-400' : status === 'init-error' ? 'bg-red-400' : 'animate-pulse bg-amber-400'
            }`}
            role="status"
            aria-label={status === 'ready' ? 'Map ready' : status === 'init-error' ? 'Map failed to initialize' : 'Map loading'}
          />
          <button
            type="button"
            onClick={resetView}
            className="inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-black/70 text-zinc-200 transition-colors hover:border-[#A30000] hover:text-white"
            aria-label="Reset view to the analyzed field"
            title="Reset view"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {surveyErrorMsg && status === 'ready' && (
          <div role="status" className="absolute left-3 right-14 top-3 z-10 flex items-center justify-between gap-3 border border-amber-900/60 bg-amber-950/85 px-3 py-2 text-xs text-amber-100">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              {surveyErrorMsg}
            </span>
            <button type="button" onClick={() => loadSurveyLayer(survey === 'spherex' ? SPHEREX_HIPS_URL : DSS2_HIPS_URL)} className="shrink-0 underline hover:text-white">
              Retry
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050507]/90 text-zinc-300 backdrop-blur-sm">
            <div className="text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#A30000]" />
              <p className="text-xs text-white">Loading sky…</p>
            </div>
          </div>
        )}

        {status === 'init-error' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050507] px-6 text-center">
            <div className="max-w-lg border border-red-900/60 bg-red-950/20 p-6">
              <AlertTriangle className="mx-auto mb-3 h-6 w-6 text-red-400" aria-hidden="true" />
              <h2 className="text-base font-bold text-red-300">Map failed to load</h2>
              <p className="mt-3 text-xs leading-relaxed text-zinc-300">{initErrorMsg}</p>
              {initDiagnostic && <p className="mt-3 text-left text-xs text-zinc-400">{initDiagnostic}</p>}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={handleRetry} className="flex items-center gap-2 bg-[#A30000] px-4 py-2 text-xs font-bold text-white hover:bg-[#8B0000]">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
                </button>
                <button type="button" onClick={showReferenceSurvey} className="border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs text-zinc-300 hover:text-white">
                  Try DSS2
                </button>
              </div>
            </div>
          </div>
        )}

        {analysisError && (
          <div role="alert" className="absolute bottom-3 left-3 z-10 max-w-lg border border-red-900/60 bg-red-950/85 px-3 py-2 text-xs text-red-100">
            Could not load the tracklet overlay: {analysisError}
          </div>
        )}

        {selectedAnalysisSource && (
          <section
            aria-label="Selected tracklet details"
            className="absolute right-3 top-16 z-10 max-h-[55%] w-[min(19rem,calc(100%-1.5rem))] overflow-y-auto border border-sky-200/20 bg-[#0a1422]/95 p-3 text-white shadow-2xl backdrop-blur-md"
          >
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-sky-100">
                Tracklet {selectedAnalysisSource.Tracklet}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedAnalysisSource(null)}
                aria-label="Close tracklet details"
                className="inline-flex h-7 w-7 items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[9px]">
              {Object.entries(selectedAnalysisSource).map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="min-w-0 break-words font-mono text-zinc-200">{value === null || value === '' ? '—' : String(value)}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        )}
      </div>
    </section>
  );
};
