type ToastListener = (msg: string) => void;
const listeners = new Set<ToastListener>();

export function onToast(fn: ToastListener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function emitToast(msg: string): void {
  listeners.forEach((l) => l(msg));
}

/** Copy text to clipboard and show a toast. */
export function copyText(text: string, message?: string): void {
  navigator.clipboard?.writeText(text);
  emitToast(message ?? `已复制 ${text}`);
}
