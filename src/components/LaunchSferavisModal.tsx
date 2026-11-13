import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AladinSkyViewer } from './AladinSkyViewer';

interface LaunchSferavisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchSferavisModal: React.FC<LaunchSferavisModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SFERAVIS_CLOSE_STUDIO') onClose();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] h-[100dvh] w-screen overflow-hidden bg-[#03050b]"
      role="dialog"
      aria-modal="true"
      aria-label="Sferavis celestial atlas"
    >
      <AladinSkyViewer className="h-full w-full" />

      <div className="pointer-events-none absolute right-4 top-4 z-40 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Atlas"
          title="Close Atlas"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/80 shadow-lg backdrop-blur-md transition hover:border-white/35 hover:bg-black/85 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
