import { parseCsv, type CsvTable } from '../utils/parseCsv';

export interface AnalysisDataset {
  id: string;
  name: string;
  fileName: string;
  group: string;
  description: string;
}

export const ANALYSIS_DATASETS: AnalysisDataset[] = [
  {
    id: 'candidates',
    name: 'Candidates',
    fileName: 'candidates.csv',
    group: 'Tracklets & candidates',
    description: 'Candidate moving-object tracklets and their summary measurements.',
  },
  {
    id: 'candidate-triage',
    name: 'Candidate triage',
    fileName: 'candidates_triage.csv',
    group: 'Tracklets & candidates',
    description: 'A triage subset of candidate tracklets.',
  },
  {
    id: 'tracklets',
    name: 'Tracklet summaries',
    fileName: 'tracklets.csv',
    group: 'Tracklets & candidates',
    description: 'Summary astrometry and motion measurements for detected tracklets.',
  },
  {
    id: 'tracklets-known-check',
    name: 'Known-object check',
    fileName: 'tracklets_known_check.csv',
    group: 'Tracklets & candidates',
    description: 'Tracklets with known-object match status and candidate names when available.',
  },
  {
    id: 'tracklet-members',
    name: 'Tracklet members',
    fileName: 'tracklet_members.csv',
    group: 'Tracklets & candidates',
    description: 'Individual detections assigned to each tracklet.',
  },
  {
    id: 'detections-filtered',
    name: 'Filtered detections',
    fileName: '3_detections_filtered.csv',
    group: 'Detections',
    description: 'Detections retained by the supplied filtering stage.',
  },
  {
    id: 'detections-all-flagged',
    name: 'All flagged detections',
    fileName: '3_detections_all_flagged.csv',
    group: 'Detections',
    description: 'Detection table augmented with quality, match, and object-classification fields.',
  },
  {
    id: 'detections-gaia',
    name: 'Gaia-matched detections',
    fileName: '2_detections_gaia.csv',
    group: 'Detections',
    description: 'Detections augmented with Gaia and SIMBAD cross-match fields.',
  },
  {
    id: 'detections',
    name: 'Initial detections',
    fileName: '1_detections.csv',
    group: 'Detections',
    description: 'Initial per-epoch detection measurements.',
  },
  {
    id: 'unlabeled-objects',
    name: 'Unlabeled object detections',
    fileName: '4_unlabeled_objects.csv',
    group: 'Objects & calibration',
    description: 'Per-epoch detections grouped into unlabeled object candidates.',
  },
  {
    id: 'unlabeled-static-objects',
    name: 'Unlabeled static objects',
    fileName: '4_unlabeled_static_objects.csv',
    group: 'Objects & calibration',
    description: 'Summary measurements for unlabeled objects classified as static.',
  },
  {
    id: 'epoch-astrometry',
    name: 'Epoch astrometry',
    fileName: 'epoch_astrometry.csv',
    group: 'Objects & calibration',
    description: 'Per-epoch astrometric shifts, reference residuals, and calibration uncertainty.',
  },
  {
    id: 'gaia-catalog',
    name: 'Gaia reference catalog',
    fileName: 'gaia_catalog.csv',
    group: 'Objects & calibration',
    description: 'Reference positions and proper motions from the supplied Gaia catalog.',
  },
  {
    id: 'known-in-field',
    name: 'Known objects in field',
    fileName: 'known_in_field.csv',
    group: 'Objects & calibration',
    description: 'Known solar-system objects and per-epoch nearby-detection counts.',
  },
];

const tableCache = new Map<string, Promise<CsvTable>>();

export function loadAnalysisDataset(datasetId: string): Promise<CsvTable> {
  const dataset = ANALYSIS_DATASETS.find((item) => item.id === datasetId);
  if (!dataset) {
    return Promise.reject(new Error(`Unknown analysis dataset: ${datasetId}`));
  }

  const cached = tableCache.get(datasetId);
  if (cached) return cached;

  const request = fetch(`${import.meta.env.BASE_URL}data/analyzed/${dataset.fileName}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${dataset.fileName} (HTTP ${response.status}).`);
      }
      return parseCsv(await response.text());
    })
    .catch((error: unknown) => {
      tableCache.delete(datasetId);
      throw error;
    });

  tableCache.set(datasetId, request);
  return request;
}
