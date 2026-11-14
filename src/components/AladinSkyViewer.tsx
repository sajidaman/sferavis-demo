import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import A, { type AladinCatalog, type AladinGraphicOverlay, type AladinInstance } from 'aladin-lite';
import { AlertTriangle, ChevronDown, ChevronUp, Image as ImageIcon, MessageSquarePlus, Move, RefreshCw, RotateCcw, X } from 'lucide-react';
import { loadAnalysisDataset } from '../data/analysisDatasets';

const SPHEREX_HIPS = 'CDS/P/SPHEREx/QR2/D3';
const DSS2_HIPS = 'P/DSS2/color';
const INITIAL_RA = 180;
const INITIAL_DEC = 0;
const INITIAL_FOV = 0.25;
const TRACKLET_FOV = 0.12;

interface Tracklet {
  id: string;
  ra: number;
  dec: number;
  knownStatus: string;
  knownName: string;
  plotPath: string | null;
  details: Record<string, string | number | boolean | null>;
}

interface ClassificationSuggestion {
  classification: string;
  count: number;
}

function numberOrNull(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function createSpherexHiPS(onError?: (error: unknown) => void) {
  return A.HiPS(SPHEREX_HIPS, {
    name: 'NASA SPHEREx QR2 D3',
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

function createReferenceHiPS(onError?: (error: unknown) => void) {
  return A.HiPS(DSS2_HIPS, {
    name: 'DSS2 color',
    errorCallback: (error: unknown) => onError?.(error),
  });
}

interface AladinSkyViewerProps {
  className?: string;
  isDark: boolean;
}

type ViewerStatus = 'loading' | 'ready' | 'init-error';

export const AladinSkyViewer: React.FC<AladinSkyViewerProps> = ({ className = '', isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLElement>(null);
  const toolPanelRef = useRef<HTMLElement>(null);
  const aladinRef = useRef<AladinInstance | null>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const containerId = `sferavis-aladin-${rawId}`;
  const initializationIdRef = useRef(0);
  const analysisLayersRef = useRef<Array<AladinCatalog | AladinGraphicOverlay>>([]);
  const analysisRequestIdRef = useRef(0);
  const panelDragRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    left: number;
    top: number;
  } | null>(null);
  const toolPanelDragRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    left: number;
    top: number;
  } | null>(null);

  const [status, setStatus] = useState<ViewerStatus>('loading');
  const [initErrorMsg, setInitErrorMsg] = useState<string | null>(null);
  const [initDiagnostic, setInitDiagnostic] = useState<string | null>(null);
  const [surveyErrorMsg, setSurveyErrorMsg] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [tracklets, setTracklets] = useState<Tracklet[]>([]);
  const [selectedTrackletId, setSelectedTrackletId] = useState<string | null>(null);
  const [detailPanelPosition, setDetailPanelPosition] = useState<{ left: number; top: number } | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [openTrackletTool, setOpenTrackletTool] = useState<'plots' | 'suggestions' | null>(null);
  const [isToolPanelExpanded, setIsToolPanelExpanded] = useState(true);
  const [toolPanelPosition, setToolPanelPosition] = useState<{ left: number; top: number } | null>(null);
  const [suggestions, setSuggestions] = useState<ClassificationSuggestion[]>([]);
  const [suggestionsVersion, setSuggestionsVersion] = useState(0);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionSaving, setSuggestionSaving] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState<string | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [classificationInput, setClassificationInput] = useState('');
  const [rationaleInput, setRationaleInput] = useState('');
  const [survey, setSurvey] = useState<'spherex' | 'reference'>('spherex');
  const [retryCount, setRetryCount] = useState(0);
  const surveyRef = useRef(survey);
  surveyRef.current = survey;
  const selectedTracklet = tracklets.find((tracklet) => tracklet.id === selectedTrackletId) ?? null;

  useEffect(() => {
    setSuggestions([]);
    setSuggestionMessage(null);
    setSuggestionError(null);
    setClassificationInput('');
    setRationaleInput('');
    setIsDetailsExpanded(true);
    setOpenTrackletTool(null);
  }, [selectedTrackletId]);

  const loadSurveyLayer = useCallback((nextSurvey: 'spherex' | 'reference') => {
    const aladin = aladinRef.current;
    if (!aladin) return;

    setSurvey(nextSurvey);
    setSurveyErrorMsg(null);
    if (nextSurvey === 'reference') {
      try {
        aladin.setBaseImageLayer(createReferenceHiPS((error) => {
          const detail = error instanceof Error ? error.message : String(error);
          setSurveyErrorMsg(`The DSS2 optical survey could not be loaded. Details: ${detail}`);
        }));
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        setSurveyErrorMsg(`The DSS2 optical survey could not be loaded. Details: ${detail}`);
      }
      return;
    }

    const showReferenceFallback = (cause: unknown) => {
      const detail = cause instanceof Error ? cause.message : String(cause);
      setSurveyErrorMsg(`SPHEREx infrared tiles could not be loaded. Showing the DSS2 optical fallback. Details: ${detail}`);
      try {
        aladinRef.current?.setBaseImageLayer(createReferenceHiPS((fallbackError) => {
          const fallbackDetail = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
          setSurveyErrorMsg(`SPHEREx and the DSS2 fallback could not be loaded. Details: ${detail}; ${fallbackDetail}`);
        }));
      } catch (fallbackError) {
        const fallbackDetail = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        setSurveyErrorMsg(`SPHEREx and the DSS2 fallback could not be loaded. Details: ${detail}; ${fallbackDetail}`);
      }
    };

    try {
      aladin.setBaseImageLayer(createSpherexHiPS(showReferenceFallback));
    } catch (error) {
      showReferenceFallback(error);
    }
  }, []);

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
      const aladin = A.aladin(`#${containerId}`, {
        survey: DSS2_HIPS,
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
      loadSurveyLayer(surveyRef.current);
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
    setTracklets([]);
    setSelectedTrackletId(null);

    void Promise.all([
      loadAnalysisDataset('tracklets-known-check'),
      loadAnalysisDataset('tracklet-members'),
    ])
      .then(([trackletTable, memberTable]) => {
        if (analysisRequestIdRef.current !== requestId || aladinRef.current !== aladin) return;

        const trackletRows = trackletTable.rows;
        const mappedTracklets = trackletRows.flatMap((row): Tracklet[] => {
          const ra = numberOrNull(row.ra_mid);
          const dec = numberOrNull(row.dec_mid);
          const id = row.tracklet_id?.trim();
          if (!id || ra === null || dec === null) return [];
          const numericId = Number(id);
          return [{
            id,
            ra,
            dec,
            knownStatus: row.known_status || 'unknown',
            knownName: row.known_name || '',
            plotPath: Number.isInteger(numericId)
              ? `${import.meta.env.BASE_URL}data/analyzed/diagnostics/candidate_${String(numericId).padStart(4, '0')}.png`
              : null,
            details: {
              Tracklet: id,
              'Object type': 'Not provided in the supplied data',
              'Known-object status': row.known_status || 'not supplied',
              'Known-object name': row.known_name || 'No name supplied',
              'Detection count': numberOrNull(row.n_det),
              'Motion rate (arcsec/hour)': numberOrNull(row.rate_arcsec_hr),
              'Position angle (degrees)': numberOrNull(row.pa_deg),
              'Tracklet RMS (arcsec)': numberOrNull(row.rms_arcsec),
              'Mean SNR': numberOrNull(row.mean_snr),
              'Midpoint MJD': numberOrNull(row.mjd_mid),
            },
          }];
        });
        setTracklets(mappedTracklets);

        const addTrackletCatalog = (known: boolean) => {
          const rows = trackletRows.filter((row) => (row.known_status === 'known') === known);
          if (rows.length === 0) return;
          const catalog = A.catalog({
            name: known ? 'Known-object tracklets' : 'Unmatched tracklet candidates',
            color: known ? '#f2b84b' : '#f06b6b',
            sourceSize: 10,
            shape: known ? 'rhomb' : 'circle',
            onClick: (source) => setSelectedTrackletId(String(source.data.Tracklet)),
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

        const trackletIds = new Set(trackletRows.map((row) => row.tracklet_id));
        const memberGroups = new Map<string, Array<Record<string, string>>>();
        for (const member of memberTable.rows) {
          if (!trackletIds.has(member.tracklet_id)) continue;
          const group = memberGroups.get(member.tracklet_id) ?? [];
          group.push(member);
          memberGroups.set(member.tracklet_id, group);
        }

        for (const known of [true, false]) {
          const groupTrackletIds = trackletRows
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

  useEffect(() => {
    if (!selectedTracklet) return;
    const aladin = aladinRef.current;
    if (!aladin) return;
    aladin.gotoRaDec(selectedTracklet.ra, selectedTracklet.dec);
    aladin.setFoV(TRACKLET_FOV);
  }, [selectedTracklet]);

  useEffect(() => {
    if (!selectedTrackletId) {
      setSuggestions([]);
      setSuggestionLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadSuggestions = async () => {
      setSuggestionLoading(true);
      setSuggestionError(null);
      const endpoint = new URL(`${import.meta.env.BASE_URL}api/tracklet-verification`, window.location.href);
      endpoint.searchParams.set('trackletId', selectedTrackletId);
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        const result = await response.json() as {
          error?: string;
          suggestions?: ClassificationSuggestion[];
        };
        if (!response.ok) throw new Error(result.error || 'Could not load community suggestions.');
        setSuggestions(Array.isArray(result.suggestions) ? result.suggestions : []);
      } catch (error) {
        if (controller.signal.aborted) return;
        setSuggestionError(error instanceof Error ? error.message : String(error));
      } finally {
        if (!controller.signal.aborted) setSuggestionLoading(false);
      }
    };

    void loadSuggestions();
    return () => controller.abort();
  }, [selectedTrackletId, suggestionsVersion]);

  useEffect(() => {
    if (!openTrackletTool) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenTrackletTool(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openTrackletTool]);

  useEffect(() => {
    if (!openTrackletTool) return;
    setToolPanelPosition(null);
    setIsToolPanelExpanded(true);
  }, [openTrackletTool]);

  const submitClassificationSuggestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTracklet || suggestionSaving) return;
    setSuggestionSaving(true);
    setSuggestionError(null);
    setSuggestionMessage(null);

    try {
      const voterKey = `sferavis-tracklet-voter-${selectedTracklet.id}`;
      let voterId = localStorage.getItem(voterKey);
      if (!voterId) {
        voterId = crypto.randomUUID();
        localStorage.setItem(voterKey, voterId);
      }

      const endpoint = new URL(`${import.meta.env.BASE_URL}api/tracklet-verification`, window.location.href);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackletId: selectedTracklet.id,
          classification: classificationInput.trim(),
          rationale: rationaleInput.trim(),
          voterId,
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not save your suggestion.');

      setSuggestionMessage('Your community suggestion was saved. The object remains unclassified pending an AI prediction.');
      setSuggestionsVersion((version) => version + 1);
    } catch (error) {
      setSuggestionError(error instanceof Error ? error.message : String(error));
    } finally {
      setSuggestionSaving(false);
    }
  };

  const handleRetry = () => setRetryCount((current) => current + 1);

  const showReferenceSurvey = () => {
    if (aladinRef.current) loadSurveyLayer('reference');
    else {
      setSurvey('reference');
      setRetryCount((current) => current + 1);
    }
  };

  const resetView = () => {
    if (!aladinRef.current) return;
    aladinRef.current.gotoRaDec(INITIAL_RA, INITIAL_DEC);
    aladinRef.current.setFoV(INITIAL_FOV);
    aladinRef.current.setProjection('AIT');
  };

  const clampDetailPanelPosition = useCallback((left: number, top: number) => {
    const viewport = containerRef.current;
    const panel = detailPanelRef.current;
    if (!viewport || !panel) return { left, top };
    return {
      left: Math.max(0, Math.min(left, viewport.clientWidth - panel.offsetWidth)),
      top: Math.max(0, Math.min(top, viewport.clientHeight - panel.offsetHeight)),
    };
  }, []);

  const startPanelDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const panel = detailPanelRef.current;
    const viewport = containerRef.current;
    if (!panel || !viewport) return;

    const panelRect = panel.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const position = detailPanelPosition ?? {
      left: panelRect.left - viewportRect.left,
      top: panelRect.top - viewportRect.top,
    };
    panelDragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      ...position,
    };
    setDetailPanelPosition(position);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const movePanelDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = panelDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setDetailPanelPosition(clampDetailPanelPosition(
      drag.left + event.clientX - drag.clientX,
      drag.top + event.clientY - drag.clientY,
    ));
  };

  const finishPanelDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (panelDragRef.current?.pointerId !== event.pointerId) return;
    panelDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const movePanelWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const movements: Record<string, [number, number]> = {
      ArrowUp: [0, -16],
      ArrowDown: [0, 16],
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
    };
    const movement = movements[event.key];
    if (!movement) return;
    const panel = detailPanelRef.current;
    const viewport = containerRef.current;
    if (!panel || !viewport) return;

    event.preventDefault();
    const panelRect = panel.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const position = detailPanelPosition ?? {
      left: panelRect.left - viewportRect.left,
      top: panelRect.top - viewportRect.top,
    };
    setDetailPanelPosition(clampDetailPanelPosition(
      position.left + movement[0],
      position.top + movement[1],
    ));
  };

  const clampToolPanelPosition = useCallback((left: number, top: number) => {
    const viewport = containerRef.current;
    const panel = toolPanelRef.current;
    if (!viewport || !panel) return { left, top };
    return {
      left: Math.max(0, Math.min(left, viewport.clientWidth - panel.offsetWidth)),
      top: Math.max(0, Math.min(top, viewport.clientHeight - panel.offsetHeight)),
    };
  }, []);

  const startToolPanelDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const panel = toolPanelRef.current;
    const viewport = containerRef.current;
    if (!panel || !viewport) return;

    const panelRect = panel.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const position = toolPanelPosition ?? {
      left: panelRect.left - viewportRect.left,
      top: panelRect.top - viewportRect.top,
    };
    toolPanelDragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      ...position,
    };
    setToolPanelPosition(position);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const moveToolPanelDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = toolPanelDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setToolPanelPosition(clampToolPanelPosition(
      drag.left + event.clientX - drag.clientX,
      drag.top + event.clientY - drag.clientY,
    ));
  };

  const finishToolPanelDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (toolPanelDragRef.current?.pointerId !== event.pointerId) return;
    toolPanelDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const moveToolPanelWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const movements: Record<string, [number, number]> = {
      ArrowUp: [0, -16],
      ArrowDown: [0, 16],
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
    };
    const movement = movements[event.key];
    if (!movement) return;
    const panel = toolPanelRef.current;
    const viewport = containerRef.current;
    if (!panel || !viewport) return;

    event.preventDefault();
    const panelRect = panel.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const position = toolPanelPosition ?? {
      left: panelRect.left - viewportRect.left,
      top: panelRect.top - viewportRect.top,
    };
    setToolPanelPosition(clampToolPanelPosition(
      position.left + movement[0],
      position.top + movement[1],
    ));
  };

  useEffect(() => {
    if (!detailPanelPosition) return;
    const clampPanel = () => {
      setDetailPanelPosition((position) => (
        position ? clampDetailPanelPosition(position.left, position.top) : null
      ));
    };
    window.addEventListener('resize', clampPanel);
    return () => window.removeEventListener('resize', clampPanel);
  }, [detailPanelPosition, clampDetailPanelPosition]);

  useEffect(() => {
    if (!toolPanelPosition) return;
    const clampPanel = () => {
      setToolPanelPosition((position) => (
        position ? clampToolPanelPosition(position.left, position.top) : null
      ));
    };
    window.addEventListener('resize', clampPanel);
    return () => window.removeEventListener('resize', clampPanel);
  }, [toolPanelPosition, clampToolPanelPosition]);

  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden ${
        isDark ? 'bg-[#080f20] text-zinc-100' : 'bg-slate-100 text-slate-900'
      } ${className}`}
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
          className={`absolute bottom-3 left-3 z-10 flex items-center gap-3 border px-3 py-2 text-[10px] ${
            isDark ? 'border-white/15 bg-black/75 text-zinc-200' : 'border-slate-300 bg-white/90 text-slate-700'
          }`}
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

        <div className="absolute left-3 top-16 z-10">
          <label htmlFor={`${containerId}-tracklet`} className="sr-only">Select a tracklet</label>
          <select
            id={`${containerId}-tracklet`}
            value={selectedTrackletId ?? ''}
            onChange={(event) => setSelectedTrackletId(event.target.value || null)}
            disabled={tracklets.length === 0}
            className={`max-w-[min(18rem,calc(100vw-2rem))] border px-3 py-2 text-xs shadow-lg disabled:opacity-70 ${
              isDark
                ? 'border-white/20 bg-black/80 text-zinc-100'
                : 'border-slate-300 bg-white/95 text-slate-800'
            }`}
          >
            <option value="">Select a tracklet ({tracklets.length})</option>
            {tracklets.map((tracklet) => (
              <option key={tracklet.id} value={tracklet.id}>
                Tracklet {tracklet.id}{tracklet.knownName ? ` - ${tracklet.knownName}` : ` - ${tracklet.knownStatus}`}
              </option>
            ))}
          </select>
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
            className={`inline-flex h-9 w-9 items-center justify-center border transition-colors hover:border-[#A30000] ${
              isDark
                ? 'border-white/15 bg-black/70 text-zinc-200 hover:text-white'
                : 'border-slate-300 bg-white/90 text-slate-700 hover:text-slate-950'
            }`}
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
            <button type="button" onClick={() => loadSurveyLayer(survey)} className="shrink-0 underline hover:text-white">
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

        {selectedTracklet && (
          <section
            ref={detailPanelRef}
            aria-label="Selected tracklet details"
            style={detailPanelPosition ? { left: detailPanelPosition.left, top: detailPanelPosition.top } : undefined}
            className={`absolute z-10 w-[min(22rem,calc(100%-1.5rem))] border p-3 shadow-2xl backdrop-blur-md ${
              detailPanelPosition ? '' : 'right-3 top-16'
            } ${
              isDark
                ? 'border-sky-200/20 bg-[#0a1422]/95 text-white'
                : 'border-slate-300 bg-white/95 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between gap-2 ${
              isDetailsExpanded ? `mb-2 border-b pb-2 ${isDark ? 'border-white/10' : 'border-slate-200'}` : ''
            }`}>
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Move details panel; drag or use arrow keys"
                  title="Drag to move; arrow keys also move the panel"
                  onPointerDown={startPanelDrag}
                  onPointerMove={movePanelDrag}
                  onPointerUp={finishPanelDrag}
                  onPointerCancel={finishPanelDrag}
                  onKeyDown={movePanelWithKeyboard}
                  className={`touch-none cursor-move rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${
                    isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Move className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <h2 className={`truncate text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-sky-100' : 'text-slate-800'
                }`}>
                  Tracklet {selectedTracklet.id}
                </h2>
              </div>
              <div className="flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => setIsDetailsExpanded((expanded) => !expanded)}
                  aria-label={isDetailsExpanded ? 'Collapse tracklet details' : 'Expand tracklet details'}
                  aria-expanded={isDetailsExpanded}
                  aria-controls={`${containerId}-tracklet-details`}
                  title={isDetailsExpanded ? 'Collapse details' : 'Expand details'}
                  className={`inline-flex h-7 w-7 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${
                    isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {isDetailsExpanded
                    ? <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTrackletId(null)}
                  aria-label="Close tracklet details"
                  className={`inline-flex h-7 w-7 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${
                    isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              id={`${containerId}-tracklet-details`}
              hidden={!isDetailsExpanded}
              className="max-h-[55vh] overflow-y-auto"
            >
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[9px]">
                  {Object.entries(selectedTracklet.details).map(([label, value]) => (
                    <React.Fragment key={label}>
                      <dt className={isDark ? 'text-zinc-500' : 'text-slate-500'}>{label}</dt>
                      <dd className={`min-w-0 break-words font-mono ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                        {value === null || value === '' ? '—' : String(value)}
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
                <div className={`mt-3 grid grid-cols-2 gap-2 border-t pt-3 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <button
                    type="button"
                    disabled={!selectedTracklet.plotPath}
                    onClick={() => {
                      setToolPanelPosition(null);
                      setIsToolPanelExpanded(true);
                      setOpenTrackletTool('plots');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#A30000] px-2 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#8B0000] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    View plots
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setToolPanelPosition(null);
                      setIsToolPanelExpanded(true);
                      setOpenTrackletTool('suggestions');
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 border px-2 py-2 text-[10px] font-semibold transition-colors ${
                      isDark
                        ? 'border-white/20 text-zinc-100 hover:bg-white/10'
                        : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
                    Community input
                  </button>
                </div>
            </div>
          </section>
        )}

        {selectedTracklet && openTrackletTool === 'plots' && selectedTracklet.plotPath && (
          <>
            <div aria-hidden="true" className="absolute inset-0 z-20 bg-black/40" />
            <section
              ref={toolPanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${containerId}-plots-title`}
              style={toolPanelPosition ? { left: toolPanelPosition.left, top: toolPanelPosition.top } : undefined}
              className={`absolute z-30 flex max-h-[calc(100%-2rem)] w-[min(60rem,calc(100%-2rem))] flex-col overflow-hidden border shadow-2xl ${
                toolPanelPosition ? '' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              } ${
              isDark ? 'border-slate-600 bg-[#0a1422] text-white' : 'border-slate-300 bg-white text-slate-900'
              }`}
            >
              <header className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${
              isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Move plot panel; drag or use arrow keys"
                    title="Drag to move; arrow keys also move the panel"
                    onPointerDown={startToolPanelDrag}
                    onPointerMove={moveToolPanelDrag}
                    onPointerUp={finishToolPanelDrag}
                    onPointerCancel={finishToolPanelDrag}
                    onKeyDown={moveToolPanelWithKeyboard}
                    className={`touch-none cursor-move rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${
                      isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Move className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <h2 id={`${containerId}-plots-title`} className="truncate text-sm font-semibold">
                    Diagnostic plot — Tracklet {selectedTracklet.id}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => setIsToolPanelExpanded((expanded) => !expanded)}
                    aria-label={isToolPanelExpanded ? 'Collapse plot panel' : 'Expand plot panel'}
                    aria-expanded={isToolPanelExpanded}
                    aria-controls={`${containerId}-plots-content`}
                    title={isToolPanelExpanded ? 'Collapse panel' : 'Expand panel'}
                    className={`inline-flex h-8 w-8 items-center justify-center ${
                      isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {isToolPanelExpanded
                      ? <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenTrackletTool(null)}
                    aria-label="Close diagnostic plot"
                    className={`inline-flex h-8 w-8 items-center justify-center ${
                      isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </header>
              <div
                id={`${containerId}-plots-content`}
                hidden={!isToolPanelExpanded}
                className="max-h-[80vh] overflow-auto p-4"
              >
                <img
                  src={selectedTracklet.plotPath}
                  alt={`Diagnostic plot for tracklet ${selectedTracklet.id}`}
                  className="mx-auto block h-auto max-h-[76vh] w-full object-contain"
                />
                <p className={`mt-3 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  This supplied diagnostic plot is not a SPHEREx infrared image.
                </p>
              </div>
            </section>
          </>
        )}

        {selectedTracklet && openTrackletTool === 'suggestions' && (
          <>
            <div aria-hidden="true" className="absolute inset-0 z-20 bg-black/40" />
            <section
              ref={toolPanelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${containerId}-suggestions-title`}
              style={toolPanelPosition ? { left: toolPanelPosition.left, top: toolPanelPosition.top } : undefined}
              className={`absolute z-30 flex max-h-[calc(100%-2rem)] w-[min(26rem,calc(100%-2rem))] flex-col overflow-hidden border shadow-2xl ${
                toolPanelPosition ? '' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              } ${
              isDark ? 'border-slate-600 bg-[#0a1422] text-white' : 'border-slate-300 bg-white text-slate-900'
              }`}
            >
              <header className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${
              isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Move community input panel; drag or use arrow keys"
                    title="Drag to move; arrow keys also move the panel"
                    onPointerDown={startToolPanelDrag}
                    onPointerMove={moveToolPanelDrag}
                    onPointerUp={finishToolPanelDrag}
                    onPointerCancel={finishToolPanelDrag}
                    onKeyDown={moveToolPanelWithKeyboard}
                    className={`touch-none cursor-move rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${
                      isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Move className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <h2 id={`${containerId}-suggestions-title`} className="truncate text-sm font-semibold">
                    Community input — Tracklet {selectedTracklet.id}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => setIsToolPanelExpanded((expanded) => !expanded)}
                    aria-label={isToolPanelExpanded ? 'Collapse community input panel' : 'Expand community input panel'}
                    aria-expanded={isToolPanelExpanded}
                    aria-controls={`${containerId}-suggestions-content`}
                    title={isToolPanelExpanded ? 'Collapse panel' : 'Expand panel'}
                    className={`inline-flex h-8 w-8 items-center justify-center ${
                      isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {isToolPanelExpanded
                      ? <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenTrackletTool(null)}
                    aria-label="Close community input"
                    className={`inline-flex h-8 w-8 items-center justify-center ${
                      isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </header>
              <div
                id={`${containerId}-suggestions-content`}
                hidden={!isToolPanelExpanded}
                className="overflow-y-auto p-4"
              >
                <p className={`text-xs leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
                }`}>
                  No AI prediction is available for this object. Share a provisional interpretation; it will not change the unclassified status.
                </p>
                {suggestionLoading ? (
                  <p className={`mt-3 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} role="status">
                    Loading public suggestions…
                  </p>
                ) : suggestions.length > 0 ? (
                  <ul className={`mt-3 space-y-2 border-y py-3 text-xs ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                  }`} aria-label="Community classification suggestions">
                    {suggestions.map((suggestion) => (
                      <li key={suggestion.classification} className="flex items-center justify-between gap-2">
                        <span className="min-w-0 break-words">{suggestion.classification}</span>
                        <span className={`shrink-0 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          {suggestion.count} {suggestion.count === 1 ? 'suggestion' : 'suggestions'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : !suggestionLoading && !suggestionError ? (
                  <p className={`mt-3 border-y py-3 text-xs ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                    No suggestions yet.
                  </p>
                ) : null}
                <form className="mt-4 space-y-3" onSubmit={submitClassificationSuggestion}>
                  <label className="sr-only" htmlFor={`${containerId}-classification`}>Your suggested object type</label>
                  <input
                    id={`${containerId}-classification`}
                    value={classificationInput}
                    onChange={(event) => setClassificationInput(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                    placeholder="Your suggested type (e.g. asteroid)"
                    className={`w-full border px-3 py-2 text-sm ${
                    isDark
                      ? 'border-white/15 bg-black/30 text-zinc-100 placeholder:text-zinc-500'
                      : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                  <label className="sr-only" htmlFor={`${containerId}-rationale`}>Reasoning for your suggestion</label>
                  <textarea
                    id={`${containerId}-rationale`}
                    value={rationaleInput}
                    onChange={(event) => setRationaleInput(event.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Optional reasoning based on the plot (do not include personal information)"
                    className={`w-full resize-y border px-3 py-2 text-sm ${
                    isDark
                      ? 'border-white/15 bg-black/30 text-zinc-100 placeholder:text-zinc-500'
                      : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={suggestionSaving}
                    className="bg-[#A30000] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#8B0000] disabled:cursor-wait disabled:opacity-60"
                  >
                    {suggestionSaving ? 'Saving…' : 'Submit suggestion'}
                  </button>
                  {suggestionMessage && (
                    <p role="status" className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {suggestionMessage}
                    </p>
                  )}
                  {suggestionError && (
                    <p role="alert" className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      {suggestionError}
                    </p>
                  )}
                </form>
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
};
