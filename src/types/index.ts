export interface TutorialReferencePoint {
  label: string;
  value: string;
}

export type PageId = 'home' | 'spherex' | 'tutorials' | 'documentations' | 'team' | 'contact' | 'publications' | 'archive' | 'privacy' | 'terms' | 'licensing';

export interface CelestialTarget {
  id: string;
  name: string;
  designation: string;
  category: 'Molecular Cloud' | 'Distant Galaxy' | 'Protoplanetary Disk' | 'Quasar' | 'Supernova Remnant' | 'Exoplanet Host';
  ra: string; // Right Ascension (e.g. 05h 35m 17s)
  dec: string; // Declination (e.g. -05° 23' 28")
  coordinates: { x: number; y: number }; // Relative position on celestial sphere projection (0-100%)
  redshift?: number;
  distanceLightYears?: string;
  keyFeature: string;
  spectralPeakUm: number;
  iceAbsorptionDepth: number; // 0 to 1
  description: string;
  sedPoints: Array<{ wavelengthUm: number; fluxMjy: number; error: number }>;
}

export interface SpectralBand {
  bandNumber: number; // 1 to 6
  detector: string;
  wavelengthRange: string;
  resolvingPower: string;
  primaryScience: string;
  keyMolecules: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMin: number;
  category: 'Website Navigation' | 'Data Reduction' | 'Spectral Extraction' | 'Galaxy Catalogs' | 'Astropy SDK' | 'Cosmology' | 'Asteroids' | 'Galaxies' | 'Comets' | 'Supernovas' | 'Brown Dwarfs' | 'Quasars';
  summary: string;
  prerequisites: string[];
  learningObjectives?: string[];
  coursework?: {
    deliverable: string;
    assessmentCriteria: string[];
  };
  steps: Array<{
    stepNumber: number;
    title: string;
    explanation: string;
    codeSnippet?: string;
    expectedOutput?: string;
  }>;
  interactiveCode: string;
  videoUrl?: string;
  referencePoints?: TutorialReferencePoint[];
}

export interface DocSection {
  id: string;
  title: string;
  category: 'Overview' | 'Python SDK' | 'FITS Format' | 'REST API' | 'Algorithms' | 'Data Releases' | 'Public Detection' | 'AI-ML Pipeline';
  content: string;
  codeBlock?: {
    language: string;
    code: string;
  };
  endpoint?: {
    method: 'GET' | 'POST';
    path: string;
    params: Array<{ name: string; type: string; required: boolean; description: string }>;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  institution: string;
  bio: string;
  focusArea: string;
  avatarUrl?: string;
  publicationsCount: number;
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  doi: string;
  abstract: string;
  pillar: 'Cosmic Inflation' | 'Galaxy Formation' | 'Interstellar Ices' | 'Instrumentation & Data';
}
