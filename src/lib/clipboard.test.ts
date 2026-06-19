import { describe, it, expect, vi } from 'vitest';
import { onToast, emitToast } from './clipboard';

describe('toast pubsub', () => {
  it('notifies listeners and unsubscribes', () => {
    const fn = vi.fn();
    const off = onToast(fn);
    emitToast('hi');
    expect(fn).toHaveBeenCalledWith('hi');
    off();
    emitToast('bye');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
