import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Logo } from './Logo';
import { AladinSkyViewer } from './AladinSkyViewer';

interface LaunchSferavisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchSferavisModal: React.FC<LaunchSferavisModalProps> = ({ isOpen, onClose }) => {
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
        className={`dark relative flex w-full flex-col overflow-hidden border border-slate-700/80 bg-[#070b14] shadow-2xl ${
          isFullscreen ? 'h-screen rounded-none border-none' : 'h-[94vh] max-w-7xl rounded-2xl'
        }`}
      >
        <header className="z-20 flex shrink-0 items-center justify-between border-b border-slate-800 bg-[#0e1628] px-4 py-2.5">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen((current) => !current)}
              className="border border-transparent p-2 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
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
          <AladinSkyViewer className="h-full" />
        </div>
      </div>
    </div>
  );
};
