import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full ${maxWidth} border border-white/[0.12] bg-[#0E1015] p-6 shadow-2xl transition-all my-8`}
      >
        {/* Corner registration marks */}
        <span className="absolute top-2 left-2 text-[8px] font-mono text-white/20 select-none">+</span>
        <span className="absolute top-2 right-2 text-[8px] font-mono text-white/20 select-none">+</span>
        <span className="absolute bottom-2 left-2 text-[8px] font-mono text-white/20 select-none">+</span>
        <span className="absolute bottom-2 right-2 text-[8px] font-mono text-white/20 select-none">+</span>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <h3 className="text-xs font-mono font-bold text-archival-amber tracking-widest uppercase">
            {title || 'EXHIBIT ARTIFACT INSPECTOR'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-museum-muted hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
