import React, { useEffect, useState } from 'react';
import { Accessibility, Moon, RotateCcw, Sun, Type, X } from 'lucide-react';

type RangeSettingProps = {
  id: string; label: string; value: number; min: number; max: number;
  step?: number; output: string; minLabel: string; maxLabel: string;
  onChange: (value: number) => void;
};

const RangeSetting: React.FC<RangeSettingProps> = ({ id, label, value, min, max, step = 1, output, minLabel, maxLabel, onChange }) => (
  <div className="rounded-xl border border-slate-200 px-2.5 py-2.5 dark:border-slate-700">
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label htmlFor={id} className="text-[13px] font-medium">{label}</label>
      <output htmlFor={id} className="text-[11px] font-semibold text-[#8B0000] dark:text-red-300">{output}</output>
    </div>
    <input id={id} type="range" min={min} max={max} step={step} value={value}
      onChange={(event) => onChange(Number(event.target.value))} className="sferavis-a11y-range w-full" />
    <div className="mt-1 flex justify-between text-[9px] text-slate-500 dark:text-slate-400"><span>{minLabel}</span><span>{maxLabel}</span></div>
  </div>
);

type AccessibilityControlsProps = { isDark: boolean; onSetDark: (dark: boolean) => void };

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ isDark, onSetDark }) => {
  const [open, setOpen] = useState(false);
  const [textScale, setTextScale] = useState(() => Number(localStorage.getItem('sferavis-a11y-text-scale')) || 100);
  const [lineSpacing, setLineSpacing] = useState(() => Number(localStorage.getItem('sferavis-a11y-line-spacing')) || 150);
  const [contrast, setContrast] = useState(() => Number(localStorage.getItem('sferavis-a11y-contrast')) || 0);
  const [linkStyle, setLinkStyle] = useState(() => Number(localStorage.getItem('sferavis-a11y-link-style')) || 0);
  const [motion, setMotion] = useState(() => Number(localStorage.getItem('sferavis-a11y-motion')) || 0);
  const [focusStrength, setFocusStrength] = useState(() => Number(localStorage.getItem('sferavis-a11y-focus-strength')) || 3);
  const [cursorSize, setCursorSize] = useState(() => Number(localStorage.getItem('sferavis-a11y-cursor-size')) || 20);
  const [brightness, setBrightness] = useState(() => Number(localStorage.getItem('sferavis-a11y-brightness')) || 100);

  useEffect(() => {
    localStorage.setItem('sferavis-a11y-settings', JSON.stringify({
      textScale, lineSpacing, contrast, linkStyle, motion, focusStrength, cursorSize, brightness
    }));
    localStorage.setItem('sferavis-a11y-text-scale', String(textScale));
    localStorage.setItem('sferavis-a11y-line-spacing', String(lineSpacing));
    localStorage.setItem('sferavis-a11y-contrast', String(contrast));
    localStorage.setItem('sferavis-a11y-link-style', String(linkStyle));
    localStorage.setItem('sferavis-a11y-motion', String(motion));
    localStorage.setItem('sferavis-a11y-focus-strength', String(focusStrength));
    localStorage.setItem('sferavis-a11y-cursor-size', String(cursorSize));
    localStorage.setItem('sferavis-a11y-brightness', String(brightness));
  }, [textScale, lineSpacing, contrast, linkStyle, motion, focusStrength, cursorSize, brightness]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--a11y-font-scale', String(textScale / 100));
    root.style.filter = `brightness(${brightness / 100})`;
    root.style.setProperty('--a11y-line-height', String(lineSpacing / 100));
    root.style.setProperty('--a11y-focus-width', String(focusStrength) + 'px');
    const center = cursorSize / 2;
    const ringRadius = cursorSize * 0.32;
    const dotRadius = cursorSize * 0.14;
    const stroke = Math.max(1, cursorSize * 0.045);
    const defaultCursor = `<svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}px' height='${cursorSize}px' viewBox='0 0 ${cursorSize} ${cursorSize}'><circle cx='${center}' cy='${center}' r='${dotRadius}' fill='#A30000'/><circle cx='${center}' cy='${center}' r='${ringRadius}' fill='none' stroke='#A30000' stroke-width='${stroke}'/><path d='M${center} ${cursorSize * 0.04}v${cursorSize * 0.18}M${center} ${cursorSize * 0.78}v${cursorSize * 0.18}M${cursorSize * 0.04} ${center}h${cursorSize * 0.18}M${cursorSize * 0.78} ${center}h${cursorSize * 0.18}' stroke='#A30000' stroke-width='${stroke}' stroke-linecap='round'/></svg>`;
    const pointerCursor = `<svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}px' height='${cursorSize}px' viewBox='0 0 ${cursorSize} ${cursorSize}'><circle cx='${center}' cy='${center}' r='${cursorSize * 0.11}' fill='#A30000'/><circle cx='${center}' cy='${center}' r='${ringRadius}' fill='none' stroke='#A30000' stroke-width='${stroke * 1.2}'/></svg>`;
    root.style.setProperty('--a11y-cursor-default', `url("data:image/svg+xml,${encodeURIComponent(defaultCursor)}") ${center} ${center}, auto`);
    root.style.setProperty('--a11y-cursor-pointer', `url("data:image/svg+xml,${encodeURIComponent(pointerCursor)}") ${center} ${center}, pointer`);
    root.classList.toggle('a11y-contrast-1', contrast === 1);
    root.classList.toggle('a11y-contrast-2', contrast === 2);
    root.classList.toggle('a11y-link-style-1', linkStyle === 1);
    root.classList.toggle('a11y-link-style-2', linkStyle === 2);
    root.classList.toggle('a11y-motion-1', motion === 1);
    root.classList.toggle('a11y-motion-2', motion === 2);
  }, [textScale, lineSpacing, contrast, linkStyle, motion, focusStrength, cursorSize, brightness]);

  const reset = () => {
    setTextScale(100); setLineSpacing(150); setContrast(0);
    setLinkStyle(0); setMotion(0); setFocusStrength(3); setCursorSize(20); setBrightness(100);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[80]">
      {open && (
        <section id="sferavis-accessibility-panel" aria-label="Accessibility and display settings"
          className="mb-2.5 h-[min(30rem,calc(100dvh-7rem))] w-[min(21rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#11151e] dark:text-white">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold tracking-wide">Accessibility</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close accessibility settings"
              className="rounded-lg p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:hover:bg-slate-800"><X size={17} aria-hidden="true" /></button>
          </div>

          <div className="space-y-3">
            <section aria-labelledby="a11y-display-heading" className="space-y-1.5">
              <h3 id="a11y-display-heading" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Sun size={12} aria-hidden="true" /> Display</h3>
              <div className="rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-700">
                <span className="mb-1.5 block text-[13px] font-medium">Colour theme</span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Colour theme">
                  <button type="button" aria-pressed={!isDark} onClick={() => onSetDark(false)}
                    className={`inline-flex items-center justify-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${!isDark ? 'border-[#8B0000] bg-red-50 text-[#8B0000] dark:bg-red-950/40 dark:text-red-200' : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                    <Sun size={14} aria-hidden="true" /> Light
                  </button>
                  <button type="button" aria-pressed={isDark} onClick={() => onSetDark(true)}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] ${isDark ? 'border-[#8B0000] bg-red-50 text-[#8B0000] dark:bg-red-950/40 dark:text-red-200' : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                    <Moon size={14} aria-hidden="true" /> Dark
                  </button>
                </div>
              </div>
              <RangeSetting id="a11y-brightness" label="Brightness" value={brightness} min={50} max={150} step={1} output={String(brightness) + '%'} minLabel="Dim" maxLabel="Bright" onChange={setBrightness} />
              <RangeSetting id="a11y-text-scale" label="Text size" value={textScale} min={100} max={150} step={1} output={String(textScale) + '%'} minLabel="Default" maxLabel="Larger" onChange={setTextScale} />
              <RangeSetting id="a11y-line-spacing" label="Line spacing" value={lineSpacing} min={130} max={220} step={1} output={(lineSpacing / 100).toFixed(2) + '×'} minLabel="Compact" maxLabel="Spacious" onChange={setLineSpacing} />
            </section>

            <section aria-labelledby="a11y-reading-heading" className="space-y-2">
              <h3 id="a11y-reading-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Type size={12} aria-hidden="true" /> Reading support</h3>
              <RangeSetting id="a11y-contrast" label="Contrast" value={contrast} min={0} max={2} step={1} output={['Standard', 'High', 'Maximum'][contrast]} minLabel="Standard" maxLabel="Maximum" onChange={setContrast} />
              <RangeSetting id="a11y-links" label="Link emphasis" value={linkStyle} min={0} max={2} step={1} output={['Standard', 'Underline', 'Underline + bold'][linkStyle]} minLabel="Standard" maxLabel="Strong" onChange={setLinkStyle} />
            </section>

            <section aria-labelledby="a11y-navigation-heading" className="space-y-2">
              <h3 id="a11y-navigation-heading" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Accessibility size={12} aria-hidden="true" /> Navigation</h3>
              <RangeSetting id="a11y-motion" label="Motion" value={motion} min={0} max={2} step={1} output={['Full', 'Reduced', 'Minimal'][motion]} minLabel="Full" maxLabel="Minimal" onChange={setMotion} />
              <RangeSetting id="a11y-focus" label="Keyboard focus indicator" value={focusStrength} min={1} max={6} step={0.25} output={String(focusStrength) + 'px'} minLabel="Subtle" maxLabel="Strong" onChange={setFocusStrength} />
              <RangeSetting id="a11y-cursor-size" label="Cursor size" value={cursorSize} min={16} max={48} step={1} output={String(cursorSize) + "px"} minLabel="Small" maxLabel="Large" onChange={setCursorSize} />
            </section>
          </div>

          <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#8B0000] hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000] dark:text-red-300 dark:hover:bg-red-950/40">
            <RotateCcw size={12} aria-hidden="true" /> Reset accessibility settings
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
