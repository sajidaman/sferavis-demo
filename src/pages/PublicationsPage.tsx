import React from 'react';
import { Microscope } from 'lucide-react';

export const PublicationsPage: React.FC = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
    <div className="relative mx-auto max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#a30000] sm:text-6xl lg:text-7xl">
          Publications.
        </h1>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#a30000]">
          Publication updates coming soon
        </p>
      </header>

      <section
        aria-label="Sferavis archive"
        className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/60 shadow-[0_16px_50px_rgba(20,30,45,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1220]/55"
      >
        <div className="border-b border-black/[0.07] px-6 py-6 dark:border-white/10 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a30000]">
            Sferavis archive
          </p>
        </div>
        <div className="flex items-center justify-center px-6 py-16 sm:px-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#a30000]/15 bg-[#a30000]/[0.06] text-[#a30000]">
            <Microscope size={27} strokeWidth={1.4} />
          </div>
        </div>
      </section>
    </div>
  </div>
);
