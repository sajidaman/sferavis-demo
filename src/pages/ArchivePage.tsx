import React from 'react';
import { Archive, Database, FileText, Download, GitBranch, BookOpen } from 'lucide-react';
import { PageId } from '../types';

interface ArchivePageProps {
  onNavigate: (page: PageId) => void;
}

const plannedProducts = [
  {
    title: 'Object Detection Records',
    description: 'Source identifiers, celestial coordinates, detection metadata, and links to the observations used in analysis.',
    icon: Database,
  },
  {
    title: 'ML Classification Results',
    description: 'Model-generated classifications, confidence information, validation status, and model-version provenance.',
    icon: GitBranch,
  },
  {
    title: 'Spectral & Derived Measurements',
    description: 'Available spectral measurements and derived quantities, with uncertainties and source-product references.',
    icon: FileText,
  },
];

export const ArchivePage: React.FC<ArchivePageProps> = ({ onNavigate }) => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
    <div className="relative mx-auto max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mx-auto mb-14 max-w-4xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#a30000]/15 bg-[#a30000]/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a30000]">
          <Archive size={13} />
          Infraredium · Scientific Data
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">
          Archive<span className="text-[#a30000]">.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
          A scientific repository for astronomical detections, machine-learning classifications, spectral measurements, and derived data products produced by Infraredium.
        </p>
      </header>

      <section aria-label="Archive status" className="mb-12 overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/65 shadow-[0_16px_50px_rgba(20,30,45,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1220]/60">
        <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-9">
          <div className="max-w-2xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">Scientific data releases</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">The Infraredium Archive is being prepared.</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Public data releases will appear here with version histories, release notes, downloadable files, provenance information, and citation details. No catalogue release is currently published.
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]">
            <Archive size={30} strokeWidth={1.4} />
          </div>
        </div>
        <div className="grid gap-px border-t border-black/[0.07] bg-black/[0.07] sm:grid-cols-3 dark:border-white/10 dark:bg-white/10">
          <div className="bg-white/70 px-6 py-5 dark:bg-[#0b1220]/80">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Release system</p>
            <p className="mt-2 text-sm font-semibold">Versioned publications</p>
          </div>
          <div className="bg-white/70 px-6 py-5 dark:bg-[#0b1220]/80">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Access</p>
            <p className="mt-2 text-sm font-semibold">Open downloads</p>
          </div>
          <div className="bg-white/70 px-6 py-5 dark:bg-[#0b1220]/80">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Citation</p>
            <p className="mt-2 text-sm font-semibold">Release-level references</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="archive-products-heading" className="mb-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">What the archive will contain</p>
            <h2 id="archive-products-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Scientific data products</h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-zinc-500 dark:text-zinc-400">Each release will identify the source observations and distinguish source measurements from Infraredium-derived results.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {plannedProducts.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-black/10 bg-white/55 p-6 backdrop-blur-md dark:border-white/10 dark:bg-[#0b1220]/45">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]">
                <Icon size={21} strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Release information" className="rounded-[1.5rem] border border-black/10 bg-white/55 p-6 backdrop-blur-md sm:p-8 dark:border-white/10 dark:bg-[#0b1220]/45">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
            <BookOpen size={21} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Release documentation & citation</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Every published release will include its data dictionary, methodology, model and pipeline versions, known limitations, licence, and recommended citation. Permanent identifiers such as DOIs will be added when assigned.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('documentations')}
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#a30000] transition-colors hover:text-[#800000]"
            >
              Read Infraredium documentation
              <Download size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
);
