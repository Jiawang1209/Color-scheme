import { useEffect, useRef, useState } from 'react';
import { onToast } from '../lib/clipboard';

interface ToastItem { id: number; msg: string; }

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  useEffect(() => onToast((msg) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1600);
  }), []);
  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span className="toast-check">✓</span>{t.msg}
        </div>
      ))}
    </div>
  );
}
