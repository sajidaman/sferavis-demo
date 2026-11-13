import React, { useEffect, useState } from 'react';
import { Accessibility, Moon, RotateCcw, Sun, Type, X } from 'lucide-react';

type RangeSettingProps = {
  id: string; label: string; value: number; min: number; max: number;
  step?: number; output: string; minLabel: string; maxLabel: string;
  onChange: (value: number) => void;
};

const RangeSetting: React.FC<RangeSettingProps> = ({ id, label, value, min, max, step = 1, output, minLabel, maxLabel, onChange }) => (
  <div className="rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-700">
    <div className="mb-2 flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <output htmlFor={id} className="text-xs font-semibold text-[#8B0000] dark:text-red-300">{output}</output>
    </div>
    <input id={id} type="range" min={min} max={max} step={step} value={value}
      onChange={(event) => onChange(Number(event.target.value))} className="sferavis-a11y-range w-full" />
    <div className="mt-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400"><span>{minLabel}</span><span>{maxLabel}</span></div>
  </div>
);

type AccessibilityControlsProps = { isDark: boolean; onSetDark: (dark: boolean) => void };

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ isDark, onSetDark }) => {
  const [open, setOpen] = useState(false);
  const [textScale, setTextScale] = useState(100);
  const [lineSpacing, setLineSpacing] = useState(150);
  const [contrast, setContrast] = useState(0);
  const [linkStyle, setLinkStyle] = useState(0);
  const [motion, setMotion] = useState(0);
  const [focusStrength, setFocusStrength] = useState(3);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--a11y-font-scale', String(textScale / 100));
    root.style.setProperty('--a11y-line-height', String(lineSpacing / 100));
    root.style.setProperty('--a11y-focus-width', String(focusStrength) + 'px');
    root.classList.toggle('a11y-contrast-1', contrast === 1);
    root.classList.toggle('a11y-contrast-2', contrast === 2);
    root.classList.toggle('a11y-link-style-1', linkStyle === 1);
    root.classList.toggle('a11y-link-style-2', linkStyle === 2);
    root.classList.toggle('a11y-motion-1', motion === 1);
    root.classList.toggle('a11y-motion-2', motion === 2);
  }, [textScale, lineSpacing, contrast, linkStyle, motion, focusStrength]);

  const reset = () => {
    setTextScale(100); setLineSpacing(150); setContrast(0);
    setLinkStyle(0); setMotion(0); setFocusStrength(3);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[80]">
      {open && (
        <section id="sferavis-accessibility-panel" aria-label="Accessibility and display settings"
          className="mb-3 max-h-[min(78vh,42rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#11151e] dark:text-white">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-bold tracking-wide">Accessibility</h2>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Adjust how Sferavis looks and feels</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close accessibility settings"
              className="rounded-lg p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:hover:bg-slate-800"><X size={17} aria-hidden="true" /></button>
          </div>

          <div className="space-y-4">
            <section aria-labelledby="a11y-display-heading" className="space-y-2">
              <h3 id="a11y-display-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Sun size={14} aria-hidden="true" /> Display</h3>
              <div className="rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between"><span className="text-sm font-medium">Colour theme</span>
                  <span className="text-xs font-semibold text-[#8B0000] dark:text-red-300">{isDark ? 'Dark' : 'Light'}</span></div>
                <div className="flex items-center gap-3">
                  <Sun size={17} aria-hidden="true" />
                  <input aria-label="Colour theme: light to dark" type="range" min="0" max="1" step="1" value={isDark ? 1 : 0}
                    onChange={(event) => onSetDark(event.target.value === '1')} className="sferavis-a11y-range flex-1" />
                  <Moon size={17} aria-hidden="true" />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400"><span>Light</span><span>Dark</span></div>
              </div>
              <RangeSetting id="a11y-text-scale" label="Text size" value={textScale} min={100} max={150} step={5} output={String(textScale) + '%'} minLabel="Default" maxLabel="Larger" onChange={setTextScale} />
              <RangeSetting id="a11y-line-spacing" label="Line spacing" value={lineSpacing} min={130} max={220} step={5} output={(lineSpacing / 100).toFixed(2) + '×'} minLabel="Compact" maxLabel="Spacious" onChange={setLineSpacing} />
            </section>

            <section aria-labelledby="a11y-reading-heading" className="space-y-2">
              <h3 id="a11y-reading-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Type size={14} aria-hidden="true" /> Reading support</h3>
              <RangeSetting id="a11y-contrast" label="Contrast" value={contrast} min={0} max={2} output={['Standard', 'High', 'Maximum'][contrast]} minLabel="Standard" maxLabel="Maximum" onChange={setContrast} />
              <RangeSetting id="a11y-links" label="Link emphasis" value={linkStyle} min={0} max={2} output={['Standard', 'Underline', 'Underline + bold'][linkStyle]} minLabel="Standard" maxLabel="Strong" onChange={setLinkStyle} />
            </section>

            <section aria-labelledby="a11y-navigation-heading" className="space-y-2">
              <h3 id="a11y-navigation-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Accessibility size={14} aria-hidden="true" /> Navigation</h3>
              <RangeSetting id="a11y-motion" label="Motion" value={motion} min={0} max={2} output={['Full', 'Reduced', 'Minimal'][motion]} minLabel="Full" maxLabel="Minimal" onChange={setMotion} />
              <RangeSetting id="a11y-focus" label="Keyboard focus indicator" value={focusStrength} min={2} max={6} output={String(focusStrength) + 'px'} minLabel="Subtle" maxLabel="Strong" onChange={setFocusStrength} />
            </section>
          </div>

          <button type="button" onClick={reset} className="mt-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-[#8B0000] hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:text-red-300 dark:hover:bg-red-950/40">
            <RotateCcw size={14} aria-hidden="true" /> Reset accessibility settings
          </button>
        </section>
      )}
      <button type="button" aria-label="Open accessibility settings" aria-expanded={open} aria-controls="sferavis-accessibility-panel"
        onClick={() => setOpen(v => !v)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[#8B0000] text-white shadow-xl transition hover:bg-[#700000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300">
        <Accessibility size={23} aria-hidden="true" />
      </button>
    </div>
  );
};
