import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Image as ImageIcon, Maximize2, MessageSquarePlus, Moon, PanelLeftClose, PanelLeftOpen, RotateCcw, Sun, X, ZoomIn, ZoomOut } from 'lucide-react';
import { loadAnalysisDataset } from '../data/analysisDatasets';
import { SPHEREX_BANDS, SPHEREX_BAND_DESCRIPTIONS, SPHEREX_CHANNELS } from '../data/spherexChannels';
import {
  decodeFitsImage,
  healpixNested,
  percentileRange,
  selectHiPSOrder,
  tilePath,
  type FitsImage,
} from '../lib/hipsSky';
import { InfraSphereSkyRenderer, makeWebGLPatch, type WebGLPatch } from '../lib/infraSphereSkyRenderer';

const SPHEREX_HIPS = 'https://irsa.ipac.caltech.edu/data/hips/SPHEREx/spherex_allsky_cube';
const TWOMASS_HIPS = 'https://irsa.ipac.caltech.edu/data/hips/CDS/2MASS/Color';
const DSS2_HIPS = 'https://irsa.ipac.caltech.edu/data/hips/CDS/DSS2/color';
const DETAIL_MAX_FOV = 0.4;
const DEFAULT_VIEW = { ra: 180, dec: 0, fov: 180, projection: 'AIT' as Projection };
const TILE_ORDER = 5;
const TILE_BITS = 9;
const TILE_PIXEL_COUNT = 1 << (TILE_BITS * 2);
const MAX_CACHE_TILES = 72;
const SIMULATOR_SAMPLES = {
  'simulator-high-latitude': 'high-latitude-cutout.fits',
  'simulator-galactic-plane': 'galactic-plane-cutout.fits',
} as const;
const PROJECTIONS = [
  { value: 'AIT', label: 'All-sky (Aitoff)' },
  { value: 'TAN', label: 'Tangent plane' },
  { value: 'CAR', label: 'Equirectangular' },
  { value: 'STEREO', label: 'Stereographic (InfraSphere)' },
] as const;
type Projection = (typeof PROJECTIONS)[number]['value'];
type Survey = 'spherex' | 'two-mass' | 'reference' | 'simulator-high-latitude' | 'simulator-galactic-plane';
type ColorMap = 'grayscale' | 'magma';

interface SkyView {
  ra: number;
  dec: number;
  fov: number;
  projection: Projection;
}

interface TilePixels {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  lastUsed: number;
}

interface LoadedFits {
  image: FitsImage;
  range: [number, number];
  fieldOfView: number;
}

interface Tracklet {
  id: string;
  ra: number;
  dec: number;
  known: boolean;
  knownStatus: string;
  name: string;
  plotPath: string | null;
  details: Record<string, string | number | boolean | null>;
  path: Array<[number, number]>;
}

interface ClassificationSuggestion {
  classification: string;
  count: number;
}

interface NativeSkyViewerProps {
  className?: string;
  isDark: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleTheme: () => void;
}

