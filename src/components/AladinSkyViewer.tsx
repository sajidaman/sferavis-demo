import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    A?: {
      init: Promise<void>;
      aladin: (selector: string, options?: Record<string, unknown>) => any;
    };
  }
}

const ALADIN_SCRIPT = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js';

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
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        await loadAladin();
        if (cancelled || !containerRef.current || !window.A) return;

        window.A.aladin(containerRef.current, {
          survey: 'P/DSS2/color',
          target: '0 +0',
          fov: 120,
          projection: 'AIT',
          cooFrame: 'ICRS',
          showCooGrid: true,
          showCooGridControl: true,
          showSimbadPointerControl: true,
          showReticle: true,
          showLayersControl: true,
          showFullscreenControl: false,
        });

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
    };
  }, []);

  return (
    <section className={`relative h-full min-h-[420px] w-full bg-[#050507] ${className}`} aria-label="Interactive Aladin astronomical sky map">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050507] text-zinc-300">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#A30000]" />
            <p className="font-lexend text-xs uppercase tracking-[0.2em]">Connecting to Aladin Sky Atlas</p>
            <p className="mt-2 text-[11px] text-zinc-500">Loading astronomical sky surveys…</p>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050507] px-6 text-center">
          <div className="max-w-md">
            <p className="font-lexend text-sm uppercase tracking-widest text-red-400">Sky atlas unavailable</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 border border-zinc-700 px-4 py-2 text-xs uppercase tracking-wider text-zinc-200 hover:border-[#A30000]"
            >
              Reload Sferavis
            </button>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 z-[5] border border-white/10 bg-black/70 px-3 py-2 backdrop-blur">
        <p className="font-lexend text-[10px] uppercase tracking-[0.18em] text-zinc-200">Aladin Lite · Sky Explorer</p>
        <p className="mt-1 text-[10px] text-zinc-500">DSS2 colour survey · ICRS coordinates</p>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-4 z-[5] max-w-[min(34rem,85%)] border border-white/10 bg-black/70 px-3 py-2 text-[10px] leading-relaxed text-zinc-400 backdrop-blur">
        This view uses the selected archival sky survey. It is not a SPHEREx data layer; SPHEREx imagery and analysis will be connected separately.
      </div>
    </section>
  );
};
