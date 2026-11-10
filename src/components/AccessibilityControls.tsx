import React, { useEffect, useState } from 'react';
import { Accessibility, Contrast, RotateCcw, Type, Underline, X } from 'lucide-react';

export const AccessibilityControls: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [underlinedLinks, setUnderlinedLinks] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-large-text', largeText);
    root.classList.toggle('a11y-high-contrast', highContrast);
    root.classList.toggle('a11y-underlined-links', underlinedLinks);
    root.classList.toggle('a11y-reduced-motion', reducedMotion);
  }, [largeText, highContrast, underlinedLinks, reducedMotion]);

  const reset = () => {
    setLargeText(false);
    setHighContrast(false);
    setUnderlinedLinks(false);
    setReducedMotion(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[80]">
      {open && (
        <section id="sferavis-accessibility-panel" aria-label="Accessibility settings" className="mb-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#11151e] dark:text-white">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold tracking-wide">Accessibility</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close accessibility settings" className="rounded-lg p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:hover:bg-slate-800">
              <X size={17} aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-2">
            <button type="button" aria-pressed={largeText} onClick={() => setLargeText(v => !v)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:border-slate-700 dark:hover:bg-slate-800">
              <Type size={18} aria-hidden="true" /><span className="flex-1">Larger text</span><span className="text-xs font-semibold">{largeText ? 'On' : 'Off'}</span>
            </button>
            <button type="button" aria-pressed={highContrast} onClick={() => setHighContrast(v => !v)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:border-slate-700 dark:hover:bg-slate-800">
              <Contrast size={18} aria-hidden="true" /><span className="flex-1">High contrast</span><span className="text-xs font-semibold">{highContrast ? 'On' : 'Off'}</span>
            </button>
            <button type="button" aria-pressed={underlinedLinks} onClick={() => setUnderlinedLinks(v => !v)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:border-slate-700 dark:hover:bg-slate-800">
              <Underline size={18} aria-hidden="true" /><span className="flex-1">Underline links</span><span className="text-xs font-semibold">{underlinedLinks ? 'On' : 'Off'}</span>
            </button>
            <button type="button" aria-pressed={reducedMotion} onClick={() => setReducedMotion(v => !v)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:border-slate-700 dark:hover:bg-slate-800">
              <Accessibility size={18} aria-hidden="true" /><span className="flex-1">Reduce animations</span><span className="text-xs font-semibold">{reducedMotion ? 'On' : 'Off'}</span>
            </button>
          </div>
          <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#8B0000] hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:text-red-300 dark:hover:bg-red-950/40">
            <RotateCcw size={14} aria-hidden="true" /> Reset settings
          </button>
        </section>
      )}
      <button type="button" aria-label="Open accessibility settings" aria-expanded={open} aria-controls="sferavis-accessibility-panel" onClick={() => setOpen(v => !v)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[#8B0000] text-white shadow-xl transition hover:bg-[#700000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300">
        <Accessibility size={23} aria-hidden="true" />
      </button>
    </div>
  );
};