const toRadians = (degrees: number) => degrees * Math.PI / 180;
const toDegrees = (radians: number) => radians * 180 / Math.PI;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function numberOrNull(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizedRa(ra: number): number {
  return ((ra % 360) + 360) % 360;
}

function createScreenToSky(view: SkyView, width: number, height: number) {
  const aspect = width / Math.max(1, height);
  const ra0 = toRadians(view.ra);
  const dec0 = toRadians(view.dec);
  const cosRa0 = Math.cos(ra0);
  const sinRa0 = Math.sin(ra0);
  const cosDec0 = Math.cos(dec0);
  const sinDec0 = Math.sin(dec0);
  const tanHalfHeight = Math.tan(toRadians(clamp(view.fov, 0.02, 170)) / 2);
  const carHorizontalFov = Math.min(360, view.fov * aspect);
  const aitHorizontalFov = Math.min(360, view.fov * Math.max(2, aspect * 2));
  const aitHalfHeight = clamp(view.fov, 0.02, 180);

  return (x: number, y: number): [number, number] | null => {
    const nx = (0.5 - x / width) * 2;
    const ny = (0.5 - y / height) * 2;
    let center: number;
    let east: number;
    let north: number;

    if (view.projection === 'TAN') {
      east = nx * aspect * tanHalfHeight;
      north = ny * tanHalfHeight;
      const norm = Math.hypot(1, east, north);
      center = 1 / norm;
      east /= norm;
      north /= norm;
    } else if (view.projection === 'STEREO') {
      const radius = Math.hypot(nx * aspect, ny);
      const angle = 2 * Math.atan(radius * Math.tan(toRadians(view.fov) / 4));
      const scale = radius > 1e-9 ? Math.sin(angle) / radius : 0;
      center = Math.cos(angle);
      east = nx * aspect * scale;
      north = ny * scale;
    } else if (view.projection === 'CAR') {
      const longitude = nx * toRadians(carHorizontalFov / 2);
      const latitude = ny * toRadians(clamp(view.fov, 0.02, 180) / 2);
      const cosLatitude = Math.cos(latitude);
      center = cosLatitude * Math.cos(longitude);
      east = cosLatitude * Math.sin(longitude);
      north = Math.sin(latitude);
    } else {
      const mapX = nx * 2 * Math.SQRT2 * aitHorizontalFov / 360;
      const mapY = ny * Math.SQRT2 * aitHalfHeight / 180;
      const zSquared = 1 - mapX * mapX / 16 - mapY * mapY / 4;
      if (zSquared < 0) return null;
      const z = Math.sqrt(zSquared);
      const longitudeA = z * mapX;
      const longitudeB = 2 * (2 * z * z - 1);
      const longitudeNorm = longitudeA * longitudeA + longitudeB * longitudeB;
      const cosLongitude = longitudeNorm > 0
        ? (longitudeB * longitudeB - longitudeA * longitudeA) / longitudeNorm
        : 1;
      const sinLongitude = longitudeNorm > 0
        ? 2 * longitudeA * longitudeB / longitudeNorm
        : 0;
      north = clamp(z * mapY, -1, 1);
      const cosLatitude = Math.sqrt(1 - north * north);
      center = cosLatitude * cosLongitude;
      east = cosLatitude * sinLongitude;
    }

    const x3 = center * cosDec0 * cosRa0 - east * sinRa0 - north * sinDec0 * cosRa0;
    const y3 = center * cosDec0 * sinRa0 + east * cosRa0 - north * sinDec0 * sinRa0;
    const z3 = center * sinDec0 + north * cosDec0;
    return [normalizedRa(toDegrees(Math.atan2(y3, x3))), toDegrees(Math.asin(clamp(z3, -1, 1)))];
  };
}

function screenToSky(view: SkyView, x: number, y: number, width: number, height: number): [number, number] | null {
  return createScreenToSky(view, width, height)(x, y);
}

function skyToScreen(view: SkyView, ra: number, dec: number, width: number, height: number): [number, number] | null {
  const raRad = toRadians(ra);
  const decRad = toRadians(dec);
  const centerRa = toRadians(view.ra);
  const centerDec = toRadians(view.dec);
  const cosDec = Math.cos(decRad);
  const x = cosDec * Math.cos(raRad);
  const y = cosDec * Math.sin(raRad);
  const z = Math.sin(decRad);
  const center = x * Math.cos(centerDec) * Math.cos(centerRa)
    + y * Math.cos(centerDec) * Math.sin(centerRa) + z * Math.sin(centerDec);
  const east = -x * Math.sin(centerRa) + y * Math.cos(centerRa);
  const north = -x * Math.sin(centerDec) * Math.cos(centerRa)
    - y * Math.sin(centerDec) * Math.sin(centerRa) + z * Math.cos(centerDec);
  const aspect = width / Math.max(1, height);
  let nx: number;
  let ny: number;

  if (view.projection === 'TAN') {
    if (center <= 0) return null;
    const halfHeight = Math.tan(toRadians(clamp(view.fov, 0.02, 170)) / 2);
    nx = -east / center / (aspect * halfHeight);
    ny = north / center / halfHeight;
  } else if (view.projection === 'STEREO') {
    const angle = Math.acos(clamp(center, -1, 1));
    if (angle > Math.PI * 0.97) return null;
    const radius = 2 * Math.tan(angle / 2);
    const scale = height / (2 * Math.tan(toRadians(view.fov) / 4));
    const tangent = Math.hypot(east, north);
    if (tangent < 1e-9) return [width / 2, height / 2];
    return [
      width / 2 - east / tangent * radius * scale,
      height / 2 - north / tangent * radius * scale,
    ];
  } else {
    const longitude = Math.atan2(east, center);
    const latitude = Math.atan2(north, Math.hypot(center, east));
    if (view.projection === 'CAR') {
      const horizontalFov = Math.min(360, view.fov * aspect);
      nx = -longitude / toRadians(horizontalFov / 2);
      ny = latitude / toRadians(clamp(view.fov, 0.02, 180) / 2);
    } else {
      const denominator = Math.sqrt(1 + Math.cos(latitude) * Math.cos(longitude / 2));
      if (denominator < 1e-10) return null;
      const mapX = 2 * Math.SQRT2 * Math.cos(latitude) * Math.sin(longitude / 2) / denominator;
      const mapY = Math.SQRT2 * Math.sin(latitude) / denominator;
      const horizontalFov = Math.min(360, view.fov * Math.max(2, aspect * 2));
      nx = -mapX / (2 * Math.SQRT2 * horizontalFov / 360);
      ny = mapY / (Math.SQRT2 * clamp(view.fov, 0.02, 180) / 180);
    }
  }

  if (Math.abs(nx) > 1 || Math.abs(ny) > 1) return null;
  return [(0.5 + nx / 2) * width, (0.5 - ny / 2) * height];
}

function tileKey(survey: Survey, frame: number, order: number, pixel: number): string {
  return `${survey}:${frame}:${order}:${pixel}`;
}

function isBlankFrame(frame: number): boolean {
  return frame === 50 || frame === 51;
}

export const NativeSkyViewer: React.FC<NativeSkyViewerProps> = ({
  className = '',
  isDark,
  isFullscreen,
  onToggleFullscreen,
  onToggleTheme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skyCanvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<InfraSphereSkyRenderer | null>(null);
  const viewRef = useRef<SkyView>(DEFAULT_VIEW);
  const cacheRef = useRef(new Map<string, TilePixels>());
  const tileAbortRef = useRef<AbortController | null>(null);
  const detailAbortRef = useRef<AbortController | null>(null);
  const detailRef = useRef<LoadedFits | null>(null);
  const simulatorImageRef = useRef<LoadedFits | null>(null);
  const detailPatchRef = useRef<{ loaded: LoadedFits; colormap: ColorMap; patch: WebGLPatch } | null>(null);
  const generationRef = useRef(0);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startView: SkyView;
    view: SkyView;
    moved: boolean;
  } | null>(null);
  const isInteractingRef = useRef(false);
  const interactionTimerRef = useRef<number | null>(null);
  const zoomScaleRef = useRef(1);
  const [view, setView] = useState<SkyView>(DEFAULT_VIEW);
  const [survey, setSurvey] = useState<Survey>('spherex');
  const [frame, setFrame] = useState(43);
  const [colormap, setColormap] = useState<ColorMap>('magma');
  const [showGrid, setShowGrid] = useState(true);
  const [showReticle, setShowReticle] = useState(true);
  const [isSimbadPointerActive, setIsSimbadPointerActive] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tileError, setTileError] = useState<string | null>(null);
  const [rendererError, setRendererError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [detailMessage, setDetailMessage] = useState('Zoom in to 0.4° or closer to load observed exposure detail.');
  const [tracklets, setTracklets] = useState<Tracklet[]>([]);
  const [selectedTrackletId, setSelectedTrackletId] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [openTrackletTool, setOpenTrackletTool] = useState<'plots' | 'suggestions' | null>(null);
  const [suggestions, setSuggestions] = useState<ClassificationSuggestion[]>([]);
  const [suggestionsVersion, setSuggestionsVersion] = useState(0);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionSaving, setSuggestionSaving] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState<string | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [classificationInput, setClassificationInput] = useState('');
  const [rationaleInput, setRationaleInput] = useState('');
  const [renderVersion, setRenderVersion] = useState(0);

  viewRef.current = view;
  const selectedChannel = SPHEREX_CHANNELS[frame - 1];
  const selectedTracklet = tracklets.find((item) => item.id === selectedTrackletId) ?? null;

  const requestRender = useCallback(() => {
    setRenderVersion((version) => version + 1);
  }, []);

  const updateView = useCallback((nextView: SkyView) => {
    viewRef.current = nextView;
    setView(nextView);
  }, []);

  const beginInteraction = useCallback(() => {
    if (interactionTimerRef.current !== null) {
      window.clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
    if (isInteractingRef.current) return;
    isInteractingRef.current = true;
    const canvas = canvasRef.current;
    const skyCanvas = skyCanvasRef.current;
    if (canvas) {
      canvas.style.willChange = 'transform';
      canvas.style.transformOrigin = 'center';
    }
    if (skyCanvas) {
      skyCanvas.style.willChange = 'transform';
      skyCanvas.style.transformOrigin = 'center';
    }
  }, []);

  const finishInteraction = useCallback(() => {
    if (interactionTimerRef.current !== null) {
      window.clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = null;
    }
    isInteractingRef.current = false;
    zoomScaleRef.current = 1;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transform = '';
      canvas.style.willChange = '';
    }
    const skyCanvas = skyCanvasRef.current;
    if (skyCanvas) {
      skyCanvas.style.transform = '';
      skyCanvas.style.willChange = '';
    }
    requestRender();
  }, [requestRender]);

  useEffect(() => {
    setAnalysisError(null);
    let active = true;
    void Promise.all([
      loadAnalysisDataset('tracklets-known-check'),
      loadAnalysisDataset('tracklet-members'),
    ]).then(([catalog, members]) => {
      if (!active) return;
      const paths = new Map<string, Array<{ ra: number; dec: number; mjd: number }>>();
      for (const member of members.rows) {
        const ra = Number(member.ra);
        const dec = Number(member.dec);
        if (!member.tracklet_id || !Number.isFinite(ra) || !Number.isFinite(dec)) continue;
        const path = paths.get(member.tracklet_id) ?? [];
        path.push({ ra, dec, mjd: Number(member.mjd) || 0 });
        paths.set(member.tracklet_id, path);
      }
      setTracklets(catalog.rows.flatMap((row): Tracklet[] => {
        const ra = Number(row.ra_mid);
        const dec = Number(row.dec_mid);
        const id = row.tracklet_id?.trim();
        if (!id || !Number.isFinite(ra) || !Number.isFinite(dec)) return [];
        const numericId = Number(id);
        return [{
          id,
          ra,
          dec,
          known: row.known_status === 'known',
          knownStatus: row.known_status || 'unknown',
          name: row.known_name || '',
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
          path: (paths.get(id) ?? [])
            .sort((left, right) => left.mjd - right.mjd)
            .map(({ ra: pathRa, dec: pathDec }): [number, number] => [pathRa, pathDec]),
        }];
      }));
    }).catch((error: unknown) => {
      if (active) setAnalysisError(error instanceof Error ? error.message : String(error));
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setSuggestionMessage(null);
    setSuggestionError(null);
    setClassificationInput('');
    setRationaleInput('');
    setOpenTrackletTool(null);
  }, [selectedTrackletId]);

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
        const result = await response.json() as { error?: string; suggestions?: ClassificationSuggestion[] };
        if (!response.ok) throw new Error(result.error || 'Could not load community suggestions.');
        setSuggestions(Array.isArray(result.suggestions) ? result.suggestions : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestionError(error instanceof Error ? error.message : String(error));
        }
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

  const visibleTiles = useCallback((width: number, height: number, currentView: SkyView, currentSurvey: Survey, currentFrame: number) => {
    const order = selectHiPSOrder(currentView.fov, height, currentSurvey === 'spherex' ? TILE_ORDER : 8);
    const keys = new Map<number, Set<number>>();
    const pixelToSky = createScreenToSky(currentView, width, height);
    for (let y = -24; y <= height + 24; y += 24) {
      for (let x = -24; x <= width + 24; x += 24) {
        const position = pixelToSky(x, y);
        if (!position) continue;
        const nestedPixel = healpixNested(order + TILE_BITS, position[0], position[1]);
        for (let tileOrder = 0; tileOrder <= order; tileOrder += 1) {
          const parentPixel = Math.floor(nestedPixel / 2 ** (2 * (order - tileOrder)) / TILE_PIXEL_COUNT);
          const group = keys.get(tileOrder) ?? new Set<number>();
          group.add(parentPixel);
          keys.set(tileOrder, group);
        }
      }
    }
    return { order, keys, frameIndex: currentSurvey === 'spherex' ? currentFrame - 1 : 0 };
  }, []);

  const loadTiles = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = Math.max(1, canvas.width);
    const height = Math.max(1, canvas.height);
    const currentView = viewRef.current;
    const currentSurvey = survey;
    const currentFrame = frame;
    if (currentSurvey in SIMULATOR_SAMPLES) {
      return;
    }
    setTileError(null);
    const { keys, frameIndex } = visibleTiles(width, height, currentView, currentSurvey, currentFrame);
    const visibleAt = Date.now();
    for (const [order, pixels] of keys) {
      for (const pixel of pixels) {
        const cached = cacheRef.current.get(tileKey(currentSurvey, frameIndex, order, pixel));
        if (cached) cached.lastUsed = visibleAt;
      }
    }
    const root = currentSurvey === 'spherex'
      ? SPHEREX_HIPS
      : currentSurvey === 'two-mass' ? TWOMASS_HIPS : DSS2_HIPS;
    const generation = ++generationRef.current;
    tileAbortRef.current?.abort();
    const controller = new AbortController();
    tileAbortRef.current = controller;
    setLoading(true);
    const nestedFrameDirectory = currentSurvey === 'spherex';

    try {
      const priorityOrders = [...keys.entries()].sort((left, right) => right[0] - left[0]);
      for (const [order, pixels] of priorityOrders) {
        const missing = [...pixels].filter((pixel) => !cacheRef.current.has(tileKey(currentSurvey, frameIndex, order, pixel)));
        for (let offset = 0; offset < missing.length; offset += 6) {
          const batch = missing.slice(offset, offset + 6);
          await Promise.all(batch.map(async (pixel) => {
            const key = tileKey(currentSurvey, frameIndex, order, pixel);
            const path = tilePath(order, pixel, frameIndex, nestedFrameDirectory, currentSurvey === 'spherex' ? 'png' : 'jpg');
            const response = await fetch(`${root}/${path}`, { signal: controller.signal, mode: 'cors' });
            if (!response.ok) throw new Error(`HiPS tile request failed (${response.status}).`);
            const bitmap = await createImageBitmap(await response.blob());
            try {
              const tileCanvas = document.createElement('canvas');
              tileCanvas.width = bitmap.width;
              tileCanvas.height = bitmap.height;
              const tileContext = tileCanvas.getContext('2d', { willReadFrequently: true });
              if (!tileContext) throw new Error('Canvas pixel access is unavailable.');
              tileContext.drawImage(bitmap, 0, 0);
              cacheRef.current.set(key, {
                width: bitmap.width,
                height: bitmap.height,
                pixels: tileContext.getImageData(0, 0, bitmap.width, bitmap.height).data,
                lastUsed: Date.now(),
              });
            } finally {
              bitmap.close();
            }
          }));
          if (generation !== generationRef.current) return;
          while (cacheRef.current.size > MAX_CACHE_TILES) {
            let oldestKey: string | null = null;
            let oldestTime = Number.POSITIVE_INFINITY;
            for (const [key, tile] of cacheRef.current) {
              if (tile.lastUsed < oldestTime) {
                oldestKey = key;
                oldestTime = tile.lastUsed;
              }
            }
            if (oldestKey) cacheRef.current.delete(oldestKey);
            else break;
          }
          requestRender();
        }
      }
      if (generation === generationRef.current) setLoading(false);
    } catch (error) {
      if (controller.signal.aborted || generation !== generationRef.current) return;
      setLoading(false);
      setTileError(error instanceof Error ? error.message : String(error));
    }
  }, [frame, requestRender, retryToken, survey, visibleTiles]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadTiles(); }, 120);
    return () => window.clearTimeout(timer);
  }, [loadTiles, view]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => requestRender());
    observer.observe(canvas);
    requestRender();
    return () => observer.disconnect();
  }, [requestRender]);

  useEffect(() => {
    const canvas = skyCanvasRef.current;
    if (!canvas) return;
    try {
      const renderer = new InfraSphereSkyRenderer(canvas);
      rendererRef.current = renderer;
      setRendererError(null);
      requestRender();
      return () => {
        renderer.dispose();
        if (rendererRef.current === renderer) rendererRef.current = null;
      };
    } catch (error) {
      setRendererError(error instanceof Error ? error.message : String(error));
    }
  }, [requestRender]);

  useEffect(() => {
    if (!(survey in SIMULATOR_SAMPLES)) {
      simulatorImageRef.current = null;
      requestRender();
      return;
    }

    generationRef.current += 1;
    tileAbortRef.current?.abort();
    let active = true;
    const controller = new AbortController();
    simulatorImageRef.current = null;
    setLoading(true);
    setTileError(null);
    const path = SIMULATOR_SAMPLES[survey as keyof typeof SIMULATOR_SAMPLES];
    void fetch(`${import.meta.env.BASE_URL}data/spherex-simulator/${path}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`The simulator cutout could not be loaded (${response.status}).`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const image = decodeFitsImage(buffer);
        const range = percentileRange(image.values);
        if (!range) throw new Error('The simulator cutout contains no usable pixels.');
        if (!active) return;
        const cd11 = image.header.get('CD1_1') ?? (image.header.get('PC1_1') ?? 1) * (image.header.get('CDELT1') ?? 1);
        const cd12 = image.header.get('CD1_2') ?? (image.header.get('PC1_2') ?? 0) * (image.header.get('CDELT1') ?? 1);
        const cd21 = image.header.get('CD2_1') ?? (image.header.get('PC2_1') ?? 0) * (image.header.get('CDELT2') ?? 1);
        const cd22 = image.header.get('CD2_2') ?? (image.header.get('PC2_2') ?? 1) * (image.header.get('CDELT2') ?? 1);
        const pixelScale = Math.sqrt(Math.abs(cd11 * cd22 - cd12 * cd21));
        const fieldOfView = pixelScale * image.height;
        simulatorImageRef.current = { image, range, fieldOfView };
        updateView({
          ...viewRef.current,
          ra: image.header.get('CRVAL1') ?? DEFAULT_VIEW.ra,
          dec: image.header.get('CRVAL2') ?? DEFAULT_VIEW.dec,
          fov: clamp(fieldOfView * 1.15, 0.02, 170),
          projection: 'TAN',
        });
        setLoading(false);
        requestRender();
      })
      .catch((error: unknown) => {
        if (active && !controller.signal.aborted) {
          setLoading(false);
          setTileError(error instanceof Error ? error.message : String(error));
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [requestRender, retryToken, survey, updateView]);

  useEffect(() => () => {
    generationRef.current += 1;
    tileAbortRef.current?.abort();
    detailAbortRef.current?.abort();
    if (interactionTimerRef.current !== null) window.clearTimeout(interactionTimerRef.current);
  }, []);

  useEffect(() => {
    if (survey !== 'spherex' || isBlankFrame(frame) || view.fov > DETAIL_MAX_FOV) {
      detailAbortRef.current?.abort();
      detailRef.current = null;
      setDetailMessage(
        survey !== 'spherex'
          ? 'Exposure detail is available for SPHEREx views.'
          : isBlankFrame(frame)
            ? `Cube channel ${frame} is blank in the released DR1 product.`
            : 'Zoom in to 0.4° or closer to load observed exposure detail.',
      );
      requestRender();
      return;
    }

    detailAbortRef.current?.abort();
    detailRef.current = null;
    requestRender();
    const timer = window.setTimeout(() => {
      const controller = new AbortController();
      detailAbortRef.current?.abort();
      detailAbortRef.current = controller;
      detailRef.current = null;
      setDetailMessage('Loading a real SPHEREx DR1 exposure cutout…');
      const endpoint = new URL('/api/spherex-detail', window.location.origin);
      const snappedRa = Math.round(view.ra / 0.02) * 0.02 % 360;
      const snappedDec = clamp(Math.round(view.dec / 0.02) * 0.02, -90, 90);
      endpoint.searchParams.set('ra', snappedRa.toFixed(2));
      endpoint.searchParams.set('dec', snappedDec.toFixed(2));
      endpoint.searchParams.set('wavelength', String(selectedChannel.wavelength));
      const fieldOfView = Math.min(0.5, Math.max(0.1, view.fov * 1.2 + 0.04));
      endpoint.searchParams.set('size', fieldOfView.toFixed(3));
      void fetch(endpoint, { signal: controller.signal }).then(async (response) => {
        if (!response.ok) {
          const result = await response.json() as { error?: string };
          throw new Error(result.error || 'IRSA did not return a SPHEREx exposure.');
        }
        const image = decodeFitsImage(await response.arrayBuffer());
        const range = percentileRange(image.values);
        if (!range) throw new Error('The exposure cutout contains no usable pixels.');
        if (controller.signal.aborted) return;
        detailRef.current = { image, range, fieldOfView };
        setDetailMessage(
          `DR1 ${selectedChannel.band} single-exposure detail · 6.15 arcsec/pixel. This is not a coadded mosaic or a single-channel cube slice.`,
        );
        requestRender();
      }).catch((error: unknown) => {
        if (!controller.signal.aborted) {
          detailRef.current = null;
          setDetailMessage(error instanceof Error ? error.message : String(error));
          requestRender();
        }
      });
    }, 450);

    return () => {
      window.clearTimeout(timer);
      detailAbortRef.current?.abort();
    };
  }, [frame, requestRender, selectedChannel.band, selectedChannel.wavelength, survey, view.dec, view.fov, view.ra]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const skyCanvas = skyCanvasRef.current;
    const renderer = rendererRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !skyCanvas || !renderer || !context || isInteractingRef.current) return;
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25, 1024 / Math.max(1, bounds.width), 768 / Math.max(1, bounds.height));
    const width = Math.max(1, Math.min(1024, Math.round(bounds.width * pixelRatio)));
    const height = Math.max(1, Math.min(768, Math.round(bounds.height * pixelRatio)));
    renderer.resize(bounds.width, bounds.height, pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const maxOrder = selectHiPSOrder(view.fov, height, survey === 'spherex' ? TILE_ORDER : 8);
    const frameIndex = survey === 'spherex' ? frame - 1 : 0;
    const tilePrefix = `${survey}:${frameIndex}:`;
    renderer.setColorMap(colormap);
    renderer.syncTiles(cacheRef.current, tilePrefix);
    const fits = survey === 'spherex' ? detailRef.current : simulatorImageRef.current;
    if (fits) {
      let patchCache = detailPatchRef.current;
      if (!patchCache || patchCache.loaded !== fits || patchCache.colormap !== colormap) {
        patchCache = {
          loaded: fits,
          colormap,
          patch: makeWebGLPatch(fits.image, fits.range, fits.fieldOfView, colormap),
        };
        detailPatchRef.current = patchCache;
      }
      renderer.setPatch(patchCache.patch);
    } else {
      detailPatchRef.current = null;
      renderer.setPatch(null);
    }
    renderer.render(view, maxOrder, survey === 'spherex');

    context.clearRect(0, 0, width, height);
    const mapWidth = width;
    const mapHeight = height;
    context.save();
    if (showGrid) {
      context.strokeStyle = isDark ? 'rgba(242, 64, 64, 0.38)' : 'rgba(163, 0, 0, 0.3)';
      context.lineWidth = 0.8;
      for (let dec = -75; dec <= 75; dec += 15) {
        context.beginPath();
        let started = false;
        for (let ra = 0; ra <= 360; ra += 2) {
          const point = skyToScreen(view, ra, dec, mapWidth, mapHeight);
          if (!point) { started = false; continue; }
          if (started) context.lineTo(point[0], point[1]);
          else context.moveTo(point[0], point[1]);
          started = true;
        }
        context.stroke();
      }
      for (let ra = 0; ra < 360; ra += 30) {
        context.beginPath();
        let started = false;
        for (let dec = -90; dec <= 90; dec += 2) {
          const point = skyToScreen(view, ra, dec, mapWidth, mapHeight);
          if (!point) { started = false; continue; }
          if (started) context.lineTo(point[0], point[1]);
          else context.moveTo(point[0], point[1]);
          started = true;
        }
        context.stroke();
      }
    }

    for (const tracklet of tracklets) {
      if (tracklet.path.length < 2) continue;
      context.beginPath();
      let started = false;
      for (const [ra, dec] of tracklet.path) {
        const point = skyToScreen(view, ra, dec, mapWidth, mapHeight);
        if (!point) { started = false; continue; }
        if (started) context.lineTo(point[0], point[1]);
        else context.moveTo(point[0], point[1]);
        started = true;
      }
      context.strokeStyle = tracklet.known ? 'rgba(242, 184, 75, 0.8)' : 'rgba(240, 107, 107, 0.8)';
      context.lineWidth = 1.5;
      context.stroke();
    }

    for (const tracklet of tracklets) {
      const point = skyToScreen(view, tracklet.ra, tracklet.dec, mapWidth, mapHeight);
      if (!point) continue;
      context.beginPath();
      if (tracklet.known) {
        context.moveTo(point[0], point[1] - 5);
        context.lineTo(point[0] + 5, point[1]);
        context.lineTo(point[0], point[1] + 5);
        context.lineTo(point[0] - 5, point[1]);
        context.closePath();
      } else {
        context.arc(point[0], point[1], 4, 0, Math.PI * 2);
      }
      context.fillStyle = tracklet.id === selectedTrackletId ? '#fff' : tracklet.known ? '#f2b84b' : '#f06b6b';
      context.fill();
      context.strokeStyle = tracklet.id === selectedTrackletId ? '#A30000' : '#111827';
      context.lineWidth = 1;
      context.stroke();
    }

    if (showReticle) {
      const centerX = mapWidth / 2;
      const centerY = mapHeight / 2;
      context.strokeStyle = '#A30000';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(centerX - 9, centerY);
      context.lineTo(centerX + 9, centerY);
      context.moveTo(centerX, centerY - 9);
      context.lineTo(centerX, centerY + 9);
      context.stroke();
    }
    context.restore();

  }, [colormap, frame, isDark, renderVersion, selectedTrackletId, showGrid, showReticle, survey, tracklets, view]);

  const resetView = () => {
    finishInteraction();
    updateView(DEFAULT_VIEW);
  };
  const zoomBy = (factor: number) => {
    const current = viewRef.current;
    const next = {
      ...current,
      fov: clamp(current.fov * factor, 0.02, current.projection === 'TAN' ? 170 : current.projection === 'STEREO' ? 150 : 180),
    };
    if (next.fov === current.fov) return;
    beginInteraction();
    zoomScaleRef.current *= current.fov / next.fov;
    const transform = `scale(${zoomScaleRef.current})`;
    if (canvasRef.current) canvasRef.current.style.transform = transform;
    if (skyCanvasRef.current) skyCanvasRef.current.style.transform = transform;
    updateView(next);
    interactionTimerRef.current = window.setTimeout(finishInteraction, 120);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startView: viewRef.current,
      view: viewRef.current,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 3) {
      drag.moved = true;
      beginInteraction();
      drag.view = {
        ...drag.startView,
        ra: normalizedRa(drag.startView.ra + dx * drag.startView.fov / Math.max(1, bounds.height)),
        dec: clamp(drag.startView.dec + dy * drag.startView.fov / Math.max(1, bounds.height), -89.9, 89.9),
      };
      const transform = `translate3d(${dx}px, ${dy}px, 0)`;
      event.currentTarget.style.transform = transform;
      if (skyCanvasRef.current) skyCanvasRef.current.style.transform = transform;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      finishInteraction();
      updateView(drag.view);
    } else {
      const bounds = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - bounds.left;
      const clickY = event.clientY - bounds.top;
      const nearest = tracklets
        .map((tracklet) => {
          const point = skyToScreen(viewRef.current, tracklet.ra, tracklet.dec, bounds.width, bounds.height);
          return { tracklet, distance: point ? Math.hypot(point[0] - clickX, point[1] - clickY) : Infinity };
        })
        .sort((left, right) => left.distance - right.distance)[0];
      if (nearest && nearest.distance < 14) setSelectedTrackletId(nearest.tracklet.id);
      else if (isSimbadPointerActive) {
        const position = screenToSky(viewRef.current, clickX, clickY, bounds.width, bounds.height);
        if (position) {
          window.open(
            `https://simbad.cds.unistra.fr/simbad/sim-coo?Coord=${position[0].toFixed(5)}%20${position[1].toFixed(5)}&Radius=2`,
            '_blank',
            'noopener,noreferrer',
          );
        }
      } else {
        setSelectedTrackletId('');
      }
    }
  };

  const handleCanvasMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      handlePointerMove(event);
    }
  };

  const sidebarSelectClass = isDark
    ? 'border-white/10 bg-slate-900 text-zinc-100 focus:border-sky-400'
    : 'border-slate-200 bg-white text-slate-800 focus:border-sky-600';
  const sidebarButtonClass = isDark
    ? 'border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.09]'
    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

  return (
    <section
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden ${isDark ? 'bg-[#080f20] text-zinc-100' : 'bg-slate-100 text-slate-900'} ${className}`}
      aria-label="Interactive sky map"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#03050a]">
        <canvas
          ref={skyCanvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
          style={{ background: 'transparent' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handleCanvasMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={(event) => {
            event.preventDefault();
            zoomBy(event.deltaY < 0 ? 0.8 : 1.25);
          }}
          aria-label="Drag to pan, scroll to zoom, and click a tracklet to inspect it"
        />
        <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#07111f]/90 shadow-lg backdrop-blur">
          <button type="button" onClick={() => zoomBy(0.7)} className="inline-flex h-9 w-9 items-center justify-center hover:bg-white/10" aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => zoomBy(1.4)} className="inline-flex h-9 w-9 items-center justify-center hover:bg-white/10" aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-3 right-3 z-10 rounded-md border border-white/10 bg-[#07111f]/80 px-2 py-1 font-mono text-[10px] text-slate-200 backdrop-blur">
          RA {view.ra.toFixed(3)}° · Dec {view.dec.toFixed(3)}° · FOV {view.fov.toFixed(3)}°
        </div>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-md border border-white/10 bg-[#07111f]/80 px-2 py-1 text-[10px] text-slate-200 backdrop-blur" role="status">
          <span className={`h-2 w-2 rounded-full ${tileError || rendererError ? 'bg-red-400' : loading ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`} />
          {rendererError
            ? 'WebGL renderer error'
            : tileError
            ? 'Map error'
            : loading
              ? survey in SIMULATOR_SAMPLES ? 'Loading simulator cutout…' : 'Loading sky tiles…'
              : survey === 'spherex'
                ? `SPHEREx DR1 · order ${selectHiPSOrder(view.fov, canvasRef.current?.height ?? 600, TILE_ORDER)} ready`
                : survey in SIMULATOR_SAMPLES ? 'Simulator cutout ready' : 'Reference survey ready'}
        </div>
        {!sidebarVisible && (
          <button
            type="button"
            onClick={() => setSidebarVisible(true)}
            className={`absolute left-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#07111f]/95 text-zinc-200' : 'border-slate-200 bg-white/95 text-slate-700'}`}
            aria-label="Show Atlas controls"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}
        {sidebarVisible && (
          <aside className={`absolute bottom-3 left-3 top-3 z-10 flex w-[min(14rem,calc(100%-5rem))] flex-col overflow-y-auto rounded-xl border p-3 shadow-xl backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#07111f]/95 text-zinc-100' : 'border-slate-200 bg-white/95 text-slate-800'}`}>
            <header className={`mb-4 flex items-center justify-between border-b pb-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <h2 className="text-sm font-bold tracking-wide">Atlas</h2>
                <p className={`mt-0.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>InfraSphere WebGL renderer · SPHEREx DR1</p>
              </div>
              <button type="button" onClick={() => setSidebarVisible(false)} className="inline-flex h-7 w-7 items-center justify-center" aria-label="Hide Atlas controls">
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </header>

            <div className="space-y-4">
              <div>
                <label htmlFor="native-survey" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Survey</label>
                <select id="native-survey" value={survey} onChange={(event) => setSurvey(event.currentTarget.value as Survey)} className={`w-full rounded-lg border px-2.5 py-2 text-xs ${sidebarSelectClass}`}>
                  <option value="spherex">SPHEREx DR1 all-sky cube (102 channels)</option>
                  <optgroup label="SPHEREx simulator samples">
                    <option value="simulator-high-latitude">High latitude field cutout</option>
                    <option value="simulator-galactic-plane">Galactic plane field cutout</option>
                  </optgroup>
                  <option value="two-mass">2MASS infrared reference</option>
                  <option value="reference">DSS2 optical reference</option>
                </select>
              </div>

              {survey in SIMULATOR_SAMPLES && (
                <p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  256×256-pixel simulated Level-2 exposure cutout, not an all-sky map. See the{' '}
                  <a className="underline underline-offset-2" href="https://doi.org/10.3847/1538-4365/ae04cc" target="_blank" rel="noreferrer">Crill et al. (2025) paper</a>.
                </p>
              )}

              {survey === 'spherex' && (
                <div className="space-y-2 border-t border-white/10 pt-2">
                  <label htmlFor="native-channel" className="text-[10px] font-semibold uppercase tracking-wider">Wavelength channel</label>
                  <select id="native-channel" value={frame} onChange={(event) => setFrame(Number(event.currentTarget.value))} className={`w-full rounded-lg border px-2 py-1.5 text-xs ${sidebarSelectClass}`}>
                    {SPHEREX_BANDS.map((band) => (
                      <optgroup key={band} label={`Band ${band} (${SPHEREX_BAND_DESCRIPTIONS[band].range})`}>
                        {SPHEREX_CHANNELS.filter((channel) => channel.band === band).map((channel) => (
                          <option key={channel.frame} value={channel.frame}>
                            {channel.band} ch {channel.channel}: {channel.wavelength.toFixed(3)} μm{channel.isBlank ? ' [BLANK]' : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <label htmlFor="native-colormap" className="mt-2 block text-[10px] font-semibold uppercase tracking-wider">Display color map</label>
                  <select id="native-colormap" value={colormap} onChange={(event) => setColormap(event.currentTarget.value as ColorMap)} className={`w-full rounded-lg border px-2 py-1.5 text-xs ${sidebarSelectClass}`}>
                    <option value="grayscale">Grayscale</option>
                    <option value="magma">Magma / purple-gold</option>
                  </select>
                  {selectedChannel.isBlank && <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-[10px] text-amber-300">This dichroic channel is blank in the released DR1 cube.</p>}
                  <p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Official DR1 observed cube · 102 channels · native HiPS order 5 · 12.9 arcsec/pixel.{' '}
                    <a className="underline underline-offset-2" href="https://doi.org/10.26131/IRSA679" target="_blank" rel="noreferrer">IRSA source</a>
                  </p>
                  <p className={`text-[10px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`} aria-live="polite">{detailMessage}</p>
                  <p className={`text-[9px] leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Deep-zoom detail is a real single exposure at 6.15 arcsec/pixel, not a coadded mosaic or an exact cube-channel slice.</p>
                </div>
              )}

              <div>
                <label htmlFor="native-projection" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Map projection</label>
                <select id="native-projection" value={view.projection} onChange={(event) => {
                  const projection = event.currentTarget.value as Projection;
                  updateView({
                    ...viewRef.current,
                    projection,
                    fov: projection === 'TAN'
                      ? Math.min(viewRef.current.fov, 120)
                      : projection === 'STEREO' ? Math.min(viewRef.current.fov, 150) : viewRef.current.fov,
                  });
                }} className={`w-full rounded-lg border px-2.5 py-2 text-xs ${sidebarSelectClass}`}>
                  {PROJECTIONS.map((projection) => <option key={projection.value} value={projection.value}>{projection.label}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="native-tracklet" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Tracklet</label>
                <select id="native-tracklet" value={selectedTrackletId} onChange={(event) => {
                  const id = event.currentTarget.value;
                  setSelectedTrackletId(id);
                  const target = tracklets.find((tracklet) => tracklet.id === id);
                  if (target) updateView({ ...viewRef.current, ra: target.ra, dec: target.dec, fov: 0.12 });
                }} className={`w-full rounded-lg border px-2.5 py-2 text-xs ${sidebarSelectClass}`}>
                  <option value="">Select from {tracklets.length} objects</option>
                  {tracklets.map((tracklet) => <option key={tracklet.id} value={tracklet.id}>Tracklet {tracklet.id}{tracklet.name ? ` · ${tracklet.name}` : ` · ${tracklet.knownStatus}`}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider">Map options</h3>
                <button type="button" onClick={resetView} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs ${sidebarButtonClass}`}><RotateCcw className="h-3.5 w-3.5" />Reset map view</button>
                <button type="button" onClick={() => setIsSimbadPointerActive((value) => !value)} aria-pressed={isSimbadPointerActive} className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${sidebarButtonClass}`}>{isSimbadPointerActive ? 'Exit SIMBAD lookup' : 'SIMBAD lookup'}</button>
                <button type="button" onClick={() => setShowGrid((value) => !value)} aria-pressed={showGrid} className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${sidebarButtonClass}`}>Coordinate grid: {showGrid ? 'On' : 'Off'}</button>
                <button type="button" onClick={() => setShowReticle((value) => !value)} aria-pressed={showReticle} className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${sidebarButtonClass}`}>Center reticle: {showReticle ? 'On' : 'Off'}</button>
                <button type="button" onClick={onToggleTheme} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs ${sidebarButtonClass}`}>{isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}{isDark ? 'Light theme' : 'Dark theme'}</button>
                <button type="button" onClick={onToggleFullscreen} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs ${sidebarButtonClass}`}><Maximize2 className="h-3.5 w-3.5" />{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
              </div>

              {selectedTracklet && (
                <div className="border-t border-white/10 pt-3 text-[10px]">
                  <div className="flex items-center justify-between">
                    <strong>Tracklet {selectedTracklet.id}</strong>
                    <button type="button" onClick={() => setSelectedTrackletId('')} aria-label="Close tracklet details"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    {Object.entries(selectedTracklet.details).map(([label, value]) => (
                      <React.Fragment key={label}>
                        <dt className={isDark ? 'text-slate-400' : 'text-slate-500'}>{label}</dt>
                        <dd className="break-words text-right">{value === null ? 'Not supplied' : String(value)}</dd>
                      </React.Fragment>
                    ))}
                    <dt className={isDark ? 'text-slate-400' : 'text-slate-500'}>RA / Dec</dt>
                    <dd className="text-right">{selectedTracklet.ra.toFixed(5)}° / {selectedTracklet.dec.toFixed(5)}°</dd>
                  </dl>
                  {selectedTracklet.name && <p>{selectedTracklet.name}</p>}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!selectedTracklet.plotPath}
                      onClick={() => setOpenTrackletTool('plots')}
                      className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[10px] disabled:cursor-not-allowed disabled:opacity-50 ${sidebarButtonClass}`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />Diagnostic plot
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenTrackletTool('suggestions')}
                      className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[10px] ${sidebarButtonClass}`}
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />Community input
                    </button>
                  </div>
                </div>
              )}
              {analysisError && (
                <p role="alert" className="rounded-md border border-amber-400/30 bg-amber-400/10 p-2 text-[10px] text-amber-200">
                  Tracklet data could not be loaded: {analysisError}
                </p>
              )}
              {tileError && (
                <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 p-2 text-[10px] text-red-200">
                  <AlertTriangle className="mr-1 inline h-3 w-3" />{tileError}
                  <button type="button" onClick={() => setRetryToken((token) => token + 1)} className="mt-2 block font-semibold underline underline-offset-2">Retry loading</button>
                </p>
              )}
              {rendererError && (
                <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/10 p-2 text-[10px] text-red-200">
                  <AlertTriangle className="mr-1 inline h-3 w-3" />{rendererError}
                </p>
              )}
            </div>
          </aside>
        )}
        {selectedTracklet && openTrackletTool && (
          <>
            <button
              type="button"
              aria-label="Close tracklet tool"
              onClick={() => setOpenTrackletTool(null)}
              className="absolute inset-0 z-20 cursor-default bg-black/50"
            />
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="native-tracklet-tool-title"
              className={`absolute left-1/2 top-1/2 z-30 flex max-h-[calc(100%-2rem)] w-[min(60rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border shadow-2xl ${
                isDark ? 'border-slate-600 bg-[#0a1422] text-white' : 'border-slate-300 bg-white text-slate-900'
              }`}
            >
              <header className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <h2 id="native-tracklet-tool-title" className="truncate text-sm font-semibold">
                  {openTrackletTool === 'plots' ? 'Diagnostic plot' : 'Community input'} — Tracklet {selectedTracklet.id}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpenTrackletTool(null)}
                  aria-label="Close tracklet tool"
                  className={`inline-flex h-8 w-8 items-center justify-center ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </header>
              {openTrackletTool === 'plots' && selectedTracklet.plotPath && (
                <div className="max-h-[80vh] overflow-auto p-4">
                  <img
                    src={selectedTracklet.plotPath}
                    alt={`Diagnostic plot for tracklet ${selectedTracklet.id}`}
                    className="mx-auto block h-auto max-h-[76vh] w-full object-contain"
                  />
                  <p className={`mt-3 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    This supplied diagnostic plot is not a SPHEREx infrared image.
                  </p>
                </div>
              )}
              {openTrackletTool === 'suggestions' && (
                <div className="overflow-y-auto p-4">
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    No AI prediction is available for this object. Share a provisional interpretation; it will not change the unclassified status.
                  </p>
                  {suggestionLoading ? (
                    <p className={`mt-3 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} role="status">Loading public suggestions…</p>
                  ) : suggestions.length > 0 ? (
                    <ul className={`mt-3 space-y-2 border-y py-3 text-xs ${isDark ? 'border-white/10' : 'border-slate-200'}`} aria-label="Community classification suggestions">
                      {suggestions.map((suggestion) => (
                        <li key={suggestion.classification} className="flex items-center justify-between gap-2">
                          <span className="min-w-0 break-words">{suggestion.classification}</span>
                          <span className={isDark ? 'shrink-0 text-zinc-400' : 'shrink-0 text-slate-500'}>
                            {suggestion.count} {suggestion.count === 1 ? 'suggestion' : 'suggestions'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : !suggestionError ? (
                    <p className={`mt-3 border-y py-3 text-xs ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                      No suggestions yet.
                    </p>
                  ) : null}
                  {suggestionError && <p role="alert" className={`mt-3 text-xs ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{suggestionError}</p>}
                  <form className="mt-4 space-y-3" onSubmit={submitClassificationSuggestion}>
                    <label className="sr-only" htmlFor="native-classification">Your suggested object type</label>
                    <input
                      id="native-classification"
                      value={classificationInput}
                      onChange={(event) => setClassificationInput(event.currentTarget.value)}
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
                    <label className="sr-only" htmlFor="native-rationale">Reasoning for your suggestion</label>
                    <textarea
                      id="native-rationale"
                      value={rationaleInput}
                      onChange={(event) => setRationaleInput(event.currentTarget.value)}
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
                    {suggestionMessage && <p role="status" className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{suggestionMessage}</p>}
                  </form>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
};
