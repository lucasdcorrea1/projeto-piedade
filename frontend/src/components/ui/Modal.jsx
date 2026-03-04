import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function Modal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-2xl shadow-2xl z-10 animate-slide-up sm:animate-fade-in"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Handle bar on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
            >
              <X size={20} />
            </button>
          </div>

          {children ? (
            <div className="mb-6">{children}</div>
          ) : (
            <div className="text-sm text-gray-600 mb-6">{message}</div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`${danger ? 'btn-danger' : 'btn-primary'} w-full sm:w-auto`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
