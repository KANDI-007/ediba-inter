import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface MobileOptimizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

const MobileOptimizedModal: React.FC<MobileOptimizedModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
  showCloseButton = true
}) => {
  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full'
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300"
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - Full screen sur mobile, centré sur desktop */}
      <div className="fixed inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 z-50">
        <div
          className={`
            bg-white w-full h-full sm:h-auto sm:w-full ${maxWidthClasses[maxWidth]} sm:rounded-2xl 
            shadow-2xl transform transition-all duration-300
            flex flex-col
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Sticky sur mobile */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-white border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate flex-1 pr-4">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="
                  p-2 -mr-2 text-gray-400 hover:text-gray-600 
                  touch-manipulation min-h-[44px] min-w-[44px] 
                  flex items-center justify-center
                  rounded-lg hover:bg-gray-100 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                aria-label="Fermer"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </div>

          {/* Footer - Sticky sur mobile */}
          {footer && (
            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-white border-t border-gray-200 flex-shrink-0 sm:rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedModal;

