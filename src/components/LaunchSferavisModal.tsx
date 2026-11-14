import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2, Moon, Sun, X } from 'lucide-react';
import { Logo } from './Logo';
import { AladinSkyViewer } from './AladinSkyViewer';

interface LaunchSferavisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const LaunchSferavisModal: React.FC<LaunchSferavisModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SFERAVIS_CLOSE_STUDIO') onClose();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setIsFullscreen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 lg:p-6'
      }`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`relative flex w-full flex-col overflow-hidden border shadow-2xl ${
          isDark ? 'border-slate-700/80 bg-[#070b14] text-slate-100' : 'border-slate-200 bg-white text-slate-900'
        } ${
          isFullscreen ? 'h-screen rounded-none border-none' : 'h-[94vh] max-w-7xl rounded-2xl'
        }`}
      >
        <header
          className={`z-20 flex shrink-0 items-center justify-between border-b px-4 py-2.5 ${
            isDark ? 'border-slate-800 bg-[#0e1628]' : 'border-slate-200 bg-white'
          }`}
        >
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`border p-2 transition-colors ${
                isDark
                  ? 'border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              aria-pressed={isDark}
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((current) => !current)}
              className={`border border-transparent p-2 transition-colors ${
                isDark
                  ? 'text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  : 'text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 bg-[#A30000] px-3 py-1.5 text-xs font-lexend uppercase tracking-wider text-white transition-colors hover:bg-[#8B0000]"
              aria-label="Close atlas"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </header>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AladinSkyViewer className="h-full" isDark={isDark} />
        </div>
      </div>
    </div>
  );
};
