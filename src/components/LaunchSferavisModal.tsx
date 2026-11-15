import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Logo } from './Logo';

interface LaunchSferavisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const LaunchSferavisModal: React.FC<LaunchSferavisModalProps> = ({
  isOpen,
  onClose,
  isDark,
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
          isFullscreen ? 'h-screen rounded-none border-none' : 'h-[94vh] max-w-6xl rounded-2xl'
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
              onClick={() => setIsFullscreen((current) => !current)}
              className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors ${
                isDark
                  ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
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
          <iframe
            src={`${import.meta.env.BASE_URL}atlas/index.html?theme=${isDark ? "dark" : "light"}`}
            title="InfraSphere SPHEREx atlas"
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen; geolocation"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
