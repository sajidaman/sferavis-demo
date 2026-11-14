import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Logo } from './Logo';

interface PlanetariumTutorialProps {
  onDismiss: () => void;
  onFinish: () => void;
}

export const PLANETARIUM_TUTORIAL_STORAGE_KEY = 'sferavisPlanetariumFinished';

const steps = [
  {
    title: 'Welcome to Sferavis',
    description:
      'Explore the sky with the Sferavis planetarium. This short guide introduces the atlas controls and helps you get started.',
    detail: 'The atlas opens on the Galactic Center using a representative SPHEREx DR1 channel from its all-sky cube.',
  },
  {
    title: 'Choose a sky position',
    description:
      'Enter Right Ascension (RA) and declination (Dec) in decimal degrees, then choose Go To Coordinates to center the view.',
    detail: 'RA ranges from 0° to 360°. Dec ranges from −90° to +90°.',
  },
  {
    title: 'Compare the image surveys',
    description:
      'Choose a SPHEREx DR1 wavelength channel, or switch to DSS2 Reference for an optical view of the same region.',
    detail:
      'The slider browses all 102 released cube frames. Frames 50 and 51 are blank in DR1; deep zooms can load real exposure detail.',
  },
  {
    title: 'Adjust your view',
    description:
      'Change the field of view to zoom, choose an Aitoff, gnomonic, or orthographic projection, and toggle the coordinate grid.',
    detail: 'Reset View returns the atlas to its starting sky position and projection.',
  },
  {
    title: 'Ready to explore?',
    description:
      'Try a sky position, compare the infrared and optical layers, and explore the atlas at different scales.',
    detail:
      'For calibrated SPHEREx science products, use the official NASA/IPAC IRSA archive.',
  },
];

export const PlanetariumTutorial: React.FC<PlanetariumTutorialProps> = ({ onDismiss, onFinish }) => {
  const [activeStep, setActiveStep] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const step = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onDismiss();
    } else if (event.key === 'ArrowRight' && activeStep < steps.length - 1) {
      event.preventDefault();
      setActiveStep((current) => current + 1);
    } else if (event.key === 'ArrowLeft' && activeStep > 0) {
      event.preventDefault();
      setActiveStep((current) => current - 1);
    }
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onDismiss}
      onKeyDown={handleKeyDown}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="planetarium-tutorial-title"
        className="flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-xl border border-slate-300 bg-[#f7f5f3] p-5 text-[#151515] shadow-2xl sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-7 flex items-center justify-between gap-4 border-b border-zinc-300 pb-5">
          <div className="flex min-w-0 items-center gap-4">
            <Logo size="sm" variant="light" />
            <p className="font-lexend text-[10px] uppercase tracking-[0.16em] text-zinc-600 sm:text-xs">
              Sferavis / Getting started
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onDismiss}
            aria-label="Close planetarium guide"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-[#A30000] hover:bg-[#A30000] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="mb-3 flex items-center justify-between font-lexend text-[10px] uppercase tracking-widest text-zinc-500">
          <span>Planetarium guide</span>
          <span aria-live="polite">
            {String(activeStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
        </div>
        <div
          className="mb-7 h-1.5 overflow-hidden rounded-full bg-zinc-300"
          role="progressbar"
          aria-label="Guide progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={activeStep + 1}
        >
          <div
            className="h-full rounded-full bg-[#A30000] transition-all"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div key={activeStep} className="flex-1">
          <h2
            id="planetarium-tutorial-title"
            className="font-oswald text-3xl font-bold uppercase tracking-wide text-zinc-950 sm:text-4xl"
          >
            {step.title}
          </h2>
          <p className="mt-4 max-w-2xl font-merriweather text-sm leading-7 text-zinc-700 sm:text-base">
            {step.description}
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-lg border-l-4 border-[#A30000] bg-white px-4 py-3">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#A30000]" aria-hidden="true" />
            <p className="font-lexend text-xs leading-6 text-zinc-700">{step.detail}</p>
          </div>
          {isLastStep && (
            <a
              href="https://irsa.ipac.caltech.edu/Missions/spherex.html"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-lexend text-xs font-bold uppercase tracking-wider text-[#8B0000] underline underline-offset-4 hover:text-black"
            >
              SPHEREx archive at IRSA <ChevronRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <footer className="mt-8 flex items-center justify-between gap-3 border-t border-zinc-300 pt-5">
          <button
            type="button"
            onClick={() => setActiveStep((current) => current - 1)}
            disabled={activeStep === 0}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-400 px-4 py-2.5 font-lexend text-xs font-semibold text-zinc-800 transition hover:border-[#A30000] disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {isLastStep ? (
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 rounded-md bg-[#A30000] px-5 py-2.5 font-lexend text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8B0000]"
            >
              Start exploring <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveStep((current) => current + 1)}
              className="inline-flex items-center gap-1 rounded-md bg-[#A30000] px-5 py-2.5 font-lexend text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8B0000]"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </footer>
      </section>
    </div>
  );
};
