import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import A, { type AladinInstance } from 'aladin-lite';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

const SPHEREX_HIPS = 'CDS/P/SPHEREx/QR2/D3';
const SPHEREX_HIPS_URL = 'https://alasky.cds.unistra.fr/SPHEREx/D3';
const SPHEREX_HIPS_MIRROR_URL = 'https://alaskybis.cds.unistra.fr/SPHEREx/D3';
const DSS2_HIPS_URL = 'https://alasky.cds.unistra.fr/DSS/DSSColor';
const INITIAL_RA = 266.414089;
const INITIAL_DEC = -29.006111;
const FULL_SKY_FOV = 360;

function createSpherexHiPS(url: string, onError: (error: unknown) => void) {
  return A.HiPS(SPHEREX_HIPS, {
    name: 'SPHEREx infrared sky',
    url,
    maxOrder: 7,
    minOrder: 0,
    tileSize: 512,
    imgFormat: 'png',
    cooFrame: 'equatorial',
    requestMode: 'cors',
    requestCredentials: 'omit',
    errorCallback: onError,
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
  const containerId = `sferavis-atlas-${rawId}`;
  const initializationIdRef = useRef(0);
  const [status, setStatus] = useState<ViewerStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const initializeViewer = useCallback(async () => {
    const initializationId = ++initializationIdRef.current;
    const isCurrent = () => initializationId === initializationIdRef.current;
    setStatus('loading');
    setErrorMessage(null);
    aladinRef.current = null;

    if (containerRef.current) containerRef.current.innerHTML = '';

    try {
      if (!A || !A.init) throw new Error('The Aladin Lite module could not be loaded.');
      await A.init;
      if (!isCurrent()) return;

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      if (!isCurrent() || !containerRef.current) return;

      if (containerRef.current.clientWidth < 2 || containerRef.current.clientHeight < 2) {
        throw new Error('The sky viewport could not be measured. Close and reopen the Atlas.');
      }

      containerRef.current.id = containerId;
      const aladin = A.aladin(`#${containerId}`, {
        survey: DSS2_HIPS_URL,
        target: `${INITIAL_RA} ${INITIAL_DEC}`,
        fov: FULL_SKY_FOV,
        projection: 'AIT',
        cooFrame: 'ICRS',
        showCooGrid: false,
        showCooGridControl: false,
        showSimbadPointerControl: false,
        showReticle: false,
        showLayersControl: false,
        showFullscreenControl: false,
        showGotoControl: false,
      });

      if (!aladin) throw new Error('Aladin Lite could not create the sky viewer.');
      aladin.setDefaultColor('#A30000');
      aladinRef.current = aladin;
      setStatus('ready');

      const tryMirror = (primaryError: unknown) => {
        if (!isCurrent() || !aladinRef.current) return;
        console.warn('[Sferavis Atlas] Primary SPHEREx HiPS host failed; trying mirror.', primaryError);
        try {
          aladinRef.current.setBaseImageLayer(
            createSpherexHiPS(SPHEREX_HIPS_MIRROR_URL, (mirrorError) => {
              if (!isCurrent()) return;
              console.error('[Sferavis Atlas] Both SPHEREx HiPS hosts failed.', mirrorError);
              setErrorMessage('The infrared sky layer is temporarily unavailable. You can still navigate the sky while the service recovers.');
            })
          );
        } catch (mirrorError) {
          console.error('[Sferavis Atlas] SPHEREx mirror could not be initialized.', mirrorError);
          setErrorMessage('The infrared sky layer is temporarily unavailable. You can still navigate the sky while the service recovers.');
        }
      };

      try {
        aladin.setBaseImageLayer(
          createSpherexHiPS(SPHEREX_HIPS_URL, (error) => {
            if (isCurrent()) tryMirror(error);
          })
        );
      } catch (error) {
        tryMirror(error);
      }
    } catch (error) {
      if (!isCurrent()) return;
      console.error('[Sferavis Atlas] Initialization failed.', error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setStatus('init-error');
    }
  }, [containerId]);

  useEffect(() => {
    void initializeViewer();
    return () => {
      initializationIdRef.current += 1;
      aladinRef.current = null;
    };
  }, [initializeViewer, retryCount]);

  const resetSky = () => {
    if (!aladinRef.current) return;
    aladinRef.current.gotoRaDec(INITIAL_RA, INITIAL_DEC);
    aladinRef.current.setFoV(FULL_SKY_FOV);
    aladinRef.current.setProjection('AIT');
  };

  return (
    <section
      className={`relative h-full min-h-0 w-full overflow-hidden bg-[#03050b] ${className}`}
      aria-label="Full-screen Sferavis celestial atlas"
    >
      <div
        id={containerId}
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        style={{ width: '100%', height: '100%' }}
      />

      {status === 'loading' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#03050b] text-zinc-300">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-[#A30000]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white">Opening the sky</p>
          </div>
        </div>
      )}

      {status === 'init-error' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#03050b]/95 px-6 text-center">
          <div className="max-w-md">
            <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-400" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Atlas unavailable</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setRetryCount((value) => value + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/15"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        </div>
      )}

      {status === 'ready' && errorMessage && (
        <div className="absolute bottom-5 left-1/2 z-20 flex max-w-[min(92vw,34rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-amber-200/15 bg-black/75 px-4 py-2 text-xs text-amber-100 shadow-xl backdrop-blur-md">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {status === 'ready' && (
        <button
          type="button"
          onClick={resetSky}
          title="Return to the full-sky view"
          aria-label="Return to the full-sky view"
          className="absolute bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/80 shadow-lg backdrop-blur-md transition hover:border-white/35 hover:bg-black/80 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}
    </section>
  );
};
