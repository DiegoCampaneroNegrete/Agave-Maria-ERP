import { Toast, toastsAtom } from '@/store/toastStore';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useAtom(toastsAtom);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    const newToast: Toast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, [setToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, [setToasts]);

  return { addToast, removeToast, toasts };
}
