import React from 'react';
import { PageId } from '../types';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onLaunchSferavis: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLaunchSferavis }) => {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden px-4 py-20 text-center text-slate-900 dark:text-white">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A30000]/10 blur-[140px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <h1 className="text-4xl font-oswald font-black uppercase leading-[0.98] tracking-tight text-slate-950 dark:text-white text-balance sm:text-6xl lg:text-8xl">
          Exploring the{' '}
          <span className="text-[#A30000]">Infrared Universe.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-700 dark:text-zinc-300 text-balance sm:text-xl">
          An independent science platform exploring the SPHEREx mission, its near-infrared survey, and the astrophysics behind cosmic inflation, galaxy formation, and the origins of interstellar ices.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
<button
  type="button"
  onClick={onLaunchSferavis}
  className="inline-flex items-center gap-2 bg-[#A30000] px-8 py-4 text-xs font-lexend font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#8B0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] focus-visible:ring-offset-2"
>
  Launch Sferavis <ArrowRight className="h-4 w-4" />
</button>
<button
            type="button"
            onClick={() => onNavigate('spherex')}
            className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-8 py-4 text-xs font-lexend font-semibold uppercase tracking-wider text-slate-800 transition-colors hover:border-[#A30000] hover:text-[#A30000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-200 dark:hover:border-[#A30000] dark:hover:text-white"
          >
            The SPHEREx Mission <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};
