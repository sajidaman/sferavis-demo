import React from 'react';
import { ArrowUpRight, Microscope } from 'lucide-react';
import { PageId } from '../types';

interface PublicationsPageProps {
  onNavigate: (page: PageId) => void;
}

export const PublicationsPage: React.FC<PublicationsPageProps> = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
    <div className="relative mx-auto max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171b22] sm:text-6xl lg:text-7xl dark:text-white">Publications<span className="text-[#a30000]">.</span></h1>
      </header>
      <section aria-label="Sferavis publication archive" className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/60 shadow-[0_16px_50px_rgba(20,30,45,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1220]/55">
        <div className="border-b border-black/[0.07] px-6 py-6 sm:px-8 dark:border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">Sferavis archive</p>
        </div>
        <div className="flex flex-col items-center px-6 py-16 text-center sm:px-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]"><Microscope size={27} strokeWidth={1.4} /></div>
          <div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]"><span className="text-black dark:text-white">Publication updates coming soon</span><ArrowUpRight size={14} className="text-[#a30000]" /></div>
        </div>
      </section>
    </div>
  </div>
);
