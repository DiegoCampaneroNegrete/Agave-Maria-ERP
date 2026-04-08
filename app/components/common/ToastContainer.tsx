'use client';

import { useToast } from '@/hooks/useToast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getStyles = (type: string) => {
    const baseStyles = 'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white font-semibold animate-pulse transition-all duration-300';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-black`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500`;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={getStyles(toast.type)}
          style={{
            bottom: `${index * 70 + 16}px`,
            pointerEvents: 'auto',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{getIcon(toast.type)}</span>
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
