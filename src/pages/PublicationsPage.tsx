import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BookOpen, FileText, FlaskConical, Microscope } from 'lucide-react';
import { PageId } from '../types';

interface PublicationsPageProps {
  onNavigate: (page: PageId) => void;
}

const COLLECTIONS = [
  { icon: BookOpen, title: 'Peer-reviewed research', detail: 'Journal articles and formally published research.' },
  { icon: FileText, title: 'Preprints & working papers', detail: 'Research shared ahead of formal publication.' },
  { icon: FlaskConical, title: 'Technical reports', detail: 'Methods, datasets, software notes and project documentation.' },
];

export const PublicationsPage: React.FC<PublicationsPageProps> = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
    <div className="relative mx-auto max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mx-auto mb-16 max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#777f8a] shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#0b1220]/60 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-[#a30000]" />
          Research, ideas & discoveries
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">Publications<span className="text-[#a30000]">.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#68717d] sm:text-base dark:text-zinc-400">
          A growing archive of research and technical work from the Sferavis community — sharing ideas, methods and discoveries across scientific disciplines.
        </p>
      </header>
      <section aria-label="Publication collections" className="mb-14 grid gap-4 md:grid-cols-3">
        {COLLECTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-2xl border border-black/10 bg-white/65 p-6 shadow-[0_12px_36px_rgba(20,30,45,0.045)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1220]/55">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]"><Icon size={20} strokeWidth={1.7} /></div>
              <h2 className="text-base font-semibold tracking-tight text-[#202630] dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#737d89] dark:text-zinc-400">{item.detail}</p>
            </motion.article>
          );
        })}
      </section>
      <section aria-labelledby="publication-archive-heading" className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/60 shadow-[0_16px_50px_rgba(20,30,45,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1220]/55">
        <div className="flex flex-col gap-3 border-b border-black/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-white/10">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">Sferavis archive</p><h2 id="publication-archive-heading" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#202630] dark:text-white">Research library</h2></div>
          <span className="inline-flex w-fit items-center rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7b8490] dark:border-white/10 dark:text-zinc-400">Archive in preparation</span>
        </div>
        <div className="flex flex-col items-center px-6 py-16 text-center sm:px-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]"><Microscope size={27} strokeWidth={1.4} /></div>
          <h3 className="text-xl font-semibold tracking-tight text-[#202630] dark:text-white">The library is taking shape.</h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[#737d89] dark:text-zinc-400">Sferavis publications will appear here as research outputs are released. Each entry will include its authors, publication details, abstract and a link to the original work.</p>
          <div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#a30000]"><span>Research updates coming soon</span><ArrowUpRight size={14} /></div>
        </div>
      </section>
    </div>
  </div>
);
