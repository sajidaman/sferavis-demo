import React from 'react';
import { FileText, FolderOpen } from 'lucide-react';
import { PageId } from '../types';

interface ArchivePageProps {
  onNavigate: (page: PageId) => void;
}

const fileGroups = [
  {
    title: 'Detection catalogues',
    directory: 'catalogs',
    description: 'Source detections, Gaia cross-matches, flagged and filtered detections, static-source classifications, astrometry, observations, and supporting catalogue tables.',
    files: [
      '1_detections.csv', '2_detections_gaia.csv', '3_detections_all_flagged.csv',
      '3_detections_filtered.csv', '4_static_near_misses.csv', '4_unlabeled_objects.csv',
      '4_unlabeled_static_objects.csv', 'cutout_urls.csv', 'epoch_astrometry.csv',
      'gaia_catalog.csv', 'known_in_field.csv', 'observations.csv',
      'static_classification.csv', 'static_spectrum_points.csv',
    ],
  },
  {
    title: 'Detection plots',
    directory: 'plots',
    description: 'Diagnostic visualisations for the thirteen numbered candidates.',
    files: [
      'candidate_0001.png', 'candidate_0002.png', 'candidate_0003.png',
      'candidate_0004.png', 'candidate_0005.png', 'candidate_0006.png',
      'candidate_0007.png', 'candidate_0008.png', 'candidate_0009.png',
      'candidate_0010.png', 'candidate_0011.png', 'candidate_0012.png',
      'candidate_0013.png',
    ],
  },
  {
    title: 'Tracklet spectra',
    directory: 'spectra',
    description: 'CSV spectral samples and corresponding PNG plots for tracklets 0001–0013.',
    files: [
      'tracklet_0001_spectrum.csv', 'tracklet_0001_spectrum.png',
      'tracklet_0002_spectrum.csv', 'tracklet_0002_spectrum.png',
      'tracklet_0003_spectrum.csv', 'tracklet_0003_spectrum.png',
      'tracklet_0004_spectrum.csv', 'tracklet_0004_spectrum.png',
      'tracklet_0005_spectrum.csv', 'tracklet_0005_spectrum.png',
      'tracklet_0006_spectrum.csv', 'tracklet_0006_spectrum.png',
      'tracklet_0007_spectrum.csv', 'tracklet_0007_spectrum.png',
      'tracklet_0008_spectrum.csv', 'tracklet_0008_spectrum.png',
      'tracklet_0009_spectrum.csv', 'tracklet_0009_spectrum.png',
      'tracklet_0010_spectrum.csv', 'tracklet_0010_spectrum.png',
      'tracklet_0011_spectrum.csv', 'tracklet_0011_spectrum.png',
      'tracklet_0012_spectrum.csv', 'tracklet_0012_spectrum.png',
      'tracklet_0013_spectrum.csv', 'tracklet_0013_spectrum.png',
    ],
  },
  {
    title: 'Static-source spectra',
    directory: 'static_spectra',
    description: 'Spectral data and plot for the static source S0003.',
    files: ['S0003_spectrum.csv', 'S0003_spectrum.png'],
  },
  {
    title: 'Tracklet tables',
    directory: 'tracklets',
    description: 'Candidate triage, classifications, light-curve and spectrum points, tracklet membership, and known-object checks.',
    files: [
      'candidates.csv', 'candidates_triage.csv', 'classification.csv',
      'lightcurve_points.csv', 'spectrum_points.csv', 'tracklet_members.csv',
      'tracklets.csv', 'tracklets_known_check.csv',
    ],
  },
  {
    title: 'Processing timing',
    directory: '',
    description: 'Runtime and processing timing information for this field.',
    files: ['timing.csv'],
  },
];

export const ArchivePage: React.FC<ArchivePageProps> = ({ onNavigate }) => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
    <section className="border-b border-zinc-200 bg-transparent pb-12 pt-12 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">
            Archive<span className="text-[#a30000]">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
            Public scientific data releases from Sferavis, including astronomical detections, candidate analysis, spectral measurements, diagnostic plots, and derived data products.
          </p>
        </header>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section aria-labelledby="release-heading" className="overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e1628]">
        <div className="border-l-4 border-l-[#a30000] p-6 sm:p-10">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a30000]">
            <span>Scientific data release</span><span>/</span><span>Available</span>
          </div>
          <h2 id="release-heading" className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            SPHEREx field analysis — RA 180.0000°, Dec +0.0000°
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-zinc-300">
            This release contains the generated catalogues, candidate diagnostic plots, tracklet spectra, static-source spectrum, and processing records for the field centred at the coordinates above. The release is organised below into six collections covering catalogues, diagnostic plots, spectra, and processing records.
          </p>
          <div className="mt-6">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">64 files · 6 collections</span>
          </div>
        </div>
        <div className="grid grid-cols-1 border-t border-zinc-200 sm:grid-cols-3 dark:border-slate-800">
          {[
            ['Field centre', 'RA 180.0000° / Dec +0.0000°'],
            ['Collections', '6 categories'],
            ['File access', 'Catalogue listing'],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-zinc-200 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="release-files-heading" className="mt-12">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">Release contents</p>
          <h2 id="release-files-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">Browse all files</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            The files in this release are listed by collection. Repository links are currently unavailable.
          </p>
        </div>
        <div className="space-y-5">
          {fileGroups.map((group) => (
            <section key={group.title} className="border border-zinc-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e1628]">
              <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]">
                    <FolderOpen size={19} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-950 dark:text-white">{group.title}</h3>
                    <p className="mt-1 max-w-3xl text-xs leading-6 text-slate-600 dark:text-zinc-400">{group.description}</p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">{group.files.length} files</span>
              </div>
              <ul className="grid grid-cols-1 divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-y-0 dark:divide-slate-800">
                {group.files.map((filename) => (
                  <li key={filename} className="min-w-0 border-zinc-100 px-5 py-3.5 sm:border-b dark:border-slate-800">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
                      <FileText size={15} className="shrink-0 text-zinc-400" />
                      <span className="truncate">{filename}</span>
                    </div>
                  </li>
                ))}
              </ul>

            </section>
          ))}
        </div>
      </section>


    </main>
  </div>
);
