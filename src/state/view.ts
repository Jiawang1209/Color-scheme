export type AppView = 'library' | 'picker' | 'image';
export const DEFAULT_VIEW: AppView = 'library';

export function readView(search: string): AppView {
  const v = new URLSearchParams(search).get('view');
  return v === 'picker' || v === 'image' ? v : 'library';
}
export function writeView(search: string, view: AppView): string {
  const p = new URLSearchParams(search);
  p.set('view', view);
  return p.toString();
}
