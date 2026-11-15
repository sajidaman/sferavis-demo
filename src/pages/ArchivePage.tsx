import React from 'react';
import { Archive, Database, FileText, GitBranch, BookOpen, ArrowUpRight } from 'lucide-react';
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
    <section className="border-b border-zinc-200 bg-transparent pb-12 pt-12 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">
            Archive<span className="text-[#a30000]">.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
            A scientific repository for astronomical detections, machine-learning classifications, spectral measurements, and derived data products produced by Infraredium.
          </p>
        </header>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section aria-label="Archive status" className="overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0e1628] lg:col-span-8">
          <div className="border-l-4 border-l-[#a30000] p-6 sm:p-10">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#a30000]">
              <span>Scientific data releases</span><span>/</span><span>In preparation</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">The Infraredium Archive is being prepared.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-300">
              Public data releases will appear here with version histories, release notes, downloadable files, provenance information, and citation details. No catalogue release is currently published.
            </p>
          </div>
          <div className="grid grid-cols-1 border-t border-zinc-200 sm:grid-cols-3 dark:border-slate-800">
            {[
              ['Release system', 'Versioned releases'],
              ['Access', 'Open downloads'],
              ['Citation', 'Release-level references'],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-zinc-200 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="border border-zinc-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0e1628] lg:col-span-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">Release documentation</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">Data, methods & citation</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-300">
            Each release will include its data dictionary, methodology, model and pipeline versions, known limitations, licence, and recommended citation. Permanent identifiers such as DOIs will be added when assigned.
          </p>
          <button type="button" onClick={() => onNavigate('documentations')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#a30000] transition-colors hover:text-[#800000]">
            Read documentation <ArrowUpRight size={14} />
          </button>
        </aside>
      </div>

      <section aria-labelledby="archive-products-heading" className="mt-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">Planned contents</p>
            <h2 id="archive-products-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">Scientific data products</h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-zinc-500 dark:text-zinc-400">Releases will distinguish source measurements from Infraredium-derived results and preserve data provenance.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plannedProducts.map(({ title, description, icon: Icon }) => (
            <article key={title} className="border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-[#a30000]/30 dark:border-slate-800 dark:bg-[#0e1628]">
              <div className="mb-5 flex h-11 w-11 items-center justify-center border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]">
                <Icon size={21} strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-300">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  </div>
);
