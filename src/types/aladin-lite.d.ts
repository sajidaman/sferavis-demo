declare module 'aladin-lite' {
  export interface AladinInstance {
    setBaseImageLayer: (survey: string | unknown) => void;
    gotoRaDec: (ra: number, dec: number) => void;
    setFoV: (fov: number) => void;
    setProjection: (projection: string) => void;
    setCooGrid: (options: { enabled?: boolean; color?: string; opacity?: number; labelSize?: number }) => void;
    setDefaultColor: (color: string) => void;
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

  export interface AladinStatic {
    init: Promise<void>;
    aladin: (container: string | HTMLElement, options?: AladinOptions) => AladinInstance;
    [key: string]: unknown;
  }

  const A: AladinStatic;
  export default A;
}
