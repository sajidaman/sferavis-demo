declare module 'aladin-lite' {
  export interface AladinSource {
    data: Record<string, string | number | boolean | null>;
  }

  export interface AladinCatalog {
    addSources: (sources: AladinSource | AladinSource[]) => void;
  }

  export interface AladinGraphicOverlay {
    add: (shape: unknown) => void;
  }

  export interface AladinCatalogOptions {
    name?: string;
    color?: string;
    sourceSize?: number;
    shape?: string;
    onClick?: 'showTable' | 'showPopup' | ((source: AladinSource) => void);
  }

  export interface AladinInstance {
    setBaseImageLayer: (survey: string | unknown) => void;
    gotoRaDec: (ra: number, dec: number) => void;
    setFoV: (fov: number) => void;
    setProjection: (projection: string) => void;
    setCooGrid: (options: { enabled?: boolean; color?: string; opacity?: number; labelSize?: number }) => void;
    setDefaultColor: (color: string) => void;
    addCatalog: (catalog: AladinCatalog) => void;
    addOverlay: (overlay: AladinGraphicOverlay) => void;
    removeOverlay: (overlay: AladinCatalog | AladinGraphicOverlay) => void;
    getBaseImageLayer?: () => unknown;
    getView?: () => unknown;
    on?: (event: string, callback: (...args: unknown[]) => void) => void;
    [key: string]: unknown;
  }

  export interface AladinOptions {
    survey?: string;
    target?: string;
    fov?: number;
    projection?: string;
    cooFrame?: string;
    showCooGrid?: boolean;
    showCooGridControl?: boolean;
    showSimbadPointerControl?: boolean;
    showReticle?: boolean;
    showLayersControl?: boolean;
    showFullscreenControl?: boolean;
    showGotoControl?: boolean;
    showFrame?: boolean;
    showProjectionControl?: boolean;
    [key: string]: unknown;
  }

  export interface AladinHiPSOptions {
    name?: string;
    url?: string;
    maxOrder?: number;
    minOrder?: number;
    tileSize?: number;
    imgFormat?: string;
    cooFrame?: string;
    requestMode?: string;
    requestCredentials?: RequestCredentials;
    errorCallback?: (error: unknown) => void;
    successCallback?: () => void;
  }

  export interface AladinStatic {
    init: Promise<void>;
    aladin: (container: string | HTMLElement, options?: AladinOptions) => AladinInstance;
    HiPS: (id: string, options?: AladinHiPSOptions) => unknown;
    catalog: (options?: AladinCatalogOptions) => AladinCatalog;
    source: (ra: number, dec: number, data?: Record<string, string | number | boolean | null>) => AladinSource;
    graphicOverlay: (options?: { name?: string; color?: string; lineWidth?: number }) => AladinGraphicOverlay;
    polyline: (
      coordinates: Array<[number, number]>,
      options?: { color?: string; opacity?: number; lineWidth?: number }
    ) => unknown;
    [key: string]: unknown;
  }

  const A: AladinStatic;
  export default A;
}
